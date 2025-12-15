import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const API_BASE =
    import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000";

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem("isAuthenticated") === "true";
    } catch {
      localStorage.removeItem("isAuthenticated");
      return false;
    }
  });

  // Fetch user from backend using cookies
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/current-user`, {
        method: "GET",
        credentials: "include", // send cookies
      });

      if (!res.ok) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        return;
      }

      const data = await res.json();
      const userData = data.data;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true");
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  // On mount, verify cookies
  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOGIN (cookies set by backend)
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/login`, {
        method: "POST",
        credentials: "include", // required to receive httpOnly cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Login failed" };
      }

      const loggedInUser = data.data.loggedInUser;

      setUser(loggedInUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("isAuthenticated", "true");

      return { success: true, user: loggedInUser };
    } catch (error) {
      return { success: false, message: "Network error during login" };
    }
  };

  // REGISTER (also cookie-based)
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

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("isAuthenticated", "true");

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: "network error" };
    }
  };

  // LOGOUT (clears cookies on backend)
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        registerUser,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
