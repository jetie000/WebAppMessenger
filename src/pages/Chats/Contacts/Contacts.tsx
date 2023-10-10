import { useEffect } from "react";
import { useInvitesStore } from "../../../stores/invitesStore";
import { useUserStore } from "../../../stores/userStore";
import './Contacts.css';
import '../Chats.css';
import { useMessagesStore } from "../../../stores/messagesStore";
import { variables } from "../../../Variables";

function Contacts() {
    let contacts = useInvitesStore(state => state.contacts);
    let setInvites = useInvitesStore(state => state.setInvites);
    let invites = useInvitesStore(state => state.invites);
    let user = useUserStore(state => state.user);
    let setCurrentUser = useMessagesStore(state => state.setCurrentUser);

    useEffect(() => {
        setInvites(user.id);
    }, []);

    const removeContactFunc = async (contactId: number) => {
        if (document.getElementById('addButtonIcon' + contactId)?.classList.contains('bi-check-lg')){
            return;
        }
        
        try {
            await fetch(variables.API_URL + '/invite?id=' + invites.find(invite => (invite.idUserGet == contactId) || (invite.idUserSend == contactId))?.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            alert(error);
        }
        document.getElementById('removeButtonIcon' + contactId)?.classList.remove('bi-x-lg');
        document.getElementById('removeButtonIcon' + contactId)?.classList.add('bi-check-lg');
        document.getElementById('removeButton' + contactId)!.style.cursor='default';
        setInvites(user.id);
    }

    return (<ul className="list-group list-group-flush rounded overflow-auto contacts-list">
        {contacts.length ? contacts.map(contact =>
            <li className="list-group-item d-flex p-2 align-items-center" key={contact.id}>
                <img className="rounded-circle chats-chat-img" src={variables.PHOTO_URL + contact.photoFileName} alt={contact && contact.name[0]} />
                <div className="d-flex flex-column ms-2 flex-fill">
                    <div className="d-flex flex-column justify-content-between">
                        <span className="text-truncate chats-chat-name">{contact.name}</span>
                        <span>{contact.isOnline ? <>Онлайн</>
                            : <>Был(а) в сети {new Date(Date.parse(contact.leaveDate)).toDateString() == new Date().toDateString()
                                ? contact.leaveDate.slice(11, 16)
                                : (contact.leaveDate.slice(8, 10) + '.' + contact.leaveDate.slice(5, 7) + '.' + contact.leaveDate.slice(0, 4))}
                            </>
                        }</span>
                    </div>
                </div>
                <button id={"sendButton" + contact.id} 
                data-bs-toggle="modal"
                data-bs-target="#chatsModal" 
                className="btn btn-outline-secondary addContact-addButton p-0 pt-1 me-1"
                onClick={() => setCurrentUser(contact)}>
                    <h4>
                        <i id={"sendButtonIcon" + contact.id} className="bi bi-send"></i>
                    </h4>
                </button>
                <button id={"removeButton" + contact.id} 
                className="btn btn-outline-secondary addContact-addButton p-0 pt-1" 
                onClick={ () => removeContactFunc(contact.id)}>
                    <h4>
                        <i id={"removeButtonIcon" + contact.id} className="bi bi-x-lg"></i>
                    </h4>
                </button>
            </li>) :
            <h5 className="p-3 m-auto">У вас пока нет друзей</h5>}
    </ul>);
}

export default Contacts;