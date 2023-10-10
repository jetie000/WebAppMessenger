import { create } from 'zustand';
import { variables } from '../Variables';
import { ICurrentUser } from '../types/user.interface';
import { IMessage } from '../types/message.interface';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


interface MessagesState {
    chats: IMessage[]
    searchChats: IMessage[]
    messages: IMessage[]
    users: ICurrentUser[]
    currentUser: any
    isChats: boolean
    setMessagesChats: (userId: number) => void
    setCurrentUser: (data: any) => void
    setMessages: (data: IMessage) => void
    setChats: (data:string) => void
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
    chats: [],
    isChats: false,
    searchChats: [],
    messages: [],
    users: [],
    currentUser: JSON.parse(localStorage.getItem(variables.$CHOSEN_USER)!) || null,
    setMessagesChats: async (userId: number) => {
        try {
            const response = await fetch(variables.API_URL + "/message/chats?idSend=" + userId);
            const dataResponse: IMessage[] = await response.json();
            let resultChats: IMessage[] = [];
            let resultUsers: ICurrentUser[] = [];
            let isMatch = false;
            for (let obj1 of dataResponse) {
                isMatch = false;
                for (let obj2 of resultChats) {
                    if ((obj1.idGet === obj2.idGet && obj1.idSend === obj2.idSend) || (obj1.idSend === obj2.idGet) && (obj1.idGet === obj2.idSend)) {
                        isMatch = true;
                    }
                }
                if (!isMatch) {
                    resultChats.push(obj1);
                }
            }
            for (let obj of resultChats) {
                let chatUserId = obj.idSend == userId ? obj.idGet : obj.idSend;

                const responseUser = await fetch(variables.API_URL + "/user/oneuser?userId=" + chatUserId);
                const dataResponseUser: ICurrentUser[] = await responseUser.json();
                resultUsers.push(dataResponseUser[0]);
            }
            if (get().chats.length < 1){
                set({
                    isChats: true
                })
            }
            set({
                messages: dataResponse,
                chats: resultChats,
                users: resultUsers,
                searchChats: resultChats
            })
        } catch (error) {
            alert(error);
        }
        
    },
    setCurrentUser:  async(data: ICurrentUser) => {
        set(
            { currentUser: data }
        )
        
        if (data) {
            localStorage.setItem(variables.$CHOSEN_USER, JSON.stringify(data));
        }
    },
    setMessages: (data: IMessage) => {
        set((state) => ({
            messages: [ data, ...state.messages]
        }))
    },
    setChats: (data:string) => {
        set({
            searchChats: get().chats.filter(chat => get().users.find(user => (user.id === chat.idGet) || (user.id === chat.idSend))?.name.toLowerCase().includes(data.toLowerCase()) )
        })
    }
}))