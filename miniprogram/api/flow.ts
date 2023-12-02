import { CreateNoteReq, DelInfoReq, GetNoteListReq, UpdateNoteReq } from "../model/note";
import { HttpResp } from "../model/request";
import request from "../utils/request";

export class Flow {
    async createNote(req: CreateNoteReq): Promise<HttpResp> {
        return request.post(`/api/flow/note/add`, req)
    }

    async userNotes(req: GetNoteListReq): Promise<HttpResp> {
        return request.get(`/api/flow/note/user_notes?offset=${req.offset}&limit=${req.limit}`)
    }

    async getNote(id: number): Promise<HttpResp> {
        return request.get(`/api/flow/note/detail?note_id=${id}`)
    }

    async delNote(req: DelInfoReq): Promise<HttpResp> {
        return request.post(`/api/flow/note/del`, {
            noteId: req.noteId
        })
    }

    async noteList(req: GetNoteListReq): Promise<HttpResp> {
        return request.get(`/api/flow/note/list?openid=${req.openid}&offset=${req.offset}&limit=${req.limit}`)
    }

    async updateInfo(req: UpdateNoteReq): Promise<HttpResp> {
        return request.post(`/api/flow/note/like`, req)
    }
}

export default new Flow()