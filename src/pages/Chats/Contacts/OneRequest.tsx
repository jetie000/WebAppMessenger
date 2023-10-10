import { variables } from "../../../Variables";
import { useMessagesStore } from "../../../stores/messagesStore";
import { ICurrentUser } from "../../../types/user.interface";
import './Contacts.css';

function OneRequest({ contact, iconName, buttonFunc }: { contact: ICurrentUser, iconName: string, buttonFunc: Function }) {
    let setCurrentUser = useMessagesStore(state => state.setCurrentUser);
    return (<li className="list-group-item d-flex p-2 align-items-center">
        <img className=" rounded-circle chats-chat-img" src={variables.PHOTO_URL + contact.photoFileName} alt={contact && contact.name[0]} />
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
        <button id={"addButton" + contact.id}
            className="btn btn-outline-secondary addContact-addButton p-0"
            onClick={() => buttonFunc(contact.id)}>
            <h3>
                <i id={"addButtonIcon" + contact.id} className={'bi ' + iconName}></i>
            </h3>
        </button>
    </li>);
}

export default OneRequest;