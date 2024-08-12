const express = require('express');
const router = express.Router();
const Product = require('../models/ecommerce.models');
const authMiddleware = require('../middleware/auth');

// Product Listing (POST/GET/DELETE/UPDATE)
router.post('/listProduct',authMiddleware, async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        // Ensure required fields are provided
        if (!name || !description || !price || !category) {
            return res.status(400).json({ message: "All product details are required." });
        }

        // Get the user ID from the session
        const createdBy = req.session.userId; // Assuming _id is stored in session

        // Validate if the user ID is available in the session
        if (!createdBy) {
            return res.status(403).json({ message: "Unauthorized. No user found in session." });
        }

        // Create a new product
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            createdBy
        });

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

router.get('/listProduct', authMiddleware,async (req, res) => {
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

router.put('/listProduct/:id',authMiddleware, async (req, res) => {
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

router.delete('/listProduct/:id',authMiddleware, async (req, res) => {
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

// Feedback (POST/GET/DELETE)
router.post('/feedback/:productId',authMiddleware, async (req, res) => {
    const productId = req.params.productId;
    const { comment, rating } = req.body;

    try {
        // Ensure required fields are provided
        if (!comment || rating === undefined) {
            return res.status(400).json({ message: "Comment and rating are required." });
        }

        // Get the user ID from the session
        const user = req.session.userId; // Assuming _id is stored in session

        // Validate if the user ID is available in the session
        if (!user) {
            return res.status(403).json({ message: "Unauthorized. No user found in session." });
        }

        // Find the product and add feedback
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const feedback = {
            user,
            comment,
            rating
        };

        product.feedback.push(feedback);
        await product.save();

        res.status(201).json({
            message: 'Feedback added successfully',
            data: product.feedback
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding feedback',
            error: error.message
        });
    }
});

router.get('/feedback/:productId',authMiddleware, async (req, res) => {
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

router.delete('/feedback/:productId/:feedbackId',authMiddleware, async (req, res) => {
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

// Offers (POST/GET/DELETE/REPLY)
router.get('/offers/:productId',authMiddleware, async (req, res) => {
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

router.post('/offers/:productId',authMiddleware, async (req, res) => {
    const productId = req.params.productId;
    const { description, discount, validUntil } = req.body;

    try {
        // Ensure required fields are provided
        if (!description || !discount || !validUntil) {
            return res.status(400).json({ message: "Description, discount, and validUntil are required." });
        }

        // Get the user ID from the session
        const user = req.session.userId; // Assuming _id is stored in session

        // Validate if the user ID is available in the session
        if (!user) {
            return res.status(403).json({ message: "Unauthorized. No user found in session." });
        }

        // Find the product and add offer
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const offer = {
            user,
            description,
            discount,
            validUntil
        };

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

router.delete('/offers/:productId/:offerId',authMiddleware, async (req, res) => {
    const { productId, offerId } = req.params;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const offerIndex = product.offers.findIndex(off => off._id == offerId);
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

router.post('/offers/:productId/:offerId/reply',authMiddleware, async (req, res) => {
    const { productId, offerId } = req.params;
    const { comment } = req.body;

    try {
        // Ensure required fields are provided
        if (!comment) {
            return res.status(400).json({ message: "Comment is required." });
        }

        // Get the user ID from the session
        const user = req.session.userId; // Assuming _id is stored in session

        // Validate if the user ID is available in the session
        if (!user) {
            return res.status(403).json({ message: "Unauthorized. No user found in session." });
        }

        // Find the product and offer, and add reply
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const offer = product.offers.id(offerId);
        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        const reply = {
            user,
            comment
        };

        offer.replies.push(reply);
        await product.save();

        res.status(201).json({
            message: 'Reply added successfully',
            data: offer.replies
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding reply',
            error: error.message
        });
    }
});

module.exports = router;