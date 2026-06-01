const Product = require('../models/Product');

const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ data: products });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, isActive } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      isActive
    });

    return res.status(201).json({ data: product });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create product' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ data: product });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete product' });
  }
};

const createOrder = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ error: 'Product not available' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    product.stock -= quantity;
    await product.save();

    return res.status(201).json({
      message: 'Order placed (placeholder)',
      order: {
        productId: product._id,
        quantity,
        userId: req.user.userId
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

module.exports = {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder
};
