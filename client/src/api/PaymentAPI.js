import { useState, useEffect } from 'react'
import axios from 'axios'

function PaymentAPI(token) {
    const [dataQRCode, setDataQRCode] = useState("")
    useEffect(() => {


        const generateQRCode = async () => {
            try {
                const res = await axios.get('/api/paymentQR', {
                    headers: {Authorization: token}
                })
                console.log(res.data);
                setDataQRCode(res.data.src)
            } catch (error) {
                alert(error.response.data.msg)
            }
        }
        generateQRCode()
    },[token])


    return {
        dataQRCode: [dataQRCode, setDataQRCode]
    }

}

export default PaymentAPI