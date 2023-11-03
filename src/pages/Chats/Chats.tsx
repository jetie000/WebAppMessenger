import ChatsMenu from "./ChatsMenu";
import ChatsChats from "./ChatsChats";
import ChatsChat from "./ChatsChat";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import './Chats.css';
import { HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useMessagesStore } from "../../stores/messagesStore";
import { variables } from "../../Variables";

function Chats() {
    const user = useUserStore(state => state.user);
    let chats = useMessagesStore(state => state.chats);
    let isChats = useMessagesStore(state => state.isChats);
    let setSearchChats = useMessagesStore(state => state.setSearchChats);
    let setMessage = useMessagesStore(state => state.setMessage);
    let setChat = useMessagesStore(state => state.setMessage);
    let messages = useMessagesStore(state => state.messages);
    const navigate = useNavigate();
    const [connection, setConnection] = useState<HubConnection>();

    const joinRoom = async (userIdCon: string) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl(variables.SOCKET_URL, {
                    skipNegotiation: true,
                    transport: HttpTransportType.WebSockets
                }
                )
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();
            connection.on("JoinMessage", (message) => {
                console.log('message: ' + message);
                
            });
            connection.on("ReceiveMessage", (userIdCon, roomIdCon, messageCon, dateCon) => {
                console.log(userIdCon + "   ", roomIdCon + "   " + messageCon + '    ' + dateCon);
                if (Number(userIdCon) != user.id) {
                    if (!chats.find(chat => (chat.idGet == userIdCon || chat.idSend == userIdCon))) {
                        setChat({
                            "id": (chats[0].id + 1) || 0,
                            "message": messageCon,
                            "idSend": Number(userIdCon),
                            "idGet": user.id,
                            "date": dateCon
                        })
                        setSearchChats("");
                    }
                    setMessage({
                        "id": (messages[0].id + 1) || 0,
                        "message": messageCon,
                        "idSend": Number(userIdCon),
                        "idGet": user.id,
                        "date": dateCon
                    })
                    
                }

            });
            await connection.start();
            for (let chat of chats) {
                let roomIdCon = chat.idSend < chat.idGet ? chat.idSend.toString() + ' ' + chat.idGet.toString() : chat.idGet.toString() + ' ' + chat.idSend.toString();
                await connection.invoke("JoinRoom", { userIdCon, roomIdCon });
            }
            setConnection(connection);
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (user != null)
            joinRoom(user.id.toString());
    }, [isChats]);

    return (

        <div className="position-absolute d-flex flex-row main-window">
            {user ? <>
                <ChatsMenu />
                <ChatsChats />
                <ChatsChat connection={connection!} /></> :
                <h3 className="p-3 m-auto d-flex flex-column">
                    Вы не авторизованы
                    <button onClick={() => navigate('/')} className="btn btn-primary fs-4 mt-2"> Авторизоваться</button>
                </h3>}

        </div>
    );
}

export default Chats;