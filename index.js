const express = require("express");
const cors = require("cors");
const path = require("path");
const minify = require("terser");

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

async function minifyJavaScript(code) {
  try {
    const result = await minify(code, { sourceMap: true });
    return result.code;
  } catch (error) {
    console.error("Error minifying code:", error);
    return code;
  }
}

app.use(express.static(path.join(__dirname, "/frontend")));

app.get("/flutter.js", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../flutter.js");
    const code = await fs.promises.readFile(filePath, "utf8");
    const minifiedCode = await minifyJavaScript(code);

    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Accept-Encoding", "gzip, compress, br");
    res.send(minifiedCode);
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("*", async (req, res) => {
  try {
    const indexPath = path.join(__dirname, "/frontend/index.html");
    res.sendFile(indexPath);
  } catch (err) {
    console.error("Error reading file:", err);
    res.status(500).send("Internal Server Error");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
