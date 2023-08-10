const Payments = require('../models/paymentModel')
const Users = require('../models/userModel')
const Products = require('../models/productModel')
const QRCode = require('qrcode')

const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createPayment: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if (!user) return res.status(400).json({ msg: "User does not exist." })
            const { cart, paymentID, address, phone, time, receiver, total, balance } = req.body;

            const { _id, email } = user;
            if (balance < total) {
                res.status(400).json({ msg: "Balance is not available." })
            } else {
                const newPayment = new Payments({
                    user_id: _id, name: receiver, email, cart, paymentID, address, phone, time, total, status: true
                })

                cart.filter(item => {
                    return sold(item.idProduct, item.quantity, item.sold)
                })

                await newPayment.save()
                updateBalance(req.user.id, balance, total)
                res.json({ msg: "Payment Success!" })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    generateQRCode: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email')
            if (!user) return res.status(400).json({ msg: "User does not exist." })
            const { cart, address, receiver, phone, time, total } = req.body;
            const newCart = cart.map((el, i) => (
                {
                    "id": i + 1,
                    "idProduct": el._id,
                    "name": el.title,
                    "price": el.price,
                    "quantity": el.quantity,
                    "sold": el.sold,
                    "url": el.images.url
                }
            ))
            const { _id } = user;

            const dataQRCode = JSON.stringify({ userId: _id, receiver, cart: newCart, address, phone, time, total })
            const src = await QRCode.toDataURL(dataQRCode)

            res.json(src)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
}

const sold = async (id, quantity, oldSold) => {
    try {
        await Products.findOneAndUpdate({ _id: id }, {
            sold: quantity + oldSold
        })
    } catch (error) {
        console.log(error);
    }
}

const updateBalance = async (id, balance, total) => {
    try {
        await Users.findOneAndUpdate({ _id: id }, {
            balance: balance - total
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = paymentCtrl
