import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-white/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-lg shadow-amber-200/60">
            LF
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Lost & Found
            </h1>
            <p className="text-xs text-slate-500">Community item tracker</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/dashboard"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-amber-50 hover:text-slate-900"
          >
            Dashboard
          </Link>
          <Link
            to="/create"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-amber-50 hover:text-slate-900"
          >
            Add Item
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
