import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import { useEffect, useState } from "react";
import Modal from "../Modal";
import { useInvitesStore } from "../../stores/invitesStore";
import { variables } from "../../Variables";

function ChatsMenu() {
    const user = useUserStore(state => state.user);
    const logout = useUserStore(state => state.logout);
    const navigate = useNavigate();
    let setInvites = useInvitesStore(state => state.setInvites);
    let clearSearchUsers = useInvitesStore(state => state.clearSearchUsers);

    const [componentModalName, setComponentModalName] = useState('');

    useEffect(() => {
        const myModal = document.getElementById('chatsModal');
        myModal!.addEventListener('hidden.bs.modal', modalCloseHandler);
    }, []);

    const modalCloseHandler = () => {
        setInvites(user.id);
        clearSearchUsers();
        console.log('reset contacts');
    }

    const showProfile = () => {
        const myModal = document.getElementById('chatsModal');
        let modalTitle = myModal?.querySelector('.modal-title');
        modalTitle!.textContent = 'Мой профиль';myModal?.querySelector('.modal-body')?.setAttribute('style', 'padding: 0');
        myModal?.querySelector('.modal-content')?.setAttribute('style', 'height: 400px;');
        setComponentModalName('Profile');
    }

    const showContacts = () => {
        const myModal = document.getElementById('chatsModal');
        let modalTitle = myModal?.querySelector('.modal-title');
        modalTitle!.textContent = '';
        myModal?.querySelector('.modal-body')?.setAttribute('style', 'padding: 0');
        myModal?.querySelector('.modal-content')?.setAttribute('style', 'height: 400px;');
        setComponentModalName('Contacts');
    }

    const showAddContacts = () => {
        const myModal = document.getElementById('chatsModal');
        let modalTitle = myModal?.querySelector('.modal-title');
        modalTitle!.textContent = 'Добавить друга';
        myModal?.querySelector('.modal-body')?.setAttribute('style', 'padding: 0');
        myModal?.querySelector('.modal-content')?.setAttribute('style', 'height: 400px;');
        setComponentModalName('AddContact');
    }
    return (
        <div className=" d-flex flex-column border p-1 menu">
            <button className="border rounded-circle text-center menu-button mb-2 p-0"
                data-bs-toggle="modal"
                data-bs-target="#chatsModal"
                onClick={showProfile}>
                <img className="rounded-circle menu-button" src={variables.PHOTO_URL + user.photoFileName} alt={user && user.login[0]} />
            </button>
            <button
                className="border rounded-circle text-center menu-button mb-2"
                data-bs-toggle="modal"
                data-bs-target="#chatsModal"
                onClick={showContacts}>
                <h3><i className="bi bi-person-lines-fill"></i></h3>
            </button>
            <button
                className="border rounded-circle text-center mb-auto menu-button"
                data-bs-toggle="modal"
                data-bs-target="#chatsModal"
                onClick={showAddContacts}>
                <h3><i className="bi bi-person-plus-fill"></i></h3>
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="border rounded-circle text-center menu-button">
                <h3><i className="bi bi-box-arrow-left"></i></h3>
            </button>
            <Modal id='chatsModal' componentName={componentModalName}/>
        </div>
    );
}

export default ChatsMenu;