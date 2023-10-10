import { variables } from '../../Variables';
import Modal from '../Modal'
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import { useMessagesStore } from '../../stores/messagesStore';
import { IUser } from '../../types/user.interface';
import React from 'react';

function Login() {
    let user = {} as IUser;
    let setUser = useUserStore(state => state.setUser);
    let setCurrentUser = useMessagesStore(state => state.setCurrentUser);

    const navigate = useNavigate();

    async function checkClick() {
        let inputLogin = (document.getElementById('inputLogin') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        const myModal = document.getElementById('loginModal');
        let modalTitle = myModal?.querySelector('.modal-title');
        let modalBody = myModal?.querySelector('.modal-body');
        if (inputLogin == "" || inputPassword == "") {
            modalTitle!.textContent = "Ошибка";
            modalBody!.textContent = "Введите данные";
            return;
        }
        try{
            const response = await fetch(variables.API_URL + "/user/login?login=\'" + inputLogin + "\'&password=\'" + inputPassword + "\'");
            const data = await response.json();
            user = data[0] as IUser;
            setUser(data[0]);
        }
        catch(e){
            modalTitle!.textContent = "Ошибка";
            modalBody!.textContent = e as string;
            return;
        }

        console.log(user);
        if (user.login) {
            modalTitle!.textContent = "Успешно";
            modalBody!.textContent = "Вы успешно вошли";
            // window.location.assign('localhost:3000/chats');
            setCurrentUser(null);
            navigate('/chats');
        }
        else {
            modalTitle!.textContent = "Ошибка";
            modalBody!.textContent = "Вы ввели неправильный логин или пароль";
        }
        
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputLogin">Логин</label>
                    <input className="form-control" id="inputLogin" placeholder="Введите логин" />
                </div>
                <div className="mb-3">
                    <label className="mb-1" htmlFor="inputPassword">Пароль</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Введите пароль" />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    onClick={() => checkClick()}
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal">
                    Войти
                </button>
                <Modal id='loginModal' componentName='login'/> 
            </form>
        </div>

    )
}
export default Login;