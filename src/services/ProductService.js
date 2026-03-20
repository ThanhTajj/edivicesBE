const Product = require("../models/ProductModel")
const ProductType = require('../models/ProductTypeModel')

const normalizeType = (type) => {
  if (!type) return type

  const normalized = type
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const createProduct = async (newProduct) => {
  try {
    const { name, discount, type } = newProduct

    if (!name) {
      return {
        status: 'ERR',
        message: 'Name is required'
      }
    }

    const normalizedName = name.trim()

    const checkProduct = await Product.findOne({
      name: { $regex: `^${normalizedName}$`, $options: 'i' }
    })

    if (checkProduct) {
      return {
        status: 'ERR',
        message: 'Sản phẩm đã tồn tại'
      }
    }

    const normalizedType = normalizeType(type)

    let typeDoc = await ProductType.findOne({ type: normalizedType })

    if (!typeDoc) {
      typeDoc = await ProductType.create({ type: normalizedType })
    }

    const createdProduct = await Product.create({
      ...newProduct,
      name: normalizedName,
      type: typeDoc._id,
      discount: Number(discount)
    })

    return {
      status: 'OK',
      message: 'SUCCESS',
      data: createdProduct
    }

  } catch (error) {
    return {
      status: 'ERR',
      message: error.message
    }
  }
}

const updateProduct = async (id, data) => {
  const checkProduct = await Product.findById(id)
  if (!checkProduct) {
    return {
      status: 'ERR',
      message: 'The product is not defined'
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    data,
    { new: true }
  )

  return {
    status: 'OK',
    message: 'SUCCESS',
    data: updatedProduct
  }
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not defined'
                })
            }

            await Product.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id)
        .populate('type', 'type')
        .populate('ratedUsers.user', 'name avatar')
      if (!product) {
        return resolve({
          status: 'ERR',
          message: 'The product is not defined'
        })
      }
      product.ratedUsers.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) -
          new Date(a.updatedAt || a.createdAt)
      )
      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: product
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllProduct = (limit, page, sort, filter, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {}

      if (filter) {
        query.name = { $regex: filter, $options: 'i' }
      }

      if (type) {
        const normalizedType = normalizeType(type)

        const typeDoc = await ProductType.findOne({
          type: normalizedType
        })

        if (typeDoc) {
          query.type = typeDoc._id
        }
      }

      let sortQuery = { createdAt: 1 }
      if (sort) {
        sortQuery = { [sort[1]]: sort[0] }
      }

      const totalProduct = await Product.countDocuments(query)

      const skip = page ? page * limit : 0

      const products = await Product.find(query)
        .populate('type', 'type')
        .limit(limit)
        .skip(skip)
        .sort(sortQuery)

      resolve({
        status: 'OK',
        message: 'Success',
        data: products,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: limit ? Math.ceil(totalProduct / limit) : 1
      })
    } catch (e) {
      reject(e)
    }
  })
}

const getAllType = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allType = await ProductType.find().select('type')
            resolve({
                status: 'OK',
                message: 'Success',
                data: allType,
            })
        } catch (e) {
            reject(e)
        }
    })
}

const createProductType = async (data) => {
  try {
    const { type } = data
    const normalizedType = normalizeType(type)

    const lastType = await ProductType.findOne().sort({ order: -1 })

    const newOrder = lastType ? lastType.order + 1 : 1

    const newType = await ProductType.create({
      type: normalizedType,
      order: newOrder
    })

    return {
      status: 'OK',
      data: newType
    }
  } catch (e) {
    return {
      status: 'ERR',
      message: e.message
    }
  }
}

const getAllTypeProduct = async () => {
  try {
    const types = await ProductType.find().sort({ order: 1 })
    return {
      status: 'OK',
      data: types
    }
  } catch (e) {
    return {
      status: 'ERR',
      message: e.message
    }
  }
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType,
    createProductType,
    getAllTypeProduct
}