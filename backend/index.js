require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
);
app.use(express.json());

// Product Schema
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
});
const Product = mongoose.model("Product", ProductSchema);
app.get("/", (req, res) => {
    res.send("Dashboard backend is running");
});
// ROUTES
// Get all products
app.get("/api/products", async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Unable to load products" });
    }
});

// Add product
app.post("/api/products", async(req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res
            .status(400)
            .json({ message: error.message || "Unable to save product" });
    }
});

// Delete product
app.delete("/api/products/:id", async(req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ message: "Unable to delete product" });
    }
});

const port = process.env.PORT || 5000;

async function startServer() {
    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI is missing. Add it to backend/.env before starting the server.",
        );
    }

    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected");
    app.listen(port, () => console.log(`Server running on ${port}`));
}

startServer().catch((error) => {
    console.error("Unable to start the API:", error.message);
    process.exit(1);
});