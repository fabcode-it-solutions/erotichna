"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/contexts/auth/AuthProvider";

export default function LinkTwitterPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/twitter/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to link account");
      }
      setUser(data);
      router.replace(data.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      setError(err.message || "Failed to link account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-[420px] shadow"
      >
        <h2 className="text-lg font-semibold mb-4">Link your account</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter your email. If we find an account, we&apos;ll link your Twitter
          login. If not, we&apos;ll create a new account with this email.
        </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border rounded-lg px-3 py-2 w-full mb-3"
        />
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <button
          type={loading ? "button" : "submit"}
          className={`px-4 py-2 rounded-lg w-full ${
            loading ? "bg-gray-300" : "bg-black text-white"
          }`}
        >
          {loading ? "Linking..." : "Link Account"}
        </button>
      </form>
    </div>
  );
}
