import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ListRoom from './components/listRoom';
import ListMenu from './components/listMenu';
import ListStaff from './components/listStaff';
import ListCustomer from './components/listCustomer';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/listRoom.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <ListCustomer /> */}
    <ListMenu />
    {/* <ListStaff/>
    <ListRoom/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
