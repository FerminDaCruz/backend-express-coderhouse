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
        const limit = req.query.limit
            ? parseInt(req.query.limit)
            : products.length;
        res.json(products.slice(0, limit));
    } catch (error) {
        res.status(500).json({ error: "Error al leer productos" });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        const product = products.find((p) => p.id === req.params.pid);
        if (!product)
            return res.status(404).json({ error: "Producto no encontrado" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error al leer el producto" });
    }
});

router.post("/", async (req, res) => {
    try {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails = [],
        } = req.body;
        if (
            !title ||
            !description ||
            !code ||
            !price ||
            stock === undefined ||
            !category
        ) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        const newProduct = {
            ...req.body,
            id: (products.length + 1).toString(),
        };
        products.push(newProduct);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        const index = products.findIndex((p) => p.id === req.params.pid);
        if (index === -1)
            return res.status(404).json({ error: "Producto no encontrado" });

        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        const filteredProducts = products.filter(
            (p) => p.id !== req.params.pid
        );
        if (products.length === filteredProducts.length) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        await fs.writeFile(
            productsFilePath,
            JSON.stringify(filteredProducts, null, 2)
        );
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
