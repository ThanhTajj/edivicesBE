const Order = require('../models/OrderProduct')
const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data = req.body.orderItems
        const orderId = req.body.orderId
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id
    const { status, isPaid } = req.body

    if (!orderId) {
      return res.status(200).json({
        status: 'ERR',
        message: 'The orderId is required'
      })
    }

    const response = await OrderService.updateOrderStatus(orderId, {
      status,
      isPaid
    })

    return res.status(200).json(response)
  } catch (e) {
    return res.status(404).json({
      message: e
    })
  }
}

const refundOrder = async (req, res) => {
  try {
    const orderId = req.params.id

    if (!orderId) {
      return res.status(400).json({
        status: 'ERR',
        message: 'The orderId is required'
      })
    }

    const response = await OrderService.refundOrder(orderId)

    return res.status(200).json(response)

  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

const deleteManyOrder = async (req, res) => {
  try {
    const ids = req.body.ids

    await Order.deleteMany({ _id: { $in: ids } })

    return res.status(200).json({
      status: 'OK',
      message: 'Xóa nhiều đơn hàng thành công'
    })
  } catch (e) {
    return res.status(500).json({
      status: 'ERR',
      message: e.message
    })
  }
}

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus,
    refundOrder,
    deleteManyOrder
}
