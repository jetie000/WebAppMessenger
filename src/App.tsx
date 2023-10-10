import Home from './pages/Home/Home'
import Chats from './pages/Chats/Chats';
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom';

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Home isLogin={true} />} />
          <Route path='/' element={<Home isLogin={true} />} />
          <Route path='/register' element={<Home isLogin={false}/>} />
          <Route path='/chats' element={<Chats />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
