export const variables={
    API_URL: "https://jetie000-001-site1.ctempurl.com/api",
    PHOTO_URL: "https://jetie000-001-site1.ctempurl.com/Photos/",
    SOCKET_URL : "wss://jetie000-001-site1.ctempurl.com/chat-hub",
    // API_URL: "https://localhost:7220/api",
    // PHOTO_URL: "https://localhost:7220/Photos/",
    // SOCKET_URL : "ws://localhost:7220/chat-hub",
    $LOCAL_USER: "user_local",
    $CHOSEN_USER: "user_chosen",
    toogleChat: () => {
        const chat = document.querySelector('.chat');
        if(chat?.classList.contains('chat-show'))
            chat.classList.remove('chat-show')
        else
            chat?.classList.add('chat-show')
    }
}