// const express = require("express");
// const { Sequelize, DataTypes } = require("sequelize");
// require("dotenv").config();
// const path = require("path");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.static("public"));

// // Database connection
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   logging: false,
// });

// // Define User model
// const User = sequelize.define("User", {
//   name: { type: DataTypes.STRING, allowNull: false },
//   email: { type: DataTypes.STRING, unique: true, allowNull: false },
// });

// // Sync database
// sequelize.sync();

// // Routes
// app.get("/users", async (req, res) => {
//   const users = await User.findAll();
//   res.json(users);
// });

// app.post("/users", async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// Define User model
const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
});

// Sync database with retry logic
const connectWithRetry = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await sequelize.sync();
    console.log("Database synced.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    console.log("Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();

// Routes

// Get all users
app.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// Add a new user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).send(); // No content
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});