import flow from "../../api/flow"
import { NoteView } from "../../model/note"

const app = getApp<IAppOption>()

Page({
    data: {
        noteList: [] as NoteView[],
        openid: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(e) {
        let openid = e.openid as unknown as string
        if (!openid) {
            return
        }
        this.data.openid = openid
        this.initNoteList()
    },

    onShareAppMessage: function () {
        // pages/index/index?scene=gf$coder_bean
        return {
            title: "我的信息流哦！",
            path: `/pages/index/index?scene=gf$${this.data.openid}`
        }
    },

    onPullDownRefresh() {
        this.initNoteList();
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 500);
    },

    onReachBottom() {
        flow.noteList({
            openid: this.data.openid,
            offset: this.data.noteList.length,
            limit: 10
        }).then(res => {
            this.setData({
                commentList: this.data.noteList.concat(res.data.list)
            })
        })
    },

    initNoteList() {
        this.data.noteList = []
        flow.noteList({
            openid: this.data.openid,
            offset: this.data.noteList.length,
            limit: 10
        }).then(res => {
            this.setData({
                noteList: this.data.noteList.concat(res.data.list)
            })
        })
    },

    onDetail(e: WechatMiniprogram.TouchEvent) {
        wx.navigateTo({
            url: `/pages/info/detail/detail?noteId=${e.currentTarget.dataset.id}`,
        })
    },
})