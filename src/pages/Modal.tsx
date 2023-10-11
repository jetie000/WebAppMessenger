import { useState } from "react";
import AddContact from "./Chats/Contacts/AddContact";
import Contacts from "./Chats/Contacts/Contacts";
import Requests from "./Chats/Contacts/Requests";
import Profile from "./Chats/Contacts/Profile";

function Modal({ id, componentName }: { id: string, componentName: string }) {
    let [pageContacts, setPageContacts] = useState('Contacts');
    if (componentName != 'Contacts' && pageContacts != 'Contacts') {
        setPageContacts('Contacts');
    }

    const handleContactsButton = () => {
        setPageContacts('Contacts');
        document.getElementById('requestsButton')?.classList.remove('btn-secondary');
        document.getElementById('requestsButton')?.classList.add('btn-outline-secondary');
        document.getElementById('contactsButton')?.classList.remove('btn-outline-secondary');
        document.getElementById('contactsButton')?.classList.add('btn-secondary');
        const myModal = document.getElementById('chatsModal');
        myModal?.querySelector('.modal-body')?.classList.remove("overflow-auto");
    }
    const handleRequestsButton = () => {
        setPageContacts('Requests');
        document.getElementById('requestsButton')?.classList.add('btn-secondary');
        document.getElementById('requestsButton')?.classList.remove('btn-outline-secondary');
        document.getElementById('contactsButton')?.classList.add('btn-outline-secondary');
        document.getElementById('contactsButton')?.classList.remove('btn-secondary');
        const myModal = document.getElementById('chatsModal');
        myModal?.querySelector('.modal-body')?.classList.add("overflow-auto");
    }

    return (
        <div className="modal  fade" id={id} tabIndex={-1} role="dialog" aria-hidden="true" aria-labelledby={id + "Label"}>
            <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {componentName == 'Contacts' &&
                            <ul className="navbar-nav flex-row justify-content-between gap-3">
                                <li className="nav-item w-100">
                                    <button id="contactsButton" onClick={handleContactsButton} className="btn w-100 btn-secondary fs-5">Контакты</button>
                                </li>
                                <li className="nav-item w-100">
                                    <button id="requestsButton" onClick={handleRequestsButton} className="btn w-100 btn-outline-secondary fs-5">Заявки</button>
                                </li>
                            </ul>
                        }
                        <h5 className="modal-title" id={id + "Label"}></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {componentName == 'Contacts' ?
                            (pageContacts == 'Contacts' ?
                                <Contacts /> :
                                <Requests />) :
                            (componentName == 'AddContact' ?
                                <AddContact /> :
                                ( componentName == 'Profile' ?
                                <Profile /> : <></>))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal;