const ProductService = require('../services/ProductService')
const Product = require('../models/ProductModel')
const ProductType = require('../models/ProductTypeModel')
const Setting = require('../models/SettingModel')

const createProduct = async (req, res) => {
    try {
        const { name, image, type, countInStock, price, rating, description, discount } = req.body
        if (
            !name ||
            !image ||
            !type ||
            countInStock === undefined ||
            price === undefined ||
            rating === undefined ||
            discount === undefined
        ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const data = req.body
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.updateProduct(productId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.getDetailsProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }
        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter, type } = req.query
        const limitNumber = Number(limit)
        const pageNumber = Number(page)
        const response = await ProductService.getAllProduct(
            limitNumber,
            pageNumber,
            sort,
            filter,
            type
        )
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const rateProduct = async (req, res) => {
  try {
    const userId = req.user.id
    const productId = req.params.id
    const { rating, comment } = req.body

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        status: 'ERR',
        message: 'Product not found'
      })
    }

    const existing = product.ratedUsers.find(
        r => r.user.equals(userId)
    )

    if (existing) {
      product.ratingSum = product.ratingSum - existing.rating + rating

      existing.rating = rating
      existing.comment = comment
      existing.updatedAt = new Date()
    } else {
      product.ratedUsers.push({
        user: userId,
        rating,
        comment
      })

      product.ratingSum += rating
      product.ratingCount += 1
    }

    product.rating =
      product.ratingCount === 0
        ? 0
        : product.ratingSum / product.ratingCount

    await product.save()

    return res.json({
      status: 'OK',
      message: 'Rated successfully'
    })

  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

const searchProduct = async (req, res) => {
  try {
    const { keyword, page = 0, limit = 10 } = req.query

    const query = {
      name: { $regex: keyword, $options: 'i' }
    }

    const total = await Product.countDocuments(query)

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip(Number(page) * Number(limit))

    res.json({
      status: 'OK',
      message: 'Success',
      data: products,
      total,
      pageCurrent: Number(page) + 1,
      totalPage: Math.ceil(total / limit)
    })
  } catch (e) {
    res.status(500).json({ status: 'ERR', message: e.message })
  }
}

const deleteReview = async (req,res)=>{
  const userId = req.user.id
  const productId = req.params.id

  const product = await Product.findById(productId)

  const index = product.ratedUsers.findIndex(
    r => r.user.equals(userId)
  )

  if(index === -1){
      return res.json({status:'ERR', message:'Review not found'})
  }

  const removed = product.ratedUsers[index]

  product.ratingSum -= removed.rating
  product.ratingCount -= 1

  product.ratedUsers.splice(index,1)

  product.rating =
    product.ratingCount === 0
      ? 0
      : product.ratingSum / product.ratingCount

  await product.save()

  res.json({status:'OK'})
}

const createProductType = async (req, res) => {
  try {
    const response = await ProductService.createProductType(req.body)
    return res.status(200).json(response)
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

const getAllTypeProduct = async (req, res) => {
  try {
    const { sort } = req.query

    let sortQuery = { order: 1 }

    switch (sort) {
      case 'manual':
        sortQuery = { order: 1, type: 1 }
        break
      case 'newest':
        sortQuery = { createdAt: -1 }
        break
      case 'oldest':
        sortQuery = { createdAt: 1 }
        break
      case 'az':
        sortQuery = { type: 1 }
        break
      case 'za':
        sortQuery = { type: -1 }
        break
      default:
        sortQuery = { order: 1, type: 1 }
    }

    const types = await ProductType.find()
      .sort(sortQuery)
      .collation({ locale: 'vi', strength: 1 })

    return res.json({
      status: 'OK',
      data: types
    })

  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

const updateProductType = async (req, res) => {
  try {
    const id = req.params.id
    const updated = await ProductType.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )
    return res.json({
      status: 'OK',
      data: updated
    })
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

const deleteProductType = async (req,res) => {
  const id = req.params.id

  const productCount = await Product.countDocuments({ type:id })

  if(productCount > 0){
    return res.status(400).json({
      status:"ERR",
      message:"Type đang được sử dụng"
    })
  }

  await ProductType.findByIdAndDelete(id)

  return res.json({
    status:"OK",
    message:"Delete success"
  })
}

const updateTypeSortSetting = async (req, res) => {
  try {
    const { value } = req.body

    await Setting.findOneAndUpdate(
      { key: 'typeSort' },
      { value },
      { upsert: true, new: true }
    )

    return res.json({ status: 'OK' })
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

const getTypeSortSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'typeSort' })

    return res.json({
      status: 'OK',
      value: setting?.value || 'manual'
    })
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteMany,
    getAllType,
    createProductType,
    rateProduct,
    searchProduct,
    deleteReview,
    getAllTypeProduct,
    deleteProductType,
    updateProductType,
    updateTypeSortSetting,
    getTypeSortSetting
}


