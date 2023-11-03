import React from 'react';
import { variables } from '../../Variables';
import Modal from '../Modal'
import 'bootstrap';

function Register() {

    let isUserExist = "";

    async function setData(login: string) {
        let response = await fetch(variables.API_URL + "/user/register?login='" + login + "'");
        let data = await response.json();
        isUserExist = data;
    }

    function createUser(inputLogin: string, inputPassword: string, inputName: string, inputSurname: string) {
        var date = new Date();
        fetch(variables.API_URL + '/user', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Login": inputLogin,
                "Password": inputPassword,
                "Name": inputName + " " + inputSurname,
                "LeaveDate": date,
                "JoinDate": date,
                "IsOnline": false,
                "PhotoFileName": "default.jpg"
            })
        })
    }

    async function registerClick() {
        let inputName = (document.getElementById('inputName') as HTMLInputElement).value;
        let inputSurname = (document.getElementById('inputSurname') as HTMLInputElement).value;
        let inputLogin = (document.getElementById('inputLogin') as HTMLInputElement).value;
        let inputPassword = (document.getElementById('inputPassword') as HTMLInputElement).value;
        const myModal = document.getElementById('registerModal');
        let modalTitle = myModal?.querySelector('.modal-title');
        let modalBody = myModal?.querySelector('.modal-body');

        if (inputLogin == "" || inputPassword == "" || inputName == "" || inputSurname == "") {
            if (modalTitle == null) {
                console.log("qq");
            }
            modalTitle!.textContent = 'Ошибка';
            modalBody!.textContent = "Введите данные";
            return;
        }
        try{
            await setData(inputLogin);
        }
        catch(e){
            modalTitle!.textContent = "Ошибка";
            modalBody!.textContent = e as string;
            return;
        }
        if (isUserExist == "yes") {
            modalTitle!.textContent = "Ошибка";
            modalBody!.textContent = "Такой логин существует";
        }
        else {
            try{
                createUser(inputLogin.trim(), inputPassword.trim(), inputName.trim(), inputSurname.trim());
            }
            catch(e){
                modalTitle!.textContent = "Ошибка";
                modalBody!.textContent = e as string;
                return;
            }
            modalTitle!.textContent = "Успешно!";
            modalBody!.textContent = "Вы успешно Зарегистрированы!";
        }
    }

    return (
        <div className="mt-3">
            <form>
                <div className="mb-3">
                    <label htmlFor="inputSurname">Фамилия</label>
                    <input className="form-control" id="inputSurname" placeholder="Введите фамилию" />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputName">Имя</label>
                    <input className="form-control" id="inputName" placeholder="Введите имя" />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputLogin">Логин</label>
                    <input className="form-control" id="inputLogin" placeholder="Введите логин" />
                </div>
                <div className="mb-3">
                    <label htmlFor="inputPassword">Пароль</label>
                    <input type="password" className="form-control" id="inputPassword" placeholder="Введите пароль" />
                </div>
                <button type="button"
                    className="btn btn-primary mt-3 w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#registerModal"
                    onClick={() => registerClick()}>
                    Зарегистрироваться
                </button>

                <Modal id='registerModal' componentName='Register'/>
            </form>
        </div>
    )
}

export default Register;