export interface IChatsUser {
    id: number
    login: string
}

export interface IMassagesForChatUser {
    userLoginWithWhomChat: string
    hasMore: boolean
    nextCursor: number | null
    messagesList: Array<IMassage>
}

export interface IMassage {
    idMessage: number
    value: string
    created: Date
    userLoginSendMessage: string
    isAudio: boolean
    isPicture: boolean
    isText: true
}