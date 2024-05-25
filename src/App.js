import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Home from './Home';
import { fetchAuthSession  } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

function App({ signOut, user }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session) {
          throw new Error('No credentials in session');
        }
        setAuthUser(session);
      } catch (error) {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    const handleAuthEvents = (event) => {
      if (event.payload.event === 'signIn') {
        checkUser();
      } else if (event.payload.event === 'signOut') {
        setAuthUser(null);
      }
    };

    const listener = Hub.listen('auth', handleAuthEvents);
    checkUser();

    return () => {
      listener();
    };
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/home" element={authUser ? <Home signOut={signOut} /> : <Navigate to="/" />} />
      <Route path="/" element={authUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />
    </Routes>
  );
}

const formFields = {
  signUp: {
    email: {
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
      order: 1,
    },
    username: {
      label: 'Username',
      placeholder: 'Enter your username',
      required: true,
      order: 2,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
    },
  },
};

const AppWithAuth = withAuthenticator(App, { formFields });

export default AppWithAuth;
