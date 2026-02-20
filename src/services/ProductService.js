const Product = require("../models/ProductModel")

const normalizeType = (type) => {
  if (!type) return type

  const normalized = type
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()

  return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}

const createProduct = async (newProduct) => {
  const { name, discount, type } = newProduct

  const checkProduct = await Product.findOne({ name })
  if (checkProduct) {
    return {
      status: 'ERR',
      message: 'The name of product is already'
    }
  }

  const createdProduct = await Product.create({
    ...newProduct,
    type: normalizeType(type),
    discount: Number(discount)
  })

  return {
    status: 'OK',
    message: 'SUCCESS',
    data: createdProduct
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

  if (data.type) {
    data.type = normalizeType(data.type)
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
        query.type = normalizeType(type)
      }

      let sortQuery = { createdAt: -1 }
      if (sort) {
        sortQuery = { [sort[1]]: sort[0] }
      }

      const totalProduct = await Product.countDocuments(query)

      const products = await Product.find(query)
        .limit(limit)
        .skip(page * limit)
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
            const allType = await Product.distinct('type')
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

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    deleteManyProduct,
    getAllType
}