// This is a node backend server that does the following things:
// User authentication using JWT (login and registration)
// CRUD operations for blog posts (create, read, update, delete)
// Authenticated users should be able to create, read, update, and delete blog posts
// Unauthenticated users should be able to read blog posts

// Importing modules

const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const protectedRoute = require("./routes/protected");
const unprotectedRoute = require("./routes/unprotected");

// Connecting to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/protected", protectedRoute);
app.use("/", unprotectedRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
