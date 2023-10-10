import { ChangeEventHandler } from "react";
import { variables } from "../../../Variables";
import { useUserStore } from "../../../stores/userStore";

function Profile() {
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    let photoUserFileName = user != null ? user.photoFileName : 'default.png';

    const saveChanges = async () => {
        let name = (document.getElementById('inputNameProfile') as HTMLInputElement).value.concat(' ').concat((document.getElementById('inputSurnameProfile') as HTMLInputElement).value);

        await fetch(variables.API_URL + '/user', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "Id": user.id,
                "Login": (document.getElementById('inputLoginProfile') as HTMLInputElement).value,
                "Password": (document.getElementById('inputPasswordProfile') as HTMLInputElement).value,
                "Name": name,
                "LeaveDate": user.leaveDate,
                "JoinDate": user.joinDate,
                "IsOnline": true,
                "PhotoFileName": user.photoFileName
            })
        })
        setUser({
            id: user.id,
            login: (document.getElementById('inputLoginProfile') as HTMLInputElement).value,
            password: (document.getElementById('inputPasswordProfile') as HTMLInputElement).value,
            name: name,
            leaveDate: user.leaveDate,
            joinDate: user.joinDate,
            isOnline: true,
            photoFileName: document.getElementById('photoFileName')!.textContent || 'default.jpg'
        })
    }

    const imageUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files![0], e.target.files![0].name);
        fetch(variables.API_URL+'/user/SaveFilePhoto',
        {
            method: 'POST',
            body: formData
        }).then(res=> res.json())
        .then(data=> {
            document.getElementById('photoFileName')!.textContent = data;
            saveChanges();
        })
    }

    return (
        <div className="d-flex flex-column h-100">
            <div className=" d-flex pe-3 pt-3 mb-auto">
                <div className="d-flex flex-column align-items-center">
                    <img className="align-self-start mt-4 ms-3 me-3 profile-img rounded-circle" src={variables.PHOTO_URL + photoUserFileName} alt={user && user.login[0]} />
                    <span className="text-truncate" id="photoFileName">{user && user.photoFileName}</span>
                    <div className="input-group file-upload">
                        <label>
                            <input type="file" className="form-control" onChange={imageUpload} id="inputGroupFile01"/>
                            <span className="btn btn-primary m-3 mb-0">Выбрать файл</span>
                        </label>
                    </div>
                </div>
                <div className="d-flex flex-column">
                    <div>
                        <label htmlFor="inputSurnameProfile">Фамилия</label>
                        <input className="form-control" id="inputSurnameProfile" defaultValue={user && user.name.split(' ')[1]} placeholder="Введите фамилию" />
                    </div>
                    <div>
                        <label htmlFor="inputNameProfile">Имя</label>
                        <input className="form-control" id="inputNameProfile" defaultValue={user && user.name.split(' ')[0]} placeholder="Введите имя" />
                    </div>
                    <div className="">
                        <label htmlFor="inputLoginProfile">Логин</label>
                        <input className="form-control" id="inputLoginProfile" defaultValue={user && user.login} placeholder="Введите логин" />
                    </div>
                    <div className="mb-auto">
                        <label htmlFor="inputPasswordProfile">Пароль</label>
                        <input type="password" className="form-control" id="inputPasswordProfile" defaultValue={user && user.password} placeholder="Введите пароль" />
                    </div>
                </div>
            </div>

            <button type="button"
                className="btn btn-primary m-3"
                onClick={saveChanges}>
                Сохранить данные
            </button>
        </div>
    );
}

export default Profile;