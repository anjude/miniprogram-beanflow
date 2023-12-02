import { IAppOption } from "../typings";
import { CloudManager } from "./utils/cloud-manager";
import updateManager from "./utils/update-manager";

// app.ts
App<IAppOption>({
    globalData: {
        initialize: 0,
        userInfo: {
            openid: "",
            avatarUrl: "",
            city: "",
            country: "",
            gender: 0,
            language: "en",
            nickName: "",
            province: ""
        }
    },
    onLaunch() {
        // 初始化云托管单例
        CloudManager.getInstance()
        
        this.globalData.userInfo.openid = wx.getStorageSync("openid")
    },

    onShow: function () {
        updateManager();
    },
})