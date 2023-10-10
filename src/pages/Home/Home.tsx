import Login from './Login';
import Register from './Register';
import { Link, Navigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore';
import './Home.css'

function Home({isLogin}:{isLogin: boolean}) {
  const loggedIn = useUserStore(state => state.loggedIn);
  if (loggedIn() == true){
    return (<Navigate to='/chats'/>)
  }

  let form;
  if (isLogin)
    form = <Login/>;
  else
    form = <Register/>

  return (
    <div className="position-absolute d-flex main-window" >
      <div className="border rounded p-5 inner-window">
        <ul className="navbar-nav flex-row justify-content-between gap-3">
          <li className="nav-item w-100">
            <Link className="btn w-100 btn-light btn-outline-primary" to={'/login'}>Вход</Link>
          </li>
          <li className="nav-item w-100">
            <Link className="btn w-100 btn-light btn-outline-primary" to={'/register'}>Регистрация </Link>
          </li>
        </ul>
        {form}
      </div>
    </div>
  );
}

export default Home;
