import React from 'react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // Optionally, you can redirect the user or show a message
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <button className="btn btn-warning" onClick={handleLogout}>
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;