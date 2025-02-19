import { Router } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, "../data/products.json");

router.get("/", async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        res.render("home", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al leer los productos" });
    }
});

export default router;
