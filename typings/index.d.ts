/// <reference path="./types/index.d.ts" />

interface IAppOption {
    globalData: {
        initialize: number
        navInfo: NavInfo
        userInfo: UserInfo,
    }
    userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface UserInfo extends WechatMiniprogram.UserInfo {
    openid: string
}

interface NavInfo {
    Custom: WechatMiniprogram.ClientRect
    CustomBar: number
    StatusBar: number
}