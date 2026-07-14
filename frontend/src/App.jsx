import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Product from "./pages/Product.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          },
          success: {
            style: { background: "#0f766e", color: "#fff" },
            iconTheme: { primary: "#fff", secondary: "#0f766e" },
          },
          error: {
            style: { background: "#be123c", color: "#fff" },
            iconTheme: { primary: "#fff", secondary: "#be123c" },
          },
          loading: {
            style: { background: "#1e40af", color: "#fff" },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Product />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
