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

const getAllProduct = () => {
    return new Promise(async (resolve, reject)=>{
        try {
            const allProduct = await Product.find()
            return resolve({
                status:'OK',
                message:'Success',
                data: allProduct
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