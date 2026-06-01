const express = require('express');
const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createOrder
} = require('../controllers/productController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/products', listProducts);
router.post('/products', verifyToken, authorizeRoles('admin'), createProduct);
router.put('/products/:id', verifyToken, authorizeRoles('admin'), updateProduct);
router.delete('/products/:id', verifyToken, authorizeRoles('admin'), deleteProduct);
// Orders should be created by regular users only; admins manage products but do not place orders
router.post('/orders', verifyToken, authorizeRoles('user'), createOrder);

module.exports = router;
