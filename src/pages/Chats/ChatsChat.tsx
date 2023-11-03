import { variables } from "../../Variables";
import { useMessagesStore } from "../../stores/messagesStore";
import { useUserStore } from "../../stores/userStore";
import React from "react";
import { IMessage } from "../../types/message.interface";
import { HubConnection } from "@microsoft/signalr";

function ChatsChat({ connection }: { connection: HubConnection }) {

    let messages = useMessagesStore(state => state.messages);
    const user = useUserStore(state => state.user);
    let currentUser = useMessagesStore(state => state.currentUser);
    let users = useMessagesStore(state => state.users);
    let setMessage = useMessagesStore(state => state.setMessage);
    let setChat = useMessagesStore(state => state.setMessage);
    let chats = useMessagesStore(state => state.chats);
    let setMessagesChats = useMessagesStore(state => state.setMessagesChats);
    let setSearchChats = useMessagesStore(state => state.setSearchChats);
    let currentUserMessages: IMessage[] = currentUser ? messages.filter(message => (message.idGet === user.id && message.idSend === currentUser.id) || (message.idSend === user.id && message.idGet === currentUser.id)) : [];

    const sendMessage = () => {
        const input: HTMLInputElement = document.querySelector('#send')!;
        if (input.value.trim() == "") {
            return;
        }
        try {
            console.log(JSON.stringify({
                "Msg": input?.value || '',
                "IdSend": user.id,
                "IdGet": currentUser.id,
                "date": new Date(Date.now()).toLocaleString()
            }));
            fetch(variables.API_URL + '/message', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "Msg": input?.value.trim() || '',
                    "IdSend": user.id,
                    "IdGet": currentUser.id,
                    "date": (new Date(Date.now() + 3600000 * 3))
                })
            })
        } catch (error) {
            alert(error);
        }
        let dateCon = new Date(Date.now()).toString();
        setMessage({
            "id": (messages[0].id + 1) || 0,
            "message": input.value || '',
            "idSend": user.id,
            "idGet": currentUser.id,
            "date": dateCon
        })
        if (!chats.find(chat => (chat.idGet == currentUser.id || chat.idSend == currentUser.id))) {
            setChat({
                "id": (chats[0].id + 1) || 0,
                "message": input.value || '',
                "idSend": user.id,
                "idGet": user.id,
                "date": dateCon
            })
        }
        setSearchChats("");
        let userIdCon = user.id.toString();
        let roomIdCon = user.id < currentUser.id ? user.id + ' ' + currentUser.id : currentUser.id + ' ' + user.id;
        let messageCon = input.value;
        connection.invoke("SendMessage", { userIdCon, roomIdCon, messageCon, dateCon });
        input.value = "";

    }

    const sendKeyEnter = (event: any) => {
        if (event.key == 'Enter') {
            sendMessage();
        }
    }

    const toogleChat = () => {
        const chat = document.querySelector('.chat');
        if(chat?.classList.contains('chat-show'))
            chat.classList.remove('chat-show')
        else
            chat?.classList.add('chat-show')
    }
    
    return (
        <>
            {currentUser ?
                <div className="d-flex flex-column border flex-fill chat">
                    <div className="d-flex flex-row flex-fill border-bottom p-1 ps-3 chat-header">
                        <div className="d-flex gap-3">
                            <button
                                id="toogleChatButton"
                                className="border-0 text-center fs-3"
                                onClick={toogleChat}>
                                <i className="bi bi-arrow-left"></i>
                            </button>
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
                        {currentUserMessages?.length ? (currentUserMessages.map((msg, index) => (
                            <div key={msg.id}>
                                {(new Date(currentUserMessages[index].date).toLocaleDateString() != new Date(currentUserMessages[index + 1]?.date).toLocaleDateString()) &&
                                    <div className="m-2 chat-msg-msg text-center">{new Date(currentUserMessages[index].date).toLocaleDateString()}</div>
                                }
                                <div className="d-flex mt-2 " >
                                    <img className="border rounded-circle me-2 align-self-end chat-msg-img flex-shrink-0" src={variables.PHOTO_URL + (msg.idSend == user.id ? user.photoFileName : currentUser.photoFileName)} alt={msg.idSend == user.id ? user.name[0] : currentUser.name[0]} />
                                    <div className="border rounded p-2 text-break chat-msg-msg">
                                        {msg.message}
                                    </div>
                                    <span className="align-self-end ms-2">{new Date(msg.date).toLocaleString().slice(12, 17)}</span>
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