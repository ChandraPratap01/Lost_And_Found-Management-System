import { useState } from "react";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.25),_transparent_30%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-12 lg:flex-row lg:items-center">
        <section className="max-w-xl space-y-5">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-amber-700 shadow-sm ring-1 ring-amber-100">
            Safer returns, simpler reporting
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Keep lost items visible until they make it back home.
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Report lost belongings, publish found items, and manage claims from
            one clean dashboard.
          </p>
        </section>

        <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur">
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500">
              Sign in to manage your lost and found updates.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              text={isSubmitting ? "Signing in..." : "Login"}
              onClick={handleLogin}
              disabled={isSubmitting}
              className="mt-2"
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-semibold text-amber-700">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
