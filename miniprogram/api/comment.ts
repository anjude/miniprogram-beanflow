
import { CreateCommentReq, GetCommentListReq } from "../model/comment";
import { HttpResp } from "../model/request";
import request from "../utils/request";

export class Comment {
    async getCommentList(req: GetCommentListReq): Promise<HttpResp> {
        return request.get(`/api/flow/comment/list?note_id=${req.noteId}&offset=${req.offset}&size=${req.limit}`)
    }
    
    async createComment(req: CreateCommentReq): Promise<HttpResp> {
        return request.post(`/api/flow/comment/add`, req)
    }
}

export default new Comment()