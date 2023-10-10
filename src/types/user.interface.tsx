export interface IUser{
    id: number
    login: string
    password: string
    name: string
    leaveDate: string
    joinDate: string
    isOnline: boolean
    photoFileName: string
}

export interface ICurrentUser {
    id: number
    name: string
    leaveDate: string
    isOnline: boolean
    photoFileName: string
}