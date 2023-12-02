export interface CreateCommentReq {
    content: string;
    noteId: number;
    [property: string]: any;
}

export interface GetCommentListReq {
    noteIds?: number;
    offset?: number;
    limit?: number;
    [property: string]: any;
}

export interface CommentView {
    content: string;
    createTime: number;
    id: number;
    noteId: number;
    openid: string;
    updateTime: number;
    [property: string]: any;
}