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
    <>
    <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
      Logout
    </button>
    <span></span>
    </>
  );
};

export default LogoutButton;