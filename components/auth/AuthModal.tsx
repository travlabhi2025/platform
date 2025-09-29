"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"trip-organizer" | "customer">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, name, role);
      }
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="customer"
                      name="role"
                      value="customer"
                      checked={role === "customer"}
                      onChange={(e) =>
                        setRole(e.target.value as "trip-organizer" | "customer")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="customer" className="text-sm text-gray-700">
                      Customer - Book and travel on trips
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="trip-organizer"
                      name="role"
                      value="trip-organizer"
                      checked={role === "trip-organizer"}
                      onChange={(e) =>
                        setRole(e.target.value as "trip-organizer" | "customer")
                      }
                      className="mr-2"
                    />
                    <label
                      htmlFor="trip-organizer"
                      className="text-sm text-gray-700"
                    >
                      Trip Organizer - Create and manage trips
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
