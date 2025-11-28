import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Base URL for API
  const API_BASE =
    import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000";

  // Safe user state initialization
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.warn("Invalid user data in localStorage, clearing:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  // Safe isAuthenticated state initialization
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem("isAuthenticated");
      return savedAuth === "true";
    } catch (error) {
      console.warn("Invalid auth data in localStorage, clearing:", error);
      localStorage.removeItem("isAuthenticated");
      return false;
    }
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
          const userData = data.data;

          // Safe storage update
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("isAuthenticated", "true");
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        // Don't clear storage on network errors - let login handle it
      }
    };

    fetchCurrentUser();
  }, [API_BASE]);

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
        return { success: false, message: data.message || "Login failed" };
      }

      const loggedInUser = data.data.loggedInUser;

      // Safe state and storage update
      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("isAuthenticated", "true");

      return { success: true, user: loggedInUser };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error during login" };
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
        return {
          success: false,
          message: data.message || "Registration failed",
        };
      }

      const newUser = data.data.user;

      // Safe state and storage update
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("isAuthenticated", "true");

      return { success: true, user: newUser };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Network error during registration" };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with cleanup even if API fails
    }

    // Safe cleanup
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
