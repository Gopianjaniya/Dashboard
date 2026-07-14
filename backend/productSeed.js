const mongoose = require("mongoose");
require("dotenv").config();

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
  }),
);

const products = [
  { name: "LED Bulb 9W", price: 120, stock: 50, category: "Lighting" },
  { name: "Ceiling Fan", price: 1800, stock: 20, category: "Fan" },
  { name: "Extension Board", price: 350, stock: 40, category: "Accessories" },
  { name: "MCB Switch", price: 280, stock: 60, category: "Switch" },
  { name: "Electric Wire 1.5mm", price: 950, stock: 30, category: "Cable" },
  { name: "Socket 5A", price: 80, stock: 100, category: "Socket" },
  { name: "Modular Switch", price: 95, stock: 120, category: "Switch" },
  { name: "Tube Light", price: 450, stock: 35, category: "Lighting" },
  { name: "Distribution Board", price: 2200, stock: 10, category: "Panel" },
  { name: "Exhaust Fan", price: 1450, stock: 18, category: "Fan" },
];

async function seedProducts() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing from .env");

  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`${inserted.length} products inserted successfully.`);
  await mongoose.disconnect();
}

seedProducts().catch(async (error) => {
  console.error("Product seeding failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
