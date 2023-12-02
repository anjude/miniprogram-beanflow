import flow from "../../api/flow"
import { NoteView } from "../../model/note"

const app = getApp<IAppOption>()

Page({
    data: {
        noteList: [] as NoteView[]
    },

    async onLoad(options = {}) {
        if (typeof options.scene === "string") {
            this.dealScene(options.scene)
        }
        this.initNoteList()
    },

    onPullDownRefresh(){
        this.initNoteList();
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 500);
    },

    onReachBottom() {
        flow.userNotes({
            offset: this.data.noteList.length,
            limit: 10
        }).then(res => {
            this.setData({
                commentList: this.data.noteList.concat(res.data.list)
            })
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        // pages/index/index?scene=gf$beancoder
        return {
            title: "我的信息流哦！",
            path: `/pages/index/index?scene=gf$${app.globalData.userInfo.openid}`
        }
    },

    /**
     * 处理场景参数
     * @param scene 
     */
    async dealScene(scene: string) {
        let paramList = scene.split('$')
        let uri = paramList.shift()

        //scene=gf$coder_bean
        switch (uri) {
            case 'gf':  // goflow 
                wx.navigateTo({
                    url: `/pages/info/info?openid=${paramList.shift()}`
                })
                break;
            default:
                break;
        }
    },
    
    initNoteList() {
        this.data.noteList = []
        flow.userNotes({
            offset: this.data.noteList.length,
            limit: 10
        }).then(res => {
            this.setData({
                noteList: this.data.noteList.concat(res.data.list)
            })
        })
    },

    onDel(e: WechatMiniprogram.TouchEvent) {
        wx.showModal({
            content: "确认删除此条信息？",
            success: res => {
                if (res.cancel) {
                    return
                }
                flow.delNote({
                    noteId: e.currentTarget.dataset.id
                }).then(res => {
                    wx.showToast({
                        icon: "none",
                        title: res.msg
                    })
                    this.onPullDownRefresh()
                })
            }
        })
    },

    onDetail(e: WechatMiniprogram.TouchEvent) {
        wx.navigateTo({
            url: `/pages/info/detail/detail?noteId=${e.currentTarget.dataset.id}`,
        })
    },
    onEdit() {
        wx.navigateTo({
            url: "/pages/edit/edit"
        })
    },

})