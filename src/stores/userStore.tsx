import { variables } from '../Variables';
import { create } from 'zustand';
import { IUser } from '../types/user.interface';

interface UserState {
    user: IUser
    setUser: (data:IUser) => void
    logout: () => void
    loggedIn: () => boolean
  }

export const useUserStore = create<UserState>((set, get) => ({
    user: JSON.parse(localStorage.getItem(variables.$LOCAL_USER)!) || null,
    loggedIn: () => {
        const isLogin = localStorage.getItem(variables.$LOCAL_USER) || false;
        return !!isLogin;
    },
    setUser: (data:IUser) => {
        if (typeof data == typeof get().user){
            set(
                {user: data}
            )
            if (data){
                localStorage.setItem(variables.$LOCAL_USER, JSON.stringify(data));
            }
            fetch(variables.API_URL+'/user', {
                method:'PUT',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    "Id": get().user.id,
                    "Login": get().user.login,
                    "Password": get().user.password,
                    "Name": get().user.name,
                    "LeaveDate" : get().user.leaveDate,
                    "JoinDate": get().user.joinDate,
                    "IsOnline": true,
                    "PhotoFileName": get().user.photoFileName
                })
            })
        }
    },
    logout: () => {
        console.log(get().user.id);
        localStorage.removeItem(variables.$LOCAL_USER);
        localStorage.removeItem(variables.$CHOSEN_USER);
        var date = new Date();
        fetch(variables.API_URL+'/user', {
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "Id": get().user.id,
                "Login": get().user.login,
                "Password": get().user.password,
                "Name": get().user.name,
                "LeaveDate" : date,
                "JoinDate": get().user.joinDate,
                "IsOnline": false,
                "PhotoFileName": get().user.photoFileName
            })
        })
        set(
            {
                user: {
                    id: 0,
                    login: '',
                    password: '',
                    name: '',
                    leaveDate: '',
                    joinDate: '',
                    isOnline: false,
                    photoFileName: ''
                }
            }
        )
    },
}))