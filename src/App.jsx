//import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Reportes from './Reportes';
import {useContext } from 'react'
//components
import LogoutButton from './components/LogoutButton';
import {AuthContext } from './context/AuthContext';
import Login from './components/Login';

function App() {
  
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      {currentUser ? (
        <div>
        <LogoutButton />
        <Reportes />
        </div>
      ) : (
        <>
          <Login />
        </>
      )}
    </div>
    
  )
}

export default App
