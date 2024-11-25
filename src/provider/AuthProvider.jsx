import { useEffect, useState } from "react";
import { createContext } from "react";
import app from "../firebase/firebase.config";
import { auth, googleProvider } from "../firebase/firebase"
import { signInWithPopup } from "firebase/auth";

import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import PropTypes from "prop-types";

export const AuthContext = createContext();
const authData = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // console.log(loading, user);

    const createNewUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(authData, email, password);
    };

    const userLogin = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(authData, email, password);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(authData);
    };

    const updateUserProfile = (updatedData) => {
        setLoading(true);
        return updateProfile(authData.currentUser, updatedData);
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
    };

    const authInfo = {
        user,
        setUser,
        createNewUser,
        logOut,
        userLogin,
        loading,
        updateUserProfile,
        signInWithGoogle,
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authData, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;
