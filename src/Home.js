import React from 'react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default Home;

