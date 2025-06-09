require("dotenv").config();
const express = require("express");
const app = express();

const linkedinRoutes = require("./routes/linkedin.routes");

app.use(express.json());
app.use("/", linkedinRoutes);

const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Visit http://localhost:${PORT}/auth/linkedin to begin LinkedIn OAuth`);
});
