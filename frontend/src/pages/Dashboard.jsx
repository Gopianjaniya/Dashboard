import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaUsers, FaBox, FaDollarSign } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaArrowRight, FaBoxesStacked } from "react-icons/fa6";
const API_URL = import.meta.env.VITE_API_URL;
const Stat = ({ icon, title, value, color }) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
    <span
      className={`grid size-12 place-items-center rounded-2xl text-lg ${color}`}
    >
      {icon}
    </span>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <strong className="font-display text-2xl text-slate-900">{value}</strong>
    </div>
  </div>
);

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch(() =>
        setError(
          "Could not reach the inventory API. Start the backend and try again.",
        ),
      );
  }, []);
  const data = products.map((p) => ({ name: p.name, stock: p.stock }));
  const stock = products.reduce((total, product) => total + product.stock, 0);
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-indigo-700 px-4 py-4 text-white shadow-lg shadow-indigo-200 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3 font-display text-2xl font-bold">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-600 ring-1 ring-white/30">
              <FaBoxesStacked />
            </span>
            Stockly
          </div>
          <div className="flex items-center gap-3 text-sm text-indigo-100">
            <span className="hidden sm:inline">Administrator</span>
            <span className="grid size-9 place-items-center rounded-full bg-white font-bold text-indigo-700">
              A
            </span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[.14em] text-indigo-600">
              OVERVIEW
            </p>
            <h1 className="font-display text-4xl font-bold text-slate-900">
              Inventory dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              A real-time view of your product catalogue.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
          >
            Manage products <FaArrowRight />
          </Link>
        </div>
        {error && (
          <div className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Stat
            icon={<FaBox />}
            title="Total products"
            value={products.length}
            color="bg-indigo-100 text-indigo-600"
          />
          <Stat
            icon={<FaUsers />}
            title="Total stock"
            value={stock}
            color="bg-indigo-100 text-indigo-600"
          />
          <Stat
            icon={<FaDollarSign />}
            title="Revenue"
            value="$12,340"
            color="bg-indigo-100 text-indigo-600"
          />
        </div>
        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="font-display text-xl font-bold">Stock overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Units available by product
          </p>
          <div className="mt-6 h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#4f46e5" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  );
}
