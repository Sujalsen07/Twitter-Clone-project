import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, X } from "lucide-react";
import { Button } from "./ui/button";
import Twitterlogo from "./Twitterlogo";
import { useAuth } from "@/context/AuthContext";

const Authmodel = ({ isOpen, onClose, initialMode = "login" }: any) => {
  const { isloading, login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState<{ message?: string; [key: string]: any }>(
    {}
  );

  if (!isOpen) return null;

  // -------------------------------
  // ✅ Validation Function
  // -------------------------------
  const validateForm = () => {
    const newErrors: any = {};

    // Common field: Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    // Common field: Password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Signup specific validation
    if (mode === "signup") {
      if (!formData.displayName.trim()) {
        newErrors.displayName = "Display name is required.";
      }
      if (!formData.username.trim()) {
        newErrors.username = "Username is required.";
      } else if (!/^[a-zA-Z0-9_]{3,15}$/.test(formData.username)) {
        newErrors.username =
          "Username must be 3–15 characters (letters, numbers, underscores).";
      }
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0; // ✅ return true if valid
  };

  // -------------------------------
  // ✅ Handle Submit
  // -------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(!validateForm()|| isloading) return; // stop if invalid or loading

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.username,
          formData.displayName
        );
      }
    } catch (err) {
      setError({ message: "Authentication failed. Please try again." });
      return;
    }

    if (!validateForm()) return; // stop if invalid

    // ✅ Clear errors and simulate auth action
    setError({});
    console.log(
      `${mode === "login" ? "Logging in" : "Signing up"}...`,
      formData
    );

    // Close modal and reset form after submission
    onClose();
    setFormData({
      email: "",
      password: "",
      username: "",
      displayName: "",
    });
  };

  // -------------------------------
  // ✅ Handle Input Change
  // -------------------------------
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (error[field]) {
      setError((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // -------------------------------
  // ✅ Switch Mode (Login <-> Signup)
  // -------------------------------
  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError({});
    setFormData({
      email: "",
      password: "",
      username: "",
      displayName: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="relative w-full max-w-md bg-black text-white border border-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-3 left-3 text-gray-400 hover:text-white"
        >
          <X size={22} />
        </Button>

        {/* Header */}
        <CardHeader className="flex flex-col items-center space-y-4 mt-6">
          <Twitterlogo className="h-10 w-10 text-[#1d9bf0] mx-auto" />
          <CardTitle className="text-2xl font-bold text-center">
            {mode === "login" ? "Sign in to X" : "Create your account"}
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent>
          {/* Global Error */}
          {error.message && (
            <div className="bg-red-500 text-white text-center py-2 px-4 rounded mb-4">
              {error.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Display Name (signup only) */}
            {mode === "signup" && (
              <div className="flex flex-col">
                <label htmlFor="displayName" className="mb-1 font-medium">
                  Display Name
                </label>
                <div className="flex items-center gap-2">
                  <User className="text-gray-400" />
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                      error.displayName ? "border-red-500" : "border-gray-700"
                    } focus:outline-none focus:border-[#1d9bf0]`}
                  />
                </div>
                {error.displayName && (
                  <p className="text-red-500 text-sm mt-1">
                    {error.displayName}
                  </p>
                )}
              </div>
            )}

            {/* Username (signup only) */}
            {mode === "signup" && (
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                    error.username ? "border-red-500" : "border-gray-700"
                  } focus:outline-none focus:border-[#1d9bf0]`}
                />
                {error.username && (
                  <p className="text-red-500 text-sm mt-1">{error.username}</p>
                )}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                  error.email ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:border-[#1d9bf0]`}
              />
              {error.email && (
                <p className="text-red-500 text-sm mt-1">{error.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative flex flex-col">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-3 py-2 rounded bg-gray-900 text-white border ${
                  error.password ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:border-[#1d9bf0]`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-sm text-[#1d9bf0] hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {error.password && (
                <p className="text-red-500 text-sm mt-1">{error.password}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-semibold rounded-full py-3 transition"
            >
              {mode === "login" ? "Log in" : "Sign up"}
            </Button>

            {/* Switch Mode */}
            <p className="text-gray-400 text-sm text-center mt-2">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-[#1d9bf0] hover:underline font-medium"
              >
                {mode === "login" ? "Sign up" : "Log in"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Authmodel;
