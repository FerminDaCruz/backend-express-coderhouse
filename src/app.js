import express from "express";
import { promises as fs } from "fs"; // Usar fs.promises en lugar de fs
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import { productsFilePath } from "./utils.js"; // Asegúrate de que esto esté definido correctamente

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Configurar Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Servidor HTTP y WebSocket
const httpServer = app.listen(PORT, () =>
    console.log(`Servidor corriendo en el puerto ${PORT}`)
);
const io = new Server(httpServer);

// Compartir `io` con las rutas
app.set("socketio", io);

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("newProduct", async (product) => {
        try {
            // Usar fs.promises.readFile para leer el archivo de forma asíncrona
            const data = await fs.readFile(productsFilePath, "utf-8");
            const products = JSON.parse(data);

            const newProduct = {
                id: (products.length + 1).toString(),
                title: product.title,
                price: product.price,
            };

            products.push(newProduct);

            // Usar fs.promises.writeFile para escribir el archivo de forma asíncrona
            await fs.writeFile(
                productsFilePath,
                JSON.stringify(products, null, 2)
            );

            io.emit("updateProducts", products);
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    });
});
