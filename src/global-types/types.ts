export interface IReqInfo {
    user: IReqInfoUser
    [key: string]: any
}

export interface IReqInfoUser {
    login: string,
    id: number
}