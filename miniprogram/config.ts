let CONFIG = {
    env: "live",
    version: '0.0.1',
    baseURL: 'http://127.0.0.1:80',     // 填写你的线上地址
    shareProfile: '豆流',
    appid: "wx7752b4b866490bdd", // 填写你的appid
    cloudEnvId: "xxx", // 云托管id
    serviceName: "xxx s" // 云托管服务名
  };
  // 本地调试解除注释下面行
  CONFIG.env = "local"
  
  if (CONFIG.env == "local") {
    CONFIG.baseURL = 'http://127.0.0.1:80'
  }
  export default CONFIG