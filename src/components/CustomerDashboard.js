import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const CustomerDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);

  // Fetch food items from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const data = await firestore.collection('foodItems').get();
      setFoodItems(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const placeOrder = async (item) => {
    // Add logic to place the order and update stock
  };

  return (
    <div>
      <h2>Available Food</h2>
      <ul>
        {foodItems.map(item => (
          <li key={item.id}>
            {item.name} - {item.price} - {item.quantity}
            <button onClick={() => placeOrder(item)}>Order</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDashboard;

import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const CustomerDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [bidPrice, setBidPrice] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await firestore.collection('foodItems').get();
      setFoodItems(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const placeBid = async (item) => {
    const bid = {
      foodItemId: item.id,
      customerId: 'currentCustomerId', // Replace with authenticated user ID
      proposedPrice: bidPrice,
      status: 'pending',
    };
    await firestore.collection('bids').add(bid);
    console.log('Bid placed for', item.name, 'at', bidPrice);
  };

  return (
    <div>
      <h2>Available Food</h2>
      <ul>
        {foodItems.map(item => (
          <li key={item.id}>
            {item.name} - {item.price} - {item.quantity}
            <input type="number" placeholder="Your Bid" onChange={e => setBidPrice(e.target.value)} />
            <button onClick={() => placeBid(item)}>Place Bid</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDashboard;
