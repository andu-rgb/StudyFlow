require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log("MongoDB error:", err));

// ── Models ──────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  password: String,
  name: String,
});
const User = mongoose.model("User", userSchema);

const habitSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Habit = mongoose.model("Habit", habitSchema);

// ── Auth Middleware ──────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ── Email/Password Auth Routes ───────────────────────────
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "Email already in use" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, name });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.password) return res.status(400).json({ message: "Invalid credentials" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
});

// ── Habit Routes (protected) ─────────────────────────────
app.get("/api/habits", authMiddleware, async (req, res) => {
  const habits = await Habit.find({ userId: req.user.id });
  res.json(habits);
});

app.post("/api/habits", authMiddleware, async (req, res) => {
  const habit = new Habit({ name: req.body.name, userId: req.user.id });
  await habit.save();
  res.json(habit);
});

app.put("/api/habits/:id", authMiddleware, async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(habit);
});

app.delete("/api/habits/:id", authMiddleware, async (req, res) => {
  await Habit.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(process.env.PORT || 3001, () => console.log(`Server running on port ${process.env.PORT || 3001}`));