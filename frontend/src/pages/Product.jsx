import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBars,
  FaBell,
  FaBoxOpen,
  FaChartColumn,
  FaChevronDown,
  FaCube,
  FaGear,
  FaHouse,
  FaMagnifyingGlass,
  FaPlus,
  FaRightFromBracket,
  FaTags,
  FaTrash,
  FaUsers,
  FaCircleExclamation,
  FaXmark,
} from "react-icons/fa6";

const API = `${import.meta.env.VITE_API_URL}/api/products`;
console.log(API,'-------API--------');

const emptyForm = { name: "", price: "", stock: "", category: "" };
const productImages = {
  "LED Bulb 9W": "💡",
  "Ceiling Fan": "🪭",
  "Extension Board": "🔌",
  "MCB Switch": "⚡",
  "Electric Wire 1.5mm": "🧶",
  "Socket 5A": "🔌",
  "Modular Switch": "🎚️",
  "Tube Light": "💡",
  "Distribution Board": "🗄️",
  "Exhaust Fan": "🌀",
};
const navItems = [
  [FaHouse, "Dashboard", "/dashboard"],
  [FaCube, "Products", "/products"],
  [FaTags, "Categories"],
  [FaBoxOpen, "Orders"],
  [FaUsers, "Customers"],
  [FaChartColumn, "Reports"],
  [FaGear, "Settings"],
];

/* ─── Confirmation Modal ─────────────────────────────────────────────────── */
function ConfirmModal({ productName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <FaXmark />
        </button>

        <div className="mb-4 grid size-14 place-items-center rounded-full bg-red-100 text-2xl text-red-600">
          <FaCircleExclamation />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Delete Product?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-800">"{productName}"</span>?
          This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-red-700"
          >
            <FaTrash className="text-sm" /> Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function Product() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // null = modal hidden | { id, name } = show modal for this product
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    try {
      const { data } = await axios.get(API);
      setProducts(data);
      setError("");
    } catch {
      setError(
        "Could not load products. Confirm the backend is running and connected to MongoDB.",
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (event) => {
    event.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Adding product…");
    try {
      await axios.post(API, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setForm(emptyForm);
      await load();
      toast.success("Product added successfully! 🎉", { id: toastId });
    } catch (requestError) {
      const msg =
        requestError.response?.data?.message || "We couldn't save that product.";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteTarget) return;
    const toastId = toast.loading("Deleting product…");
    try {
      await axios.delete(`${API}/${deleteTarget.id}`);
      await load();
      toast.success(`"${deleteTarget.name}" deleted successfully!`, {
        id: toastId,
      });
    } catch {
      const msg = "We couldn't remove that product.";
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setDeleteTarget(null);
    }
  };
  const filtered = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [products, query],
  );
  const perPage = 5;
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const displayed = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          productName={deleteTarget.name}
          onConfirm={remove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <header className="sticky top-0 z-20 flex h-19 items-center bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 px-5 text-white shadow-lg">
        <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
          <span className="text-4xl text-orange-400">ϟ</span>
          <span>
            Electro<span className="text-orange-400">Hub</span>
          </span>
        </div>
        <FaBars className="ml-16 hidden text-xl lg:block" />
        <div className="ml-auto flex items-center gap-7">
          <FaMagnifyingGlass className="hidden text-xl sm:block" />
          <div className="relative">
            <FaBell className="text-xl" />
            <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-orange-500 text-[10px] font-bold">
              3
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-slate-100 text-lg text-slate-400">
              ●
            </span>
            <span className="hidden font-semibold md:inline">Admin User</span>
            <FaChevronDown className="hidden text-sm md:block" />
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-19 hidden h-[calc(100vh-4.75rem)] w-72 shrink-0 border-r border-slate-200 bg-white p-4 lg:flex lg:flex-col">
          <nav className="space-y-2">
            {navItems.map(([Icon, label, path]) =>
              path ? (
                <Link
                  key={label}
                  to={path}
                  className={`flex items-center gap-4 rounded-md px-5 py-4 text-base font-semibold transition ${label === "Products" ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "text-slate-800 hover:bg-blue-50 hover:text-blue-700"}`}
                >
                  <Icon
                    className={
                      label === "Products" ? "text-orange-300" : "text-slate-700"
                    }
                  />
                  {label}
                </Link>
              ) : (
                <button
                  key={label}
                  className="flex w-full items-center gap-4 rounded-md px-5 py-4 text-left text-base font-semibold hover:bg-blue-50 hover:text-blue-700"
                >
                  <Icon />
                  {label}
                </button>
              ),
            )}
          </nav>
          <button className="mt-auto flex items-center gap-3 rounded-md border border-blue-600 px-5 py-3 font-bold text-blue-700 hover:bg-blue-50">
            <FaRightFromBracket />
            Logout
          </button>
        </aside>

        <main className="min-w-0 flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                  Product Management
                </h1>
                <p className="mt-2 flex items-center gap-2 text-slate-600">
                  <span className="h-1 w-10 bg-orange-500" />
                  Manage all electrical products
                </p>
              </div>
              <div className="text-sm text-slate-600">
                Dashboard <span className="mx-1">/</span>{" "}
                <span className="font-semibold text-orange-500">Products</span>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Add Product Form */}
            <form
              onSubmit={add}
              className="mb-7 rounded-xl bg-white p-6 shadow-md shadow-slate-300/50"
            >
              <h2 className="flex items-center gap-3 text-xl font-bold text-slate-950">
                <span className="grid size-7 place-items-center rounded-full bg-orange-500 text-sm text-white">
                  <FaPlus />
                </span>
                Add New Product
              </h2>
              <div className="mt-5 grid gap-4 lg:grid-cols-4">
                <Input
                  label="Product Name"
                  value={form.name}
                  onChange={(value) => setForm({ ...form, name: value })}
                  icon={<FaTags />}
                />
                <Input
                  label="Price"
                  type="number"
                  value={form.price}
                  onChange={(value) => setForm({ ...form, price: value })}
                  icon={<span>₹</span>}
                />
                <Input
                  label="Stock"
                  type="number"
                  value={form.stock}
                  onChange={(value) => setForm({ ...form, stock: value })}
                  icon={<FaCube />}
                />
                <label className="relative">
                  <FaTags className="pointer-events-none absolute left-4 top-4 z-10 text-slate-500" />
                  <select
                    className="w-full appearance-none rounded-md border border-slate-300 bg-white py-3 pl-11 pr-9 text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    value={form.category}
                    required
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="" disabled>
                      Category
                    </option>
                    <option>Lighting</option>
                    <option>Fan</option>
                    <option>Accessories</option>
                    <option>Switch</option>
                    <option>Cable</option>
                    <option>Socket</option>
                    <option>Panel</option>
                  </select>
                  <FaChevronDown className="pointer-events-none absolute right-4 top-4 text-slate-500" />
                </label>
              </div>
              <button
                disabled={saving}
                className="mt-4 inline-flex items-center gap-3 rounded-md bg-green-600 px-5 py-3 font-bold text-white shadow hover:bg-green-700 disabled:opacity-60"
              >
                <FaPlus />
                {saving ? "Adding…" : "Add Product"}
              </button>
            </form>

            {/* Product Table */}
            <section className="overflow-hidden rounded-xl bg-white shadow-md shadow-slate-300/50">
              <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-3 text-xl font-bold text-slate-950">
                  <span className="grid size-7 place-items-center rounded-full bg-orange-500 text-xs text-white">
                    <FaBars />
                  </span>
                  Product List
                </h2>
                <label className="relative w-full sm:w-70">
                  <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-3.5 text-slate-500" />
                  <input
                    className="w-full rounded-md border border-slate-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-600"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-190 text-left">
                  <thead className="bg-gradient-to-r from-blue-800 to-blue-700 text-sm text-white">
                    <tr>
                      <th className="px-6 py-4">#</th>
                      <th className="px-6 py-4">Product Name</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.length ? (
                      displayed.map((product, index) => (
                        <tr
                          key={product._id}
                          className="border-b border-slate-200 text-sm hover:bg-blue-50/40"
                        >
                          <td className="px-6 py-4">
                            {(page - 1) * perPage + index + 1}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-900">
                            <span className="mr-4 inline-grid size-10 place-items-center rounded-lg bg-slate-100 text-2xl">
                              {productImages[product.name] || "📦"}
                            </span>
                            {product.name}
                          </td>
                          <td className="px-6 py-4 font-bold text-orange-500">
                            ₹
                            {Number(product.price || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-blue-100 px-3 py-1.5 font-bold text-blue-700">
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() =>
                                setDeleteTarget({
                                  id: product._id,
                                  name: product.name,
                                })
                              }
                              className="inline-flex items-center gap-2 rounded bg-red-500 px-3 py-2 font-bold text-white shadow-sm hover:bg-red-600"
                            >
                              <FaTrash />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-14 text-center text-slate-500"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <footer className="flex flex-col gap-4 border-t border-slate-200 p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {displayed.length ? (page - 1) * perPage + 1 : 0} to{" "}
                  {Math.min(page * perPage, filtered.length)} of{" "}
                  {filtered.length} products
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="rounded border border-slate-300 px-4 py-2 font-semibold disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pageCount }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`rounded px-4 py-2 font-semibold ${page === index + 1 ? "bg-blue-700 text-white" : "border border-slate-300"}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === pageCount}
                    onClick={() => setPage(page + 1)}
                    className="rounded border border-slate-300 px-4 py-2 font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </footer>
            </section>

            <footer className="flex flex-col justify-between gap-2 py-8 text-sm text-slate-600 sm:flex-row">
              <span>
                © 2025{" "}
                <b className="text-blue-700">
                  Electro<span className="text-orange-500">Hub</span>
                </b>
                . All rights reserved.
              </span>
              <span>
                Made with <b className="text-red-500">♥</b> for better
                management
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange, icon }) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <span className="pointer-events-none absolute left-4 top-3.5 text-slate-500">
        {icon}
      </span>
      <input
        className="w-full rounded-md border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        type={type}
        min={type === "number" ? "0" : undefined}
        step={label === "Price" ? "0.01" : undefined}
        placeholder={label}
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
