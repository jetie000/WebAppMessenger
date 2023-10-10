import ChatsMenu from "./ChatsMenu";
import ChatsChats from "./ChatsChats";
import ChatsChat from "./ChatsChat";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import './Chats.css';
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { useInvitesStore } from "../../stores/invitesStore";
import { IInvite } from "../../types/invites.interface";
import { useMessagesStore } from "../../stores/messagesStore";

function Chats() {
    const user = useUserStore(state => state.user);
    let chats = useMessagesStore(state => state.chats);
    let isChats = useMessagesStore(state => state.isChats);
    let setMessagesChats = useMessagesStore(state => state.setMessagesChats);
    const navigate = useNavigate();
    const [connection, setConnection] = useState<HubConnection>();

    const joinRoom = async (userIdCon: string) => {
        try {
            const connection = new HubConnectionBuilder()
                .withUrl('wss://jetie000-001-site1.ctempurl.com/chat-hub')
                .configureLogging(LogLevel.Information)
                .build();
            connection.on("JoinMessage", (message) => {
                console.log('message: ' + message);
            });
            connection.on("ReceiveMessage", (userIdCon, roomIdCon, messageCon, dateCon) => {
                console.log(userIdCon+ "   ", roomIdCon + "   "+ messageCon + '    '+ dateCon);
                setMessagesChats(user.id);
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

    useEffect(()=> {
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