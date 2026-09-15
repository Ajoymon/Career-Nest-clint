import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const GooglProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);

  // Register
  const registerUser = (email, password) => {
    setloading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  // Login
  const signInUser = (email, password) => {
    setloading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  //to google login
  const signInGoogle = () => {
    setloading(true);
    return signInWithPopup(auth, GooglProvider);
  };
  // logOut
  const logOut = () => {
    setloading(true);
    return signOut(auth);
  };
  // updete profile
  const updateUserProfile = profile => {
    return updateProfile(auth.currentUser, profile);
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, currentUser => {
      setuser(currentUser);
      setloading(false);
    });
    return () => {
      unSubscribe;
    };
  }, []);
  const authinfo = {
    user,
    loading,
    registerUser,
    signInUser,
    signInGoogle,
    logOut,
    updateUserProfile,
  };
  return <AuthContext value={authinfo}>{children}</AuthContext>;
};

export default AuthProvider;
