import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "./models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

const MONGO_URI =
    "mongodb+srv://CoderUser:CoderPassword@codercluster.kzbmt.mongodb.net/?retryWrites=true&w=majority&appName=CoderCluster";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("Conectado a MongoDB Atlas"))
    .catch((err) => console.error("Error al conectar a MongoDB: ", err));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () =>
    console.log(`Servidor corriendo en el puerto ${PORT}`)
);
const io = new Server(httpServer);
app.set("socketio", io);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", async (product) => {
        try {
            const newProduct = new Product({
                name: product.name,
                price: product.price,
                category: product.category,
                available: product.available,
            });

            await newProduct.save();

            const products = await Product.find();

            io.emit("updateProducts", products);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    });
});
