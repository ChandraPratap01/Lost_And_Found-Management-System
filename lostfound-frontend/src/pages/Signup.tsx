import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setIsSubmitting(true);
      await api.post("/auth/signup", { name, email, password });
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_30%),linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-6 py-12 lg:flex-row lg:items-center">
        <section className="max-w-xl space-y-5">
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-amber-700 shadow-sm ring-1 ring-amber-100">
            Build trust in your community
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Create an account and start tracking lost or found items quickly.
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Keep posts organized, add photos, and let the right person claim an
            item when the match is real.
          </p>
        </section>

        <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur">
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Create account
            </h2>
            <p className="text-sm text-slate-500">
              Join the app and start sharing item reports.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              text={isSubmitting ? "Creating account..." : "Signup"}
              onClick={handleSignup}
              disabled={isSubmitting}
              className="mt-2"
            />
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-amber-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
