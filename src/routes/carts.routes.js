import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cartsFilePath = path.join(__dirname, "../data/carts.json");

router.post("/", async (req, res) => {
    try {
        const data = await fs.readFile(cartsFilePath, "utf-8");
        const carts = JSON.parse(data);
        const newCart = { id: (carts.length + 1).toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const data = await fs.readFile(cartsFilePath, "utf-8");
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === req.params.cid);
        if (!cart)
            return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const data = await fs.readFile(cartsFilePath, "utf-8");
        const carts = JSON.parse(data);
        const cart = carts.find((c) => c.id === req.params.cid);
        if (!cart)
            return res.status(404).json({ error: "Carrito no encontrado" });

        const productIndex = cart.products.findIndex(
            (p) => p.product === req.params.pid
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }

        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

export default router;
