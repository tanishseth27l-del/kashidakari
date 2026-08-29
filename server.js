// ===================================================
//  Kashidakari - Fresh Chicken Shop, Chowk, Lucknow
//  Backend Server (Node.js + Express)
// ===================================================
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CONTACT_FILE = path.join(DATA_DIR, "messages.json");

// ---------- Make sure data folder + files always exist ----------
// (Handles the case where the empty "data" folder didn't get uploaded to
//  GitHub, or the files were missing for any other reason — server will
//  create them itself instead of crashing.)
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, "[]");
}
if (!fs.existsSync(CONTACT_FILE)) {
  fs.writeFileSync(CONTACT_FILE, "[]");
}

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ---------- Helpers ----------
function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

// ---------- API: Place a new order ----------
app.post("/api/orders", (req, res) => {
  const { name, phone, address, items, notes } = req.body;

  if (!name || !phone || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Naam, phone number aur kam se kam ek item zaroori hai.",
    });
  }

  const newOrder = {
    id: Date.now().toString(),
    name: name.trim(),
    phone: phone.trim(),
    address: (address || "").trim(),
    items,
    notes: (notes || "").trim(),
    status: "New",
    createdAt: new Date().toISOString(),
  };

  const orders = readOrders();
  orders.unshift(newOrder);
  writeOrders(orders);

  res.json({ success: true, message: "Order mil gaya! Dukaan jaldi confirm karegi.", order: newOrder });
});

// ---------- API: Get all orders (for shop owner) ----------
app.get("/api/orders", (req, res) => {
  const orders = readOrders();
  res.json({ success: true, orders });
});

// ---------- API: Update order status (New / Confirmed / Delivered) ----------
app.patch("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = readOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order nahi mila." });
  }

  order.status = status || order.status;
  writeOrders(orders);
  res.json({ success: true, order });
});

// ---------- API: Contact form ----------
app.post("/api/contact", (req, res) => {
  const { name, phone, message } = req.body;
  if (!name || !message) {
    return res.status(400).json({ success: false, message: "Naam aur message zaroori hai." });
  }
  const raw = fs.readFileSync(CONTACT_FILE, "utf-8");
  const messages = JSON.parse(raw || "[]");
  messages.unshift({
    id: Date.now().toString(),
    name,
    phone: phone || "",
    message,
    createdAt: new Date().toISOString(),
  });
  fs.writeFileSync(CONTACT_FILE, JSON.stringify(messages, null, 2));
  res.json({ success: true, message: "Message bhej diya gaya." });
});

// ---------- Fallback to index.html ----------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Kashidakari server chal raha hai: http://localhost:${PORT}`);
});
