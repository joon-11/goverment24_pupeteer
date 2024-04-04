import logo from './logo.svg';
import './App.css';
import Submit from './component/page/MainPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<Submit/>}/>
    </Routes>
    </BrowserRouter>
  );
}


export default App;
