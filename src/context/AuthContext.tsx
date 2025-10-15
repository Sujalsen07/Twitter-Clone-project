"use client";

import React, { createContext, useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  joiedDate: string;
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
  updatProfile: (profileData: {
    displayName?: string;
    bio?: string;
    avatar?: string;
    location: string;
    website: string;
  }) => Promise<void>;
  logout: () => void;
  isloading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloading, setIsloading] = useState(false);
  useEffect(() => {
    const saveduser = localStorage.getItem("twiller-user");
    if (saveduser) {
      setUser(JSON.parse(saveduser));
    }
    setIsloading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const loggedInUser: User = {
      id: "1",
      username: "johndoe",
      displayName: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=3",
      bio: "Software Developer passionate about building web applications.",
      joiedDate: new Date().toISOString(),
    };
    setUser(loggedInUser);
    localStorage.setItem("twiller-user", JSON.stringify(loggedInUser));
    setIsloading(false);
  };

  const signup = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    setIsloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const loggedInUser: User = {
      id: "1",
      username: username,
      displayName: displayName,
      avatar: "https://i.pravatar.cc/150?img=3",
      bio: "Software Developer passionate about building web applications.",

      joiedDate: new Date().toISOString(),
    };
    setUser(loggedInUser);
    localStorage.setItem("twiller-user", JSON.stringify(loggedInUser));
    setIsloading(false);
  };

  const logout = async () => {
    setIsloading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    localStorage.removeItem("twiller-user");
    setIsloading(false);
  };

  const updatProfile = async (
    profileData: {
      displayName?: string;
      bio?: string;
      avatar?: string;
      location: string;
      website: string;
    }
  ) => {
    if (!user) return;
    setIsloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const updateUser = {
      ...user,
      displayName: profileData.displayName ?? user.displayName,
      bio: profileData.bio ?? user.bio,
      avatar: profileData.avatar ?? user.avatar,
    };

    setUser(updateUser);
    localStorage.setItem("twiller-user", JSON.stringify(updateUser));
    setIsloading(false);
  };
  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updatProfile, isloading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
