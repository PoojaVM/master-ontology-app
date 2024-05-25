import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Home from './Home';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import darkTheme from './styles/theme';
import { ThemeProvider, CssBaseline } from '@mui/material';


function App({ signOut }) {
  const { authUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/home" element={authUser ? <Home signOut={signOut} /> : <Navigate to="/" />} />
        <Route path="/" element={authUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
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

const AppWithAuth = withAuthenticator((props) => (
  <AuthProvider>
    <App {...props} />
  </AuthProvider>
), { formFields });

export default AppWithAuth;

