import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaBoxesStacked,
  FaChartLine,
  FaShieldHeart,
} from "react-icons/fa6";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Signing you in…");
    setTimeout(() => {
      localStorage.setItem("token", "demo123");
      toast.success("Welcome back! Login successful 👋", { id: toastId });
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-18 flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-slate-900">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-200">
              <FaBoxesStacked />
            </span>
            Stockly
          </div>
          <p className="mb-2 text-xs font-bold tracking-[.16em] text-indigo-600">
            OPERATIONS PORTAL
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-3 text-slate-500">
            Sign in to keep your inventory moving.
          </p>

          <form className="mt-9 space-y-5" onSubmit={handleLogin}>
            <label className="block text-sm font-semibold text-slate-700">
              Email address
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                type="email"
                placeholder="you@company.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Password
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                type="password"
                placeholder="Enter your password"
                required
              />
            </label>
            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-70"
              type="submit"
            >
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <FaArrowRight />}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Demo access — any email and password work.
          </p>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-600 p-14 text-white lg:block">
        <div className="absolute -right-32 -top-32 size-150 rounded-full border border-white/15" />
        <div className="absolute -bottom-48 -left-40 size-140 rounded-full border border-white/15" />
        <div className="relative mx-auto mt-[22vh] max-w-lg">
          <span className="rounded-full bg-white/15 px-3 py-2 text-xs font-bold tracking-wider">
            INVENTORY, SIMPLIFIED
          </span>
          <h2 className="mt-7 font-display text-5xl font-bold leading-[1.05] tracking-tight">
            Everything in stock. Always in view.
          </h2>
          <p className="mt-5 max-w-md leading-7 text-indigo-100">
            Monitor products, stock levels, and sales activity from one elegant
            workspace.
          </p>
          <div className="mt-10 flex gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <FaChartLine className="mb-3 text-cyan-200" />
              <strong className="block font-display text-2xl">99.9%</strong>
              <span className="text-sm text-indigo-100">inventory accuracy</span>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <FaShieldHeart className="mb-3 text-cyan-200" />
              <strong className="block font-display text-2xl">24/7</strong>
              <span className="text-sm text-indigo-100">visibility</span>
            </div>
          </div>
        </div>
      </aside>
    </main>
  );
}
