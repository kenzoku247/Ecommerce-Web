const router = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get('/payment',auth, authAdmin, paymentCtrl.getPayments)
router.post('/payment', auth, paymentCtrl.createPayment)
router.post('/paymentQR', auth,  paymentCtrl.generateQRCode)


module.exports = router


