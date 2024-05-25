import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Header = () => {
  const { authUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome, {authUser?.tokens?.idToken?.payload?.['cognito:username'] || 'Guest'}
        </Typography>
        <Button color="inherit" onClick={handleSignOut}>Sign Out</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
