const Product = require('../models/ProductModel')

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject)=>{
        const {name, image, type, countInStock, price, rating, description} = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })            
            if(checkProduct !== null){
                return resolve({
                    status:'OK',
                    message:'The name of product is already'
                })
            }
            const newProduct = await Product.create({
                name,
                image,
                type,
                countInStock,
                price,
                rating,
                description
            })
            if (newProduct) {
                return resolve({
                    status:'OK',
                    message:'SUCCESS',
                    data: newProduct
                })
            }
        } catch(e) {
            reject(e)
        }
    })
}

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct===null){
                return resolve({
                    status:'OK',
                    message:'The product is not defined'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, data, {new:true})
            return resolve({
                status:'OK',
                message:'SUCCESS',
                data: updatedProduct
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getDetailsProduct = (id) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const product = await Product.findOne({
                _id: id
            })
            if(product === null){
                return resolve({
                    status:'OK',
                    message:'The product is not defined'
                })
            }
            return resolve({
                status:'OK',
                message:'Success',
                data: product
            })
        } catch(e) {
            reject(e)
        }
    })
}

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const checkProduct = await Product.findOne({
                _id: id
            })
            if(checkProduct===null){
                return resolve({
                    status:'OK',
                    message:'The product is not defined'
                })
            }
            await Product.findByIdAndDelete(id)
            return resolve({
                status:'OK',
                message:'Delete product success'
            })
        } catch(e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const totalProduct = await Product.countDocuments()

            if (filter) {
                const label = filter[0]
                const allObjectFilter = await Product.find({[label]: {'$regex': filter[1]}}).limit(limit).skip((page-1)*limit)
                return resolve({
                    status:'OK',
                    message:'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalProduct/limit)
                })
            }

            if (sort) {
                const objectSort =  {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip((page-1)*limit).sort(objectSort)
                return resolve({
                    status:'OK',
                    message:'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page),
                    totalPage: Math.ceil(totalProduct/limit)
                })
            }

            const allProduct = await Product.find().limit(limit).skip((page-1)*limit)

            return resolve({
                status:'OK',
                message:'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page),
                totalPage: Math.ceil(totalProduct/limit)
            })
        } catch(e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct
}