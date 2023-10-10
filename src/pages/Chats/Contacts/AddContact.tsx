import { useEffect } from "react";
import { useInvitesStore } from "../../../stores/invitesStore";
import { useUserStore } from "../../../stores/userStore";
import './Contacts.css';
import '../Chats.css';
import { variables } from "../../../Variables";
import { useMessagesStore } from "../../../stores/messagesStore";

function AddContact() {
    let user = useUserStore(state => state.user);
    let setAllUsers = useInvitesStore(state => state.setAllUsers);
    let setSearchUsers = useInvitesStore(state => state.setSearchUsers);
    let clearSearchUsers = useInvitesStore(state => state.clearSearchUsers);
    let setInvites = useInvitesStore(state => state.setInvites);
    let searchUsers = useInvitesStore(state => state.searchUsers);
    let setCurrentUser = useMessagesStore(state => state.setCurrentUser);

    useEffect(() => {
        setAllUsers(user.id);
        setInvites(user.id);
    }, []);

    const searchUsersFunc = () => {
        const input: HTMLInputElement = document.querySelector('#searchUsers')!;
        if (input.value == '') {
            clearSearchUsers();
            return;
        }
        setInvites(user.id);
        setSearchUsers(input.value);
    }

    const clearInput = () => {
        const input: HTMLInputElement = document.querySelector('#searchUsers')!;
        input.value = '';
        clearSearchUsers();
    }

    const sendKeyEnter = (event: any) => {
        if (event.key == 'Enter') {
            searchUsersFunc();
        }
    }

    async function addContactFunc(idContact: number) {
        if (document.getElementById('addButtonIcon' + idContact)?.classList.contains('bi-check-lg')) {
            return;
        }
        try {
            await fetch(variables.API_URL + '/invite', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "IdUserSend": user.id,
                    "IdUserGet": idContact,
                    "Date": new Date(),
                    "IsAccepted": false
                })
            })
        } catch (error) {
            alert(error);
        }
        document.getElementById('addButtonIcon' + idContact)?.classList.remove('bi-plus');
        document.getElementById('addButtonIcon' + idContact)?.classList.add('bi-check-lg');
        document.getElementById('addButton' + idContact)!.style.cursor = 'default';
        setInvites(user.id);
    }

    return (
        <>
            <div className="input-group rounded-0 ">
                <input id="searchUsers" type="text" className="form-control rounded-0 addContacts-input" onKeyDown={sendKeyEnter} placeholder="Поиск" aria-label="Find" aria-describedby="button-addon2" />
                <button className="btn btn-outline-secondary" onClick={clearInput} type="button"><i className="bi bi-x-lg"></i></button>
                <button className="btn btn-outline-secondary rounded-0" onClick={searchUsersFunc} type="button"><i className="bi bi-search"></i></button>
            </div>
            <ul className="list-group list-group-flush rounded overflow-auto addContact-list">
                {searchUsers.map(searchUser =>
                    <li className="list-group-item d-flex align-items-center p-2"
                        key={searchUser.id}>
                        <img className=" rounded-circle chats-chat-img" src={variables.PHOTO_URL + searchUser.photoFileName} alt={searchUser && searchUser.name[0]} />
                        <div className="d-flex flex-column ms-2 flex-fill">
                            <div className="d-flex flex-column justify-content-between">
                                <span className="text-truncate chats-chat-name">{searchUser.name}</span>
                                <span>{searchUser.isOnline ? <>Онлайн</>
                                    : <>Был(а) в сети {new Date(Date.parse(searchUser.leaveDate)).toDateString() == new Date().toDateString()
                                        ? searchUser.leaveDate.slice(11, 16)
                                        : (searchUser.leaveDate.slice(8, 10) + '.' + searchUser.leaveDate.slice(5, 7) + '.' + searchUser.leaveDate.slice(0, 4))}
                                    </>
                                }</span>
                            </div>
                        </div>
                        <button id={"sendButton" + searchUser.id}
                            data-bs-toggle="modal"
                            data-bs-target="#chatsModal"
                            className="btn btn-outline-secondary addContact-addButton p-0 pt-1 me-1"
                            onClick={() => setCurrentUser(searchUser)}>
                            <h4>
                                <i id={"sendButtonIcon" + searchUser.id} className="bi bi-send"></i>
                            </h4>
                        </button>
                        <button id={"addButton" + searchUser.id}
                            className="btn btn-outline-secondary addContact-addButton p-0"
                            onClick={() => addContactFunc(searchUser.id)}>
                            <h3>
                                <i id={"addButtonIcon" + searchUser.id} className="bi bi-plus"></i>
                            </h3>
                        </button>
                    </li>)}
            </ul>
        </>);
}

export default AddContact;