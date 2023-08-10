import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Empty_cart from "./empty_cart.jpg";
import { Link } from "react-router-dom";
import {AiFillCloseCircle, AiOutlineMinus} from 'react-icons/ai'
import {BsPlusLg} from 'react-icons/bs'

function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);


  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);

      setTotal(total);
    };

    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addCart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });

    setCart([...cart]);
    addToCart(cart);
  };

  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });

      setCart([...cart]);
      addToCart(cart);
    }
  };



  if (cart.length === 0)
    return (
      <div class="cart-empty">
        <div class="empty-cart">
          <h2>Your Cart Is Currently Empty!</h2>
          <p> Looks like you have not made your choice yet.</p>
        </div>
        <img src={Empty_cart} alt="Empty Cart" />

        <div>
          <Link className="goto_hp" to="/">
            Shop Now
          </Link>
        </div>
      </div>
    );
  return (
    <div>
      {cart.map((product) => (
        <div className="detail cart" key={product._id}>
          <img src={product.images.url} alt="" />

          <div className="box-detail">
            <h2>Name: {product.title}</h2>

            <h3>Price: $ {product.price}</h3>
            <h3>Total: $ {product.price * product.quantity}</h3>
            <p className="description">Description: {product.description}</p>
            <p className="description">Content: {product.content}</p>

            <div className="amount">
              <button onClick={() => decrement(product._id)}> <AiOutlineMinus/> </button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}> <BsPlusLg/> </button>
            </div>

            <div className="delete" onClick={() => removeProduct(product._id)}>
              <AiFillCloseCircle />
            </div>
          </div>
        </div>
      ))}

      <div className="payment_btn">
        <Link to={"/payment"}><button>Go to payment</button></Link>
      </div>
    </div>
  );
}

export default Cart;
