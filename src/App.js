import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Home from "./Home";
import Users from "./Users";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import {darkTheme, lightTheme} from "./styles/theme";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Loading from "./common/Loading";

function App({ signOut }) {
  const { authUser, loading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set dark mode based on user's system preferences
  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkMode.matches);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/home"
          element={authUser ? <Home /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={
            authUser ? <Navigate to="/home" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/users"
          element={
            <Users />
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

const formFields = {
  signUp: {
    email: {
      label: "Email",
      placeholder: "Enter your email",
      required: true,
      order: 1,
    },
    username: {
      label: "Username",
      placeholder: "Enter your username",
      required: true,
      order: 2,
    },
    password: {
      label: "Password",
      placeholder: "Enter your password",
      required: true,
    },
  },
};

const AppWithAuth = withAuthenticator(
  (props) => (
    <SnackbarProvider>
      <AuthProvider>
        <App {...props} />
      </AuthProvider>
    </SnackbarProvider>
  ),
  { formFields }
);

export default AppWithAuth;
