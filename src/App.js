import './App.css';
import Submit from './component/page/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Auth from './component/page/Auth';
import Result from './component/page/Result'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Submit/>}/>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/result' element={<Result/>}/>
    </Routes>
    </BrowserRouter>
  );
}


export default App;
