const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder
        try {
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `San pham voi id: ${arrId.join(',')} khong du hang`
                })
            } else {
                const createdOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city, phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid, paidAt
                })
                if (createdOrder) {
                    resolve({
                        status: 'OK',
                        message: 'success'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.find({
                user: id
            }).sort({ createdAt: -1, updatedAt: -1 })
            if (!order || order.length === 0) {
                return resolve({
                    status: 'ERR',
                    message: 'No orders found'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById({
                _id: id
            })
            if (!order) {
                return resolve({
                    status: 'ERR',
                    message: 'Order not found'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = async (orderId, orderItems) => {
  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return {
        status: 'ERR',
        message: 'Đơn hàng không tồn tại'
      }
    }
    if (order.status === 'DELIVERED') {
        return {
            status: 'ERR',
            message: 'Đơn hàng đã giao, không thể hủy'
        }
    }
    const promises = orderItems.map(async (item) => {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: {
            countInStock: item.amount,
            selled: -item.amount
          }
        }
      )
    })
    await Promise.all(promises)
    order.status = 'CANCELLED'
    order.cancelAt = new Date()
    await order.save()
    return {
      status: 'OK',
      message: 'Hủy đơn thành công',
      data: order
    }
  } catch (e) {
    throw e
  }
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateOrderStatus = async (id, data) => {
    try {
        const order = await Order.findById(id)
    if (!order) {
        return {
            status: 'ERR',
            message: 'Order not found'
        }
    }
    if (data.isPaid !== undefined) {
        order.isPaid = data.isPaid
        order.paidAt = data.isPaid ? new Date() : null
    }
    if (data.status) {
        order.status = data.status
        if (data.status === 'DELIVERED') {
            order.deliveredAt = new Date()
        }
        if (data.status === 'CANCELLED') {
            order.cancelAt = new Date()
        }
    }
    await order.save()
    return {
        status: 'OK',
        message: 'SUCCESS',
        data: order
    }
        } catch (e) {
            throw e
        }
    }

const refundOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
    if (!order) {
      return { status: 'ERR', message: 'Không tìm thấy đơn hàng' }
    }
    if (order.refunded) {
      return { status: 'ERR', message: 'Đơn đã được hoàn tiền' }
    }
    if (!order.isPaid) {
      return { status: 'ERR', message: 'Đơn chưa thanh toán' }
    }
    if (order.status !== 'CANCELLED') {
      return { status: 'ERR', message: 'Chỉ hoàn tiền khi đơn đã hủy' }
    }
    order.refunded = true
    order.refundedAt = new Date()
    order.isPaid = false
    await order.save()
    return {
      status: 'OK',
      message: 'Hoàn tiền thành công',
      data: order
    }
  } catch (e) {
    throw e
  }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus,
    refundOrder
}