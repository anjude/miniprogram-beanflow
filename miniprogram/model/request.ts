export interface HttpResp {
    data: any;
    detail: string;
    errCode: number;
    msg: string;
    [property: string]: any;
}
