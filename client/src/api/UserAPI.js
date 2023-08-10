import {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [balance, setBalance] = useState(0)
    const [history, setHistory] = useState([])

    useEffect(() =>{
        if(token){
            const getUser = async () =>{
                try {
                    const res = await axios.get('/user/infor', {
                        headers: {Authorization: token}
                    })
                    
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)

                    setBalance(res.data.balance)

                } catch (err) {
                    alert(err.response.data.msg)
                }
            }

            getUser()
            
        }
    },[token])



    

    const addCart = async (product) => {
        if(!isLogged) 
        return (
            alert("Please login to continue buying")
            )

        const check = cart.every(item =>{
            return item._id !== product._id
        })

        if(check){
            setCart([...cart, {...product, quantity: 1}])

            await axios.patch('/user/addCart', {cart: [...cart, {...product, quantity: 1}]}, {
                headers: {Authorization: token}
            })

        }else{
            alert("This product has been added to cart.")
        }
    }

    const addBalance = async (amount) => {
        if(!isLogged) 
        return (
            alert("Please login to continue buying")
        )

        const check = balance
        if(check){
            const total = check + amount
            setBalance(total)

            await axios.patch('/user/addBalance', {balance: total}, {
                headers: {Authorization: token}
            })

        }else{
            alert("This product has been added to cart.")
        }
    }

    // const generateQRCode

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        balance: [balance, setBalance],
        addCart: addCart,
        history: [history.reverse(), setHistory],
        addBalance: addBalance
    }
}

export default UserAPI
 