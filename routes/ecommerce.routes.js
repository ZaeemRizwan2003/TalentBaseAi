const express = require('express');
const router = express.Router();
const Product = require('../models/ecommerce.models');

// Product Listing (POST/GET/DELETE/UPDATE)
router.post('/listProduct', async (req, res) => {
    const productData = req.body;
    try {
        const newProduct = new Product(productData);
        await newProduct.save();
        res.status(201).json({
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
});

router.get('/listProduct', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
});

router.put('/listProduct/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
});

router.delete('/listProduct/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({
            message: 'Product deleted successfully',
            data: deletedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
});

// Feedback (GET/DELETE)
router.get('/feedback/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product.feedback);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching feedback',
            error: error.message
        });
    }
});

router.delete('/feedback/:productId/:feedbackId', async (req, res) => {
    const { productId, feedbackId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const feedbackIndex = product.feedback.findIndex(fb => fb._id == feedbackId);
        if (feedbackIndex === -1) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        product.feedback.splice(feedbackIndex, 1);
        await product.save();
        res.status(200).json({
            message: 'Feedback deleted successfully',
            data: product.feedback
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting feedback',
            error: error.message
        });
    }
});

// Offers (GET/DELETE/POST/REPLY)
router.get('/offers/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product.offers);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching offers',
            error: error.message
        });
    }
});

router.post('/offers/:productId', async (req, res) => {
    const productId = req.params.productId;
    const offer = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        product.offers.push(offer);
        await product.save();
        res.status(201).json({
            message: 'Offer added successfully',
            data: product.offers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding offer',
            error: error.message
        });
    }
});

router.delete('/offers/:productId/:offerId', async (req, res) => {
    const { productId, offerId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const offerIndex = product.offers.findIndex(offer => offer._id == offerId);
        if (offerIndex === -1) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        product.offers.splice(offerIndex, 1);
        await product.save();
        res.status(200).json({
            message: 'Offer deleted successfully',
            data: product.offers
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting offer',
            error: error.message
        });
    }
});

router.post('/offers/:productId/:offerId/reply', async (req, res) => {
    const { productId, offerId } = req.params;
    const reply = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const offerIndex = product.offers.findIndex(offer => offer._id == offerId);
        if (offerIndex === -1) {
            return res.status(404).json({ message: 'Offer not found' });
        }
        product.offers[offerIndex].replies.push(reply);
        await product.save();
        res.status(201).json({
            message: 'Reply added successfully',
            data: product.offers[offerIndex]
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding reply',
            error: error.message
        });
    }
});

module.exports = router;
