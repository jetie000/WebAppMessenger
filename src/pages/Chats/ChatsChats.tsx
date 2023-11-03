import { useEffect } from "react";
import { useMessagesStore } from "../../stores/messagesStore";
import { useUserStore } from "../../stores/userStore";
import { IUser } from "../../types/user.interface";
import React from "react";
import { variables } from "../../Variables";

function ChatsChats() {

    let setMessagesChats = useMessagesStore(state => state.setMessagesChats);
    const user = useUserStore(state => state.user);
    let users = useMessagesStore(state => state.users);
    let setCurrentUser = useMessagesStore(state => state.setCurrentUser);
    let setSearchChats = useMessagesStore(state => state.setSearchChats);
    let searchChats = useMessagesStore(state => state.searchChats);

    useEffect(() => {
        setMessagesChats(user.id);
    }, []);

    const searchChatsFunc = () =>{
        const input: HTMLInputElement = document.querySelector('#search')!;
        setSearchChats(input.value);
        console.log(input.value);
    }

    const clearInput = () => {
        const input: HTMLInputElement = document.querySelector('#search')!;
        input.value = '';
        setSearchChats(input.value);
    }

    const sendKeyEnter = (event: any) => {
        if (event.key == 'Enter')
        {
            searchChatsFunc();
        }
    }

    const toggleChats = () => {
        const chats = document.querySelector('.chats');
        if(chats?.classList.contains('chats-show'))
            chats.classList.remove('chats-show')
        else
            chats?.classList.add('chats-show')
    }

    return (
        <div className="auto-fill border p-2 overflow-auto chats">
            <div className="input-group mb-3 mt-2">
                <input id="search" type="text" className="form-control" onKeyDown={sendKeyEnter} placeholder="Поиск" aria-label="Find" aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" onClick={clearInput} type="button" id="button-addon2"><i className="bi bi-x-lg"></i></button>
                <button className="btn btn-outline-secondary" onClick={searchChatsFunc} type="button" id="button-addon2"><i className="bi bi-search"></i></button>
            </div>
            <ul className="list-group">
                {searchChats.length ? (searchChats.map(chat => (
                    <li key={chat.id}
                        onClick={() => { setCurrentUser(users.find(user => (user.id === chat.idGet) || (user.id === chat.idSend))); toggleChats(); variables.toogleChat();}}
                        className="list-group-item d-flex flex-row chats-chat">
                        <img className=" rounded-circle chats-chat-img" src={variables.PHOTO_URL + users.find(user => (user.id === chat.idGet) || (user.id === chat.idSend))?.photoFileName} alt={users.find(user => (user.id === chat.idGet) || (user.id === chat.idSend))?.name[0]} />
                        <div className="d-flex flex-column ms-2 flex-fill">
                            <div className="d-flex flex-row justify-content-between">
                                <span className="text-truncate chats-chat-name">{users.find(user => (user.id === chat.idGet) || (user.id === chat.idSend))?.name}</span>
                                <span>{new Date(Date.parse(chat.date)).toDateString() == new Date().toDateString() ? chat.date.slice(11,16) : (chat.date.slice(8,10)+'.'+chat.date.slice(5,7)+'.'+chat.date.slice(0,4))}</span>
                            </div>
                            <div className="text-truncate chats-chat-msg">
                                {chat.message}
                            </div>
                        </div>
                    </li>
                ))) : <p>Нет чатов</p>}
            </ul>
        </div>
    );
}

export default ChatsChats;