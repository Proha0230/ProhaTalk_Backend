export interface IUser {
    id: number,
    login: string,
    name: string | null,
    lastname: string | null,
    status: string | null,
    lastSeen: Date,
    avatar: string | null
}

export interface IUserInAllUsers {
    id: number,
    login: string,
    name: string | null,
    lastname: string | null,
    status: string | null,
    lastSeen: Date,
    usersFriendship: boolean,
    isSubmittedRequestToAddContacts: boolean,
    isUserLookingAtHimself: boolean
}