import { create } from 'zustand';
import { IInvite } from '../types/invites.interface';
import { variables } from '../Variables';
import { ICurrentUser } from '../types/user.interface';

interface InvitesState {
    invites: IInvite[]
    contacts: ICurrentUser[]
    contactsIn: ICurrentUser[]
    contactsOut: ICurrentUser[]
    setInvites: (userId: number) => void
    allUsers: ICurrentUser[]
    searchUsers: ICurrentUser[]
    setAllUsers: (userId: number) => void
    setSearchUsers: (data:string) => void
    clearSearchUsers: () => void
}

export const useInvitesStore = create<InvitesState>((set, get) => ({
    invites: [],
    contacts: [],
    contactsIn: [],
    contactsOut: [],
    setInvites: async (userId: number) => {
        try {
            const response = await fetch(variables.API_URL + "/invite?idUser=" + userId);
            const data: IInvite[] = await response.json();
            let contactsUsers: ICurrentUser[] = [];
            let contactsInUsers: ICurrentUser[] = [];
            let contactsOutUsers: ICurrentUser[] = [];
            for (let obj of data) {
                let inviteUserId = obj.idUserSend == userId ? obj.idUserGet : obj.idUserSend;
                const responseUser = await fetch(variables.API_URL + "/user/oneuser?userId=" + inviteUserId);
                const dataResponseUser = await responseUser.json();
                if (obj.isAccepted == false){
                    if (obj.idUserSend == userId){
                        contactsOutUsers.push(dataResponseUser[0]);
                    }
                    else{
                        contactsInUsers.push(dataResponseUser[0]);
                    }
                    continue;
                }
                contactsUsers.push(dataResponseUser[0]);
            }
            set(
                {
                    invites: data,
                    contacts: contactsUsers,
                    contactsIn: contactsInUsers,
                    contactsOut: contactsOutUsers
                }
            )
        } catch (error) {
            alert(error);
        }
        
    },
    allUsers: [],
    searchUsers: [],
    setAllUsers: async (userId: number) => {
        try {
            const response = await fetch(variables.API_URL + "/user/allusers?userId=" + userId);
            const data: ICurrentUser[] = await response.json();
            set(
                {
                    allUsers: data,
                }
            )
        } catch (error) {
            alert(error);
        }
        
    },
    setSearchUsers: (data:string) => {
        let allUsersWithoutContacts = get().allUsers.filter(user => !get().contacts.concat(get().contactsIn).concat(get().contactsOut).find(contact => contact.id == user.id));
        set({
            searchUsers: allUsersWithoutContacts.filter(user => user.name.toLowerCase().includes(data.toLowerCase()) )
        })
    },
    clearSearchUsers: () => {
        set({
            searchUsers: []
        })
    }
}))