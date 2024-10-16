import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const HotelDashboard = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', quantity: '' });

  // Fetch food items from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const data = await firestore.collection('foodItems').get();
      setFoodItems(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  // Add new food item
  const addFoodItem = async () => {
    await firestore.collection('foodItems').add(newItem);
    setNewItem({ name: '', price: '', quantity: '' });
  };

  return (
    <div>
      <h2>Manage Food Inventory</h2>
      <input type="text" placeholder="Food Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
      <input type="text" placeholder="Price" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
      <input type="text" placeholder="Quantity" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
      <button onClick={addFoodItem}>Add Item</button>

      <h3>Current Food Items</h3>
      <ul>
        {foodItems.map(item => (
          <li key={item.id}>
            {item.name} - {item.price} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelDashboard;


import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';

const HotelDashboard = () => {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const fetchBids = async () => {
      const data = await firestore.collection('bids').where('status', '==', 'pending').get();
      setBids(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchBids();
  }, []);

  const acceptBid = async (bid) => {
    await firestore.collection('bids').doc(bid.id).update({ status: 'accepted' });
    console.log('Bid accepted for', bid.foodItemId);
  };

  const rejectBid = async (bid) => {
    await firestore.collection('bids').doc(bid.id).update({ status: 'rejected' });
    console.log('Bid rejected for', bid.foodItemId);
  };

  return (
    <div>
      <h2>Manage Bids</h2>
      <ul>
        {bids.map(bid => (
          <li key={bid.id}>
            Bid for Food Item ID: {bid.foodItemId} - Proposed Price: {bid.proposedPrice}
            <button onClick={() => acceptBid(bid)}>Accept</button>
            <button onClick={() => rejectBid(bid)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelDashboard;

