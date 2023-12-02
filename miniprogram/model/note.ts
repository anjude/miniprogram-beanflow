export interface CreateNoteReq {
    /**
     * 内容
     */
    content: string;
    /**
     * 是否公开
     */
    isPublic: number;
    [property: string]: any;
}

export interface GetNoteListReq {
    openid?: string;
    offset: number;
    limit: number;
    [property: string]: any;
}

export interface NoteView {
    content: string;
    createTime: number;
    id: number;
    isPublic: number;
    openid: string;
    updateTime: number;
    likeNum: number;
    liked: boolean
    [property: string]: any;
}

export interface DelInfoReq {
    noteId: number;
    [property: string]: any;
}

export interface UpdateNoteReq {
    noteId: number;
    like?: number;
    [property: string]: any;
}