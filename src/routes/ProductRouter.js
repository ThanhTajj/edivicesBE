const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/ProductController');
const { authMiddleWare, authUser } = require("../middleware/authMiddleware");

router.post('/create', ProductController.createProduct)
router.post('/rate/:id', authUser, ProductController.rateProduct)
router.put('/update/:id', authMiddleWare, ProductController.updateProduct)
router.delete('/review/:id', authUser, ProductController.deleteReview)
router.get('/get-details/:id', ProductController.getDetailsProduct)
router.delete('/delete/:id', authMiddleWare, ProductController.deleteProduct)
router.get('/get-all', ProductController.getAllProduct)
router.post('/delete-many', authMiddleWare, ProductController.deleteMany)
router.get('/get-all-type', ProductController.getAllTypeProduct)
router.get('/search', ProductController.searchProduct)
router.post('/create-type', ProductController.createProductType)
router.delete('/delete-type/:id', ProductController.deleteProductType)
router.put('/update-type/:id', ProductController.updateProductType)
router.put('/type-sort-setting', ProductController.updateTypeSortSetting)
router.get('/type-sort-setting', ProductController.getTypeSortSetting)

module.exports = router