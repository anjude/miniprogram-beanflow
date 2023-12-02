import CONFIG from "../config";
import { CloudManager } from "./cloud-manager";
import { camelToUnderline, getToken, saveToken, underlineToCamel } from "./util";
const app = getApp<IAppOption>()
const baseURL = CONFIG.baseURL

// 用于封装小程序的request
interface ReqConfig extends ICloud.CallContainerParam {
  // add any additional properties or methods here
  url: string;
  header?: Record<string, any>;
  method: "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined;
  params: any
  data?: any;
}

interface IResponse {
  errCode: number;
  data: any;
  msg: string;
  detail: string;
}

class Request {
  private static instance: Request;

  private constructor() { }

  public static getInstance(): Request {
    if (!Request.instance) {
      Request.instance = new Request();
    }
    return Request.instance;
  }


  private async getRequest(config: ReqConfig): Promise<IResponse> {
    if (CONFIG.env == "local") {
      return this.wxRequest(config)
    }
    return this.request(config)
  }

  private async request(config: ReqConfig): Promise<IResponse> {
    let cloud = await CloudManager.getInstance()
    // console.log(111, cloud);
    // 打印请求参数
    config = this.requestInterceptor(config)
    // const { service, dataType, responseType, timeout, verbose, followRedirect } = config;
    let { path, method, data, header = {} } = config;
    // console.log('请求参数:', { path, method, data, header, service, dataType, responseType, timeout, verbose, followRedirect }, cloud);

    return new Promise((resolve, reject) => {
      header["X-WX-SERVICE"] = CONFIG.serviceName
      cloud.callContainer({
        config: {
          env: CONFIG.cloudEnvId,
        },
        responseType: config.params.responseType,
        path,
        method,
        // timeout: 5 * 1000,
        header,
        data: JSON.stringify(data),
        success: (res: IResponse) => {
          // 打印返回参数
          // const { data, statusCode, header, callID } = res;
          // console.log('返回参数:', { data, statusCode, header, callID });
          if (res.data.errCode !== 0 && res.data.errCode !== 10004) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          resolve(res)
        },
        fail: (err: any) => {
          reject(err);
        }
      });
    }).then(res => {
      return this.responseInterceptor(res as IResponse, config)
    })
  }


  private async wxRequest(config: ReqConfig): Promise<IResponse> {
    config = this.requestInterceptor(config)
    return new Promise((resolve, reject) => {
      wx.request({
        method: config.method,
        url: baseURL + config.path,
        data: config.data,
        responseType: config.params.responseType,
        // timeout: 5 * 1000,
        header: config.header,
        success: (res: any) => {
          if (res.data.errCode !== 0 && res.data.errCode !== 10004) {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
          resolve(res)
        },
        fail: (err) => {
          console.log("wx request fail ", err)
          reject(err)
        }
      })
    }).then(res => {
      return this.responseInterceptor(res as IResponse, config)
    })
  }

  private requestInterceptor(config: ReqConfig): ReqConfig {
    // 在这里可以对请求进行拦截和处理
    if (!config.path) {
      console.error(`[ERROR] Invalid path: ${config.path}`);
      throw new Error("requestInterceptors: invaild path")
    }
    // 请求转成下划线形式
    config.data = camelToUnderline(config.data)
    const reqConfig = { ...config }
    reqConfig.header = {
      'content-type': 'application/json;charset=utf-8;',
    }
    const token = getToken()
    if (token) {
      reqConfig.header.Authorization = token
    }
    return reqConfig
  }

  private responseInterceptor(res: IResponse, config: ReqConfig) {
    // 在这里可以对返回结果进行拦截和处理

    // 返回转成驼峰形式
    res = underlineToCamel(res)
    let { errCode } = res.data
    if (errCode === 0) {
      return res.data
    }
    return new Promise(async (resolve, reject) => {
      if (errCode === 10004) {
        // 重新登录
        wx.login({
          success: async (res) => {
            // @ts-ignore
            const result = await this.get(`/api/user/login?code=${res.code}&app_id=${CONFIG.appid}`)
            let { errCode, data } = result
            if (errCode === 0) {
              saveToken(data.token)
              wx.setStorageSync("openid",data.openid)
              app.globalData.userInfo.openid = data.openid
              // 将上次失败请求重发
              const result = await this.getRequest(config)
              resolve(result)
            } else {
              wx.showToast({
                title: '登录失败',
                icon: 'none'
              })
              reject(res)
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      } else {
        reject(res)
      }
    })
  }

  public get(path: string, params: object = {}) {
    return this.getRequest({
      method: "GET",
      path,
      params
    } as ReqConfig)
  }

  public post(path: string, data: object = {}, params: object = {}) {
    return this.getRequest({
      method: "POST",
      path,
      data,
      params
    } as ReqConfig)
  }

  public put(path: string, data: object = {}, params: object = {}) {
    return this.getRequest({
      method: "PUT",
      path,
      data,
      params,
    } as ReqConfig)
  }

  public _delete(path: string, params: object = {}) {
    return this.getRequest({
      method: "DELETE",
      path,
      params
    } as ReqConfig)
  }
}

export default Request.getInstance();