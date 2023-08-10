import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode"

function Payment() {
  const state = useContext(GlobalState);
  const [oldSrc, setOldSrc] = useState("");
  const [src, setSrc] = useState("");
  const [oldScanResult, setOldScanResult] = useState("")
  const [scanResult, setScanResult] = useState("")
  const [openPayment, setOpenPayment] = useState(false)
  const [cart, setCart] = state.userAPI.cart;
  const [address, setAddress] = useState("")
  const [receiver, setReceiver] = useState("")
  const [phone, setPhone] = useState("")
  const [time, setTime] = useState("")
  const [balance, setBalance] = state.userAPI.balance;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  console.log(src);
  // console.log(total);
  const generateQRCode = async () => {
    try {
      const res = await axios.post('/api/paymentQR', { cart: [...cart], address, receiver, phone, time, total }, {
        headers: { Authorization: token }
      });
      setOldSrc(src)
      setSrc(res.data)
      alert("New QR Code was created.")
    } catch (err) {
      alert(err.response.data.msg)
    }
  }

  useEffect(() => {
    if (receiver !== "" && time !== "" && phone !== "" && address !== "") {
      const timer = setTimeout(() =>
        generateQRCode(), 1000)
      return () => clearTimeout(timer)
    } else {
      setOldSrc(src)
      setSrc("")
    }
  }, [cart, receiver, phone, address, time])


  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      // console.log(total);
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

  useEffect(() => {
    if (oldSrc !== src) {
      const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5
      })

      scanner.render(success, error);

      function success(result) {
        setOldScanResult(scanResult)
        setScanResult(result)
        setOldSrc(src)
        scanner.clear();
      }

      function error(err) {
        console.warn(err)
      }
    }
  }, [oldSrc, src])

  const generatePaymentId = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
  };

  const tranSuccess = async (payment) => {
    if (balance < total) {
      alert("Your balance is not available.")
    } else {
      var payment = JSON.parse(payment);
      const paymentID = payment.userId + '_' + generatePaymentId()
      const { address, cart, receiver, phone, time, total } = payment;
      console.log('test');
      await axios.post('/api/payment', { cart, paymentID, address, phone, time, receiver, total, balance }, {
        headers: { Authorization: token }
      })

      setCart([])
      addToCart([])
      alert("You have successfully placed an order.")
      window.location = '/history'
    }
  }

  useEffect(() => {
    if (openPayment) {
      if (oldSrc !== src) {
        setOpenPayment(false)
      }
    }
  }, [oldSrc, src, openPayment])


  useEffect(() => {
    if (oldScanResult !== scanResult) {
      setOpenPayment(true)
    } else {
      setOpenPayment(false)
    }

  }, [oldScanResult, scanResult])



  return (
    <div className="payment">
      <div className="field">
        <h3>ID</h3>
        <h3>Name</h3>
        <h3>Image</h3>
        <h3>Price</h3>
        <h3>Amount</h3>
        <h3>Total</h3>
      </div>
      {cart.map((product, i) => (
        <div className="items" key={i + 1}>
          <h3>#{i + 1}</h3>
          <h3>{product.title}</h3>
          {/* <img src={product.images.url} alt="" /> */}
          <img src={product.images.url} alt="" className="item_img" />
          <h3>{product.price}</h3>
          <h3>{product.quantity}</h3>
          <h3>{product.price * product.quantity}</h3>
          <button onClick={() => increment(product._id)}>Incr</button>
          <button onClick={() => decrement(product._id)}>Decr</button>
          <button onClick={() => removeProduct(product._id)}>Delete</button>
        </div>
      ))}
      <div className="info_receiver">
        <input type="text" name="name" id="" placeholder="Name. Exp: David" onChange={(e) => setReceiver(e.target.value)} />
        <input type="text" name="address" id="" placeholder="Address. Exp: Ha Noi" onChange={(e) => setAddress(e.target.value)} />
        <input type="text" name="phoneNumber" id="" placeholder="Phone Number. Exp: 0912345678" onChange={(e) => setPhone(e.target.value)} />
        <input type="text" name="time" id="" placeholder="Time available to receive. Exp: 12:00" onChange={(e) => setTime(e.target.value)} />
      </div>
      <div className="payment_footer">
        <div className="payment_footer_left">
          <h2>Account Balance: {balance} $</h2>
          {openPayment && <button onClick={() => tranSuccess(scanResult)}>Pay by QR Code</button>}
        </div>
        <div className="payment_footer_right">
          <h3>Total: {total} $</h3>
        </div>
      </div>
      {(total !== 0 && (receiver !== "" && time !== "" && phone !== "" && address !== "")) ? (
        <div className="generateQRCode">
          <img src={src} width={300} height={300} alt="qrCode" />

        </div>
      )
        : ""}
      <div id="reader"></div>
    </div>
  );
}

export default Payment;
