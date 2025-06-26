const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const chatRoutes = require("./routes/chat");
const suggestionRoutes = require("./routes/suggestions"); 

app.use("/api", chatRoutes);
app.use("/api", suggestionRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
