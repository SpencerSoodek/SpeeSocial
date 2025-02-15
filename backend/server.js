import express from "express";
import cors from "cors";
import connectToMongoDB from "./db/connectToMongoDB.js";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import followRequestRoutes from "./routes/followRequestRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const app = express();
const corsOptions = {
    origin: "http://localhost:5000",
    credentials: true,
}
app.use(cors(corsOptions));

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/followRequests", followRequestRoutes);
app.use("/api/posts", postRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve((__dirname, "../frontend/dist/index.html")));
    });
}

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    connectToMongoDB();
})