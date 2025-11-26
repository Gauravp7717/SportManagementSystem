import React, { useState } from "react";
import { useAuth } from "../context/Authprovider";
import { useNavigate, Navigate } from "react-router-dom";
import banner from "../assets/banner.webp";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(username, password);

    setIsLoading(false);

    if (result.success) {
      const role = result.user.role;

      if (role === "SUPER_ADMIN") navigate("/app");
      else if (role === "CLUB_ADMIN") navigate("/club");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      />

      <div className="relative z-10 max-w-md w-full px-6">
        <div className="bg-black/40 p-8 rounded-lg border border-yellow-400/40 backdrop-blur-xl shadow-xl">
          <h1 className="text-3xl text-yellow-400 font-bold text-center mb-6">
            Login
          </h1>

          {error && (
            <p className="text-red-400 text-center mb-4 font-semibold">
              {error}
            </p>
          )}

          <form className="space-y-6">
            <div>
              <label className="text-yellow-400 text-sm font-semibold">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-black/40 border border-yellow-400/50 rounded-lg text-yellow-400"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="text-yellow-400 text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-black/40 border border-yellow-400/50 rounded-lg text-yellow-400"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-yellow-400 text-black font-bold rounded-lg mt-4"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <p className="text-center text-yellow-400/70 mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-yellow-400 font-semibold"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
