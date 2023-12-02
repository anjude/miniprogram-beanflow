import flow from "../../api/flow"
import { CreateNoteReq } from "../../model/note"

// pages/edit/edit.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        infoForm: {
            isPublic: false,
            content: "",
        },
    },

    contentInput(e: WechatMiniprogram.TouchEvent) {
        this.data.infoForm.content = e.detail.value
    },
    changePublic(e: WechatMiniprogram.TouchEvent) {
        this.data.infoForm.isPublic = e.detail.value
    },
    submitInfo() {
        let req: CreateNoteReq = {
            isPublic: this.data.infoForm.isPublic ? 1 : 0,
            content: this.data.infoForm.content,
        }
        if (req.content === "") {
            this.submitErr("总得写点什么...")
            return
        }
        flow.createNote(req).then(res => {
            if (res.errCode === 0) {
                wx.showToast({
                    title: "创建成功"
                })
                setTimeout(() => {
                    let pages = getCurrentPages();
                    let lastpage = pages[pages.length - 2]
                    lastpage.onPullDownRefresh()
                    wx.navigateBack()
                }, 500);
                return
            }
            console.log("create note err: ", res);
            wx.showToast({
                title: res.msg,
                icon: "none"
            })
        })
    },
    submitErr(title: string) {
        wx.showToast({
            title: title,
            icon: "none"
        })
    },

})