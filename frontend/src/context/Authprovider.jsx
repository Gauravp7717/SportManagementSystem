import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Base URL for API
  const API_BASE =
    import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000";

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Fetch current logged-in user on page refresh
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/users/current-user`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(data.data));
          localStorage.setItem("isAuthenticated", "true");
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, []);

  // 🔐 LOGIN
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      const loggedInUser = data.data.loggedInUser;

      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("isAuthenticated", "true");

      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  // 🆕 🔐 REGISTER USER
  const registerUser = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message };
      }

      const newUser = data.data.user;

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("isAuthenticated", "true");

      return { success: true, user: newUser };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Registration failed" };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await fetch(`${API_BASE}/api/v1/users/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
