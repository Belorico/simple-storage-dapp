import React, { useState } from 'react';
import { ethers } from 'ethers';
import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json';

const simpleStorageAddress = 'DEPLOYED_CONTRACT_ADDRESS';

function App() {
  const [number, setNumber] = useState(0);
  const [newNumber, setNewNumber] = useState('');

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  async function fetchNumber() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(simpleStorageAddress, SimpleStorage.abi, provider);
      try {
        const data = await contract.getNumber();
        setNumber(data.toString());
      } catch (err) {
        console.error("Error:", err);
      }
    }
  }

  async function setStoredNumber() {
    if (!newNumber) return;
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(simpleStorageAddress, SimpleStorage.abi, signer);
      const transaction = await contract.setNumber(newNumber);
      await transaction.wait();
      fetchNumber();
    }
  }

  return (
    <div>
      <h1>Simple Storage DApp</h1>
      <p>Stored Number: {number}</p>
      <button onClick={fetchNumber}>Fetch Number</button>
      <input
        onChange={e => setNewNumber(e.target.value)}
        placeholder="Enter new number"
      />
      <button onClick={setStoredNumber}>Set New Number</button>
    </div>
  );
}

export default App;
