import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";

function Balance() {
  const state = useContext(GlobalState);
  const [balance, setBalance] = state.userAPI.balance;
  const [amount, setAmount] = useState(0)
  const addBalance = state.userAPI.addBalance
  const [token] = state.token;


  return (
    <div>
      <h2>Balance: {balance}</h2>
      <div>
        <h3>Add Balance</h3>
        <input type="number" name="" id="" min={1} onChange={(e)=> setAmount(e.target.value)}/>
        <button onClick={() => addBalance(Number(amount))}>Add</button>
      </div>
    </div>
  );
}

export default Balance;
