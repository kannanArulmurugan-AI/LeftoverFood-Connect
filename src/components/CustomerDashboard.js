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
  const placeOrder = async (item, bidPrice) => {
    // Reduce stock by 1 for simplicity
    const updatedStock = item.quantity - 1;
    await firestore.collection('foodItems').doc(item.id).update({ quantity: updatedStock });
  
    // Log the order in the orders collection
    await firestore.collection('orders').add({
      foodItemId: item.id,
      customerId: 'currentCustomerId', // Replace with authenticated user ID
      price: bidPrice,
      status: 'confirmed',
    });
  
    console.log('Order placed and stock updated for', item.name);
  };
  
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


// Geolocation Feature (Optional)
// Steps to Add Geolocation:

    // Get User’s Current Location: Use the browser's built-in geolocation API to get the customer's or hotel owner's location.
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('User location:', position.coords);
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }, []);
    // Display Map and Nearby Hotels
    import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const MapComponent = ({ userLocation, hotels }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      center={userLocation}
      zoom={12}
      mapContainerStyle={{ width: '100%', height: '400px' }}
    >
      <Marker position={userLocation} label="You" />
      {hotels.map((hotel) => (
        <Marker key={hotel.id} position={hotel.location} label={hotel.name} />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;

// Distance Calculation (Haversine formula):
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 - Math.cos(dLat) / 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * (1 - Math.cos(dLon)) / 2;
  return R * 2 * Math.asin(Math.sqrt(a));
};

const nearbyHotels = hotels.filter((hotel) => calculateDistance(userLat, userLng, hotel.location.lat, hotel.location.lng) < 10); // 10km radius

//Responsive Design and Mobile Optimization

// Ensure the app is fully responsive and works well on both desktop and mobile devices.
<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  <div className="md:flex">
    <div className="md:flex-shrink-0">
      <img className="h-48 w-full object-cover md:w-48" src="/food.jpg" alt="Food Image" />
    </div>
    <div className="p-8">
      <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Food Item</h1>
      <p className="mt-2 text-gray-500">Price: $5</p>
    </div>
  </div>
</div>
