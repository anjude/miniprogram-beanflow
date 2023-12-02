
import CONFIG from '../config'
import { Mutex } from 'async-mutex';
export class CloudManager {
  private static mutex: Mutex = new Mutex();
  private static cloud: any;
  private static initDone: boolean = false

  private constructor() { }

  public static async getInstance(): Promise<any> {
    if (!CloudManager.initDone) {
      await CloudManager.mutex.acquire();
      try {
        if (!CloudManager.initDone) {
          console.log("init cloud");
          // @ts-ignore
          CloudManager.cloud = new wx.cloud.Cloud({
            resourceAppid: CONFIG.appid,
            resourceEnv: CONFIG.cloudEnvId,
          });
          await CloudManager.cloud.init();
          CloudManager.initDone = true
        }
      } finally {
        CloudManager.mutex.release();
      }
    }
    return CloudManager.cloud;
  }
}

export async function testSingletonConcurrently() {
  const instances = await Promise.all(
    new Array(10).fill(null).map(() => CloudManager.getInstance())
  );
  console.log(instances);

  console.log(instances.every(instance => instance === instances[0])); // 输出 true，说明只创建了一个实例
}

// testSingletonConcurrently();