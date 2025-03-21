import { Router } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const newCart = await Cart.create({ products: [] });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate(
            "products.product"
        );
        if (!cart)
            return res.status(404).json({ error: "Carrito no encontrado" });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart)
            return res.status(404).json({ error: "Carrito no encontrado" });
        const product = await Product.findById(req.params.pid);
        if (!product)
            return res.status(404).json({ error: "Producto no encontrado" });

        const productIndex = cart.products.findIndex((p) =>
            p.product.equals(req.params.pid)
        );
        if (productIndex !== -1) {
            cart.products[productINdex].quantity++;
        } else {
            cart.products.push({ product: req.params.pid, quantity: 1 });
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid);
        if (!cart)
            return res.status(404).json({ error: "Carrito no encontrado" });

        cart.products = cart.products.filter(
            (p) => !p.product.equals(req.params.pid)
        );
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar producto del carrito",
        });
    }
});

router.put("/:cid", async (req, res) => {
    try {
        const { products } = req.body;
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products },
            { new: true }
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el carrito" });
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findById(req.params.cid);
        if (!cart)
            return res.status(404).json({ error: "Carrito no encontrado" });
        const productIndex = cart.products.findIndex((p) =>
            p.product.equals(req.params.pid)
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            return res
                .status(404)
                .json({ error: "Producto no encontrado en el carrito" });
        }
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({
            error: "Error al actualizar la cantidad del producto",
        });
    }
});

export default router;
