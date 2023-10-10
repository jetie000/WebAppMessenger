import { variables } from "../../Variables";
import { useMessagesStore } from "../../stores/messagesStore";
import { useUserStore } from "../../stores/userStore";
import React from "react";
import { IMessage } from "../../types/message.interface";
import { HubConnection } from "@microsoft/signalr";

function ChatsChat({connection}: {connection: HubConnection}) {

    let messages = useMessagesStore(state => state.messages);
    const user = useUserStore(state => state.user);
    let currentUser = useMessagesStore(state => state.currentUser);
    let users = useMessagesStore(state => state.users);
    let chats = useMessagesStore(state => state.chats);
    let setMessages = useMessagesStore(state => state.setMessages);
    let setMessagesChats = useMessagesStore(state => state.setMessagesChats);
    let currentUserMessages : IMessage[] = currentUser ? messages.filter(message => (message.idGet === user.id && message.idSend === currentUser.id) || (message.idSend === user.id && message.idGet === currentUser.id)) : [];
    
    const sendMessage = async () => {
        const input: HTMLInputElement = document.querySelector('#send')!;
        if (input.value == ""){
            return;
        }
        try {
            console.log(JSON.stringify({
                "Msg" : input?.value || '',
                "IdSend" : user.id,
                "IdGet" : currentUser.id,
                "date": new Date()
            }));
            await fetch(variables.API_URL+'/message', {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                "Msg" : input?.value || '',
                "IdSend" : user.id,
                "IdGet" : currentUser.id,
                "date": new Date()
            })
            })
        } catch (error) {
            alert(error);
        }
        let dateCon =(new Date()).toDateString();
        setMessages({
            "id" : messages[0].id + 1 || 0,
            "message" : input.value || '',
            "idSend" : user.id,
            "idGet" : currentUser.id,
            "date": dateCon
        })
        let userIdCon = user.id.toString();
        let roomIdCon = user.id < currentUser.id ? user.id + ' '+ currentUser.id :  currentUser.id + ' '+ user.id;
        
        let messageCon = input.value;
        connection.invoke("SendMessage", { userIdCon, roomIdCon, messageCon , dateCon});
        input.value = "";
        if (!users.find(user => user.id == currentUser.id)){
            setMessagesChats(user.id);
        }
        
    }

    const sendKeyEnter = (event: any) => {
        if (event.key == 'Enter')
        {
            sendMessage();
        }
    }

    return (
        <>
            {currentUser ?
                <div className="d-flex flex-column border flex-fill">
                    <div className="d-flex flex-row flex-fill border-bottom p-1 ps-3 chat-header">
                        <div className="d-flex">
                            <div className="d-flex flex-column">
                                <div className="fs-5">
                                    {currentUser.name}
                                </div>
                                <div className="fs-6">
                                    {currentUser.isOnline ? <>Онлайн</>
                                        : <>Был(а) в сети {new Date(Date.parse(currentUser.leaveDate)).toDateString() == new Date().toDateString()
                                            ? currentUser.leaveDate.slice(11, 16)
                                            : (currentUser.leaveDate.slice(8, 10) + '.' + currentUser.leaveDate.slice(5, 7) + '.' + currentUser.leaveDate.slice(0, 4))}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column-reverse flex-fill p-1 ps-3 pe-3 overflow-auto">
                        {currentUserMessages?.length ? (currentUserMessages.map(msg => (
                            <div className="d-flex mt-2 " key={msg.id}>
                                <img className="border rounded-circle me-2 align-self-end chat-msg-img flex-shrink-0" src={variables.PHOTO_URL + (msg.idSend == user.id ? user.photoFileName : currentUser.photoFileName)} alt={ msg.idSend == user.id ? user.name[0] : currentUser.name[0]} />
                                <div className="border rounded p-2 text-break chat-msg-msg">
                                    {msg.message}
                                </div>
                            </div>
                        ))) : <h3 className="border rounded p-4">Нет сообщений</h3>}
                    </div>
                    <div className="d-flex flex-row flex-fill p-1 ps-3 pe-3 chat-input">
                        <div className="input-group mb-3 mt-2">
                            <input id="send" type="text" onKeyDown={sendKeyEnter} className="form-control" maxLength={1000} placeholder="Введите сообщение" aria-label="Send" aria-describedby="button-addon2" />
                            <button className="btn btn-outline-secondary" onClick={sendMessage} type="button" id="button-addon2"><i className="bi bi-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
                :
                <div className="p-5 text-center">
                    <h3 className="border rounded p-4">Выберите чат для начала общения</h3>
                </div>
            }
        </>
    );
}

export default ChatsChat;