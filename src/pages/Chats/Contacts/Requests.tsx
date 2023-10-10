import { variables } from "../../../Variables";
import { useInvitesStore } from "../../../stores/invitesStore";
import { useUserStore } from "../../../stores/userStore";
import OneRequest from "./OneRequest";

function Requests() {
    let contactsIn = useInvitesStore(state => state.contactsIn);
    let contactsOut = useInvitesStore(state => state.contactsOut);
    let user = useUserStore(state => state.user);
    let setInvites = useInvitesStore(state => state.setInvites);
    let invites = useInvitesStore(state => state.invites);

    async function addContactFunc(idContact: number) {
        if (document.getElementById('addButtonIcon' + idContact)?.classList.contains('bi-check-lg')) {
            return;
        }
        try {
            await fetch(variables.API_URL + '/invite/accept?inviteId=' + invites.find(invite => invite.idUserSend == idContact)?.id, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            alert(error);
        }
        document.getElementById('addButtonIcon' + idContact)?.classList.remove('bi-plus');
        document.getElementById('addButtonIcon' + idContact)?.classList.add('bi-check-lg');
        document.getElementById('addButton' + idContact)!.style.cursor = 'default';
        setInvites(user.id);
    }

    async function deleteInviteFunc(idContact: number) {
        if (document.getElementById('addButtonIcon' + idContact)?.classList.contains('bi-check-lg')) {
            return;
        }
        try {
            await fetch(variables.API_URL + '/invite?id=' + invites.find(invite => invite.idUserGet == idContact)?.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            alert(error);
        }
        document.getElementById('addButtonIcon' + idContact)?.classList.remove('bi-x-lg');
        document.getElementById('addButtonIcon' + idContact)?.classList.add('bi-check-lg');
        document.getElementById('addButton' + idContact)!.style.cursor = 'default';
        setInvites(user.id);
    }
    
    return (
        <>
            <h5 className="text-center p-2 mb-0 border-bottom">Входящие заявки</h5>
            <ul className="list-group list-group-flush rounded overflow-auto">
                {contactsIn.length ? contactsIn.map(contact =>
                    <OneRequest key={contact.id} contact={contact} iconName={"bi-plus"} buttonFunc={addContactFunc} />) :
                    <h5 className="p-3 m-auto">У вас нет входящих заявок</h5>}
            </ul>
            <h5 className="p-2 text-center mb-0 border-bottom border-top">Исходящие заявки</h5>
            <ul className="list-group list-group-flush rounded overflow-auto">
                {contactsOut.length ? contactsOut.map(contact =>
                    <OneRequest key={contact.id} contact={contact} iconName={"bi-x-lg"} buttonFunc={deleteInviteFunc} />) :
                    <h5 className="p-3 m-auto">У вас нет исходящих заявок</h5>}
            </ul>
        </>
    );
}

export default Requests;