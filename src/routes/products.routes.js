import router from "./carts.routes.js";

router.post("/", async (req, res) => {
    try {
        const { title, price } = req.body;
        if (!title || !price) {
            return res.status(400).json({ error: "Faltan datos" });
        }

        const data = await fs.readFile(productsFilePath, "utf-8");
        const products = JSON.parse(data);
        const newProduct = {
            id: (products.length + 1).toString(),
            title,
            price,
        };
        products.push(newProduct);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

        // Emitir evento de WebSocket
        const io = req.app.get("socketio");
        io.emit("updateProducts", products);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el producto" });
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

        // Emitir evento de WebSocket
        const io = req.app.get("socketio");
        io.emit("updateProducts", filteredProducts);

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});

export default router;
