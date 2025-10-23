"use client";

import React, { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";

interface User {
  id?: string;
  username: string;
  displayName: string;
  avatar: string;
  email?: string;
  bio?: string;
  joinedDate?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    username: string,
    displayName: string,
    email: string,
    password: string
  ) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  isloading: boolean;
  googlesignin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloading, setIsloading] = useState(true);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
  });

  // -----------------------------
  // Listen for Firebase auth changes
  // -----------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const fetchOrCreateUser = async () => {
        if (!firebaseUser?.email) {
          setUser(null);
          setIsloading(false);
          localStorage.removeItem("twiller-user");
          return;
        }

        try {
          // Try fetching user from backend
          let res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseUser.email },
          });

          // Normalize response
          const backendUser = res.data.user || res.data;
          setUser(backendUser);
          localStorage.setItem("twiller-user", JSON.stringify(backendUser));
        } catch (err: any) {
          if (err.response?.status === 404) {
            // User not found → create automatically
            const newUser: User = {
              username: firebaseUser.email.split("@")[0],
              displayName: firebaseUser.displayName || "User",
              avatar: firebaseUser.photoURL || "",
              email: firebaseUser.email,
            };
            const registerRes = await axiosInstance.post("/register", newUser);
            const createdUser = registerRes.data.user || registerRes.data;
            setUser(createdUser);
            localStorage.setItem("twiller-user", JSON.stringify(createdUser));
          } else {
            console.error("Error fetching user:", err);
            setUser(null);
            localStorage.removeItem("twiller-user");
          }
        } finally {
          setIsloading(false);
        }
      };

      fetchOrCreateUser();
    });

    return () => unsubscribe();
  }, []);

  // -----------------------------
  // Login
  // -----------------------------
  const login = async (email: string, password: string) => {
    setIsloading(true);
    try {
      const usercred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = usercred.user;

      // Use same fetch-or-create logic
      if (firebaseUser?.email) {
        try {
          const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseUser.email },
          });
          const backendUser = res.data.user || res.data;
          setUser(backendUser);
          localStorage.setItem("twiller-user", JSON.stringify(backendUser));
        } catch (err: any) {
          if (err.response?.status === 404) {
            // Create user if missing
            const newUser: User = {
              username: firebaseUser.email.split("@")[0],
              displayName: firebaseUser.displayName || "User",
              avatar: firebaseUser.photoURL || "",
              email: firebaseUser.email,
            };
            const registerRes = await axiosInstance.post("/register", newUser);
            const createdUser = registerRes.data.user || registerRes.data;
            setUser(createdUser);
            localStorage.setItem("twiller-user", JSON.stringify(createdUser));
          } else {
            throw err;
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsloading(false);
    }
  };

  // -----------------------------
  // Signup
  // -----------------------------
  const signup = async (
    username: string,
    displayName: string,
    email: string,
    password: string
  ) => {
    setIsloading(true);
    try {
      const usercred = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = usercred.user;

      const newUser: User = {
        username,
        displayName,
        avatar: firebaseUser.photoURL || "",
        email: firebaseUser.email || "",
      };

      const res = await axiosInstance.post("/register", newUser);
      const createdUser = res.data.user || res.data;
      setUser(createdUser);
      localStorage.setItem("twiller-user", JSON.stringify(createdUser));
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsloading(false);
    }
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const logout = async () => {
    setIsloading(true);
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("twiller-user");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsloading(false);
    }
  };

  // -----------------------------
  // Update profile
  // -----------------------------
  const updateProfile = async (profileData: Partial<User>) => {
    if (!user?.email) return;
    setIsloading(true);
    try {
      const res = await axiosInstance.patch(`/updateuser/${user.email}`, profileData);
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("twiller-user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setIsloading(false);
    }
  };

  // -----------------------------
  // Google Sign-in
  // -----------------------------
  const googlesignin = async () => {
    setIsloading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      if (firebaseUser?.email) {
        try {
          const res = await axiosInstance.get("/loggedinuser", {
            params: { email: firebaseUser.email },
          });
          const backendUser = res.data.user || res.data;
          setUser(backendUser);
          localStorage.setItem("twiller-user", JSON.stringify(backendUser));
        } catch (err: any) {
          if (err.response?.status === 404) {
            const newUser: User = {
              username: firebaseUser.email.split("@")[0],
              displayName: firebaseUser.displayName || "User",
              avatar: firebaseUser.photoURL || "",
              email: firebaseUser.email,
            };
            const registerRes = await axiosInstance.post("/register", newUser);
            const createdUser = registerRes.data.user || registerRes.data;
            setUser(createdUser);
            localStorage.setItem("twiller-user", JSON.stringify(createdUser));
          } else {
            throw err;
          }
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isloading,
        googlesignin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
