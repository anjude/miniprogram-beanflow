import comment from "../../../api/comment";
import flow from "../../../api/flow";
import { CommentView } from "../../../model/comment";
import { NoteView } from "../../../model/note";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        note: {} as NoteView,
        commentList: [] as CommentView[],
        addCommentContent: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (!options.noteId) {
            return
        }
        let noteId = options.noteId as unknown as number
        this.initData(noteId)
    },
    onPullDownRefresh() {
        this.initData(this.data.note.id)
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 500);
    },
    onReachBottom() {
        comment.getCommentList({
            noteId: this.data.note.id,
            offset: this.data.commentList.length,
            limit: 10
        }).then(res => {
            this.setData({
                commentList: this.data.commentList.concat(res.data.list)
            })
        })
    },

    initData(noteId: number) {
        this.data.commentList = []
        flow.getNote(noteId).then(res => {
            this.setData({
                note: res.data
            })
        })
        comment.getCommentList({
            noteId: noteId,
            offset: this.data.commentList.length,
            limit: 10
        }).then(res => {
            this.setData({
                commentList: res.data.list
            })
        })
    },
    contentInput(e: WechatMiniprogram.TouchEvent) {
        this.data.addCommentContent = e.detail.value
    },
    onAddComment() {
        if (!this.data.addCommentContent) {
            wx.showToast({
                icon: "none",
                title: "总得写点啥.."
            })
            return
        }
        comment.createComment({
            noteId: this.data.note.id,
            content: this.data.addCommentContent
        }).then(res => {
            wx.showToast({
                title: res.msg,
                icon: "none"
            })
            if (res.errCode === 0) {
                this.setData({
                    addCommentContent: ""
                })
                this.initData(this.data.note.id)
            }
        })
    },
    onLike() {
        flow.updateInfo({
            noteId: this.data.note.id,
            like: this.data.note.liked ? 0 : 1,
        }).then(res => {
            if (res.errCode === 0) {
                if (this.data.note.liked) {
                    this.data.note.likeNum--
                } else {
                    this.data.note.likeNum++
                }
                this.data.note.liked = !this.data.note.liked
                this.setData({
                    note: this.data.note
                })
            }
            wx.showToast({
                title: res.msg,
                icon: "none"
            })
        })
    },
})