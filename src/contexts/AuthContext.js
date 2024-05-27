import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { signOut } from 'aws-amplify/auth';
import { addRequestInterceptors, clearRequestInterceptors } from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const role = useMemo(() => authUser?.tokens?.idToken?.payload['cognito:groups']?.[0], [authUser]);
  const [loading, setLoading] = useState(true);
  const interceptorId = useRef(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const session = await fetchAuthSession();
        if (!session) {
          throw new Error('No credentials in session');
        }
        setAuthUser(session);
        const token = session?.tokens?.idToken?.toString() || null;
        if (token) {
          const id = addRequestInterceptors(token);
          interceptorId.current = id;
          console.log('Request interceptor added', id);
        }
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
      if (interceptorId.current) {
        clearRequestInterceptors(interceptorId.current);
      }
    };
  }, []);

  const logOut = async () => {
    try {
      await signOut();
      setAuthUser(null);
      if (interceptorId) {
        clearRequestInterceptors(interceptorId);
      }
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, loading, logOut, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
