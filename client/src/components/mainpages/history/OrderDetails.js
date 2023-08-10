import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'

function OrderDetails() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    console.log(history);
    const [orderDetails, setOrderDetails] = useState([])

    const params = useParams()

    useEffect(() => {
        if(params.id){
            history.forEach(item =>{
                if(item._id === params.id) setOrderDetails(item)
            })
        }
    },[params.id, history])


    if(orderDetails.length === 0) return null;

    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Address</th>
                        <th>Time available to receive</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetails.name}</td>
                        <td>{orderDetails.phone}</td>
                        <td>{orderDetails.address}</td>
                        <td>{orderDetails.time}</td>
                        <td>{orderDetails.status ? "Waiting" : "Delivered"}</td>
                    </tr>
                </tbody>
            </table>

            <table style={{margin: "30px 0px"}}>
                <thead>
                    <tr>
                        <th>#ID</th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetails.cart.map((item,i) =>(
                        <tr key={i}>
                            <td>{i+1}</td>
                            <td><img src={item.url} alt="" /></td>
                            <td>{item.quantity}</td>
                            <td>{item.price} $</td>
                            <td>{item.price * item.quantity} $</td>
                        </tr>
                        ))
                    }
                    
                </tbody>
            </table>
            <div className='footer'>
                <h2>Total: {orderDetails.total} $</h2>
            </div>
        </div>
    )
}

export default OrderDetails
