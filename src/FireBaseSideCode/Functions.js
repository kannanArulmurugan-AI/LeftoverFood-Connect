// Firebase Functions (payment processing):

const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe.secret_key); // Use your secret key here

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
  try {
    const { amount, id } = req.body;
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: id,
      confirm: true,
    });
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send({ error: 'Payment failed' });
  }
});
 

// ************************************************************************

// Enhancing Security (Firebase Rules)
service cloud.firestore {
    match /databases/{database}/documents {
      // Rules for authenticated users
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
  
      // Allow customers to only read food items and place orders
      match /foodItems/{foodItem} {
        allow read: if request.auth != null;
        allow write: if request.auth.token.role == 'hotel';
      }
  
      // Customers can create bids, but hotel owners can update them
      match /bids/{bidId} {
        allow create: if request.auth.token.role == 'customer';
        allow update: if request.auth.token.role == 'hotel';
      }
  
      // Orders can only be created by customers and read by hotels
      match /orders/{orderId} {
        allow create: if request.auth.token.role == 'customer';
        allow read: if request.auth.token.role == 'hotel';
      }
    }
  }
// ***********************************************************************************
service cloud.firestore {
    match /databases/{database}/documents {
      // Rules for authenticated users
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
  
      // Allow customers to only read food items and place orders
      match /foodItems/{foodItem} {
        allow read: if request.auth != null;
        allow write: if request.auth.token.role == 'hotel';
      }
  
      // Customers can create bids, but hotel owners can update them
      match /bids/{bidId} {
        allow create: if request.auth.token.role == 'customer';
        allow update: if request.auth.token.role == 'hotel';
      }
  
      // Orders can only be created by customers and read by hotels
      match /orders/{orderId} {
        allow create: if request.auth.token.role == 'customer';
        allow read: if request.auth.token.role == 'hotel';
      }
    }
  }
// **********************************************************************
// Setting Custom Claims:
const admin = require('firebase-admin');
admin.initializeApp();

exports.setCustomUserClaims = functions.https.onCall(async (data, context) => {
  if (context.auth.token.role !== 'admin') {
    return { error: 'Unauthorized' };
  }
  return admin.auth().setCustomUserClaims(data.uid, { role: data.role });
});
// *****************************************************************************
// Usage (with a Button):
import React from 'react';
import { Button } from '@mui/material';

const CustomButton = () => (
  <Button variant="contained" color="primary">
    Click Me
  </Button>
);

export default CustomButton;
// ***********************************************************************
// Updating Stock After Payment:
const placeOrder = async (item, bidPrice) => {
    // Reduce stock by 1
    const updatedStock = item.quantity - 1;
    
    // Update stock in Firestore
    await firestore.collection('foodItems').doc(item.id).update({ quantity: updatedStock });
  
    // Log the order
    await firestore.collection('orders').add({
      foodItemId: item.id,
      customerId: 'currentCustomerId',
      price: bidPrice,
      status: 'confirmed',
    });
  
    console.log('Order placed and stock updated for', item.name);
  };
// ************************************************************************************
// Sending Notifications:

// On the server side (e.g., Firebase Functions), send a notification to users when certain events happen (like when a bid is accepted or a new bid is placed).

// Firebase Function for Sending Notifications:

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendBidNotification = functions.firestore.document('bids/{bidId}')
  .onCreate((snap, context) => {
    const bid = snap.data();

    const message = {
      notification: {
        title: 'New Bid Placed!',
        body: `Customer placed a bid for food item ${bid.foodItemId} at ${bid.proposedPrice} USD.`,
      },
      token: bid.hotelOwnerToken, // Hotel owner's FCM token
    };

    return admin.messaging().send(message)
      .then((response) => {
        console.log('Notification sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
      });
  });

//   Firestore Security Rules:
service cloud.firestore {
    match /databases/{database}/documents {
      // Allow authenticated users to read data
      match /{document=**} {
        allow read: if request.auth != null;
      }
  
      // Only allow hotel owners to modify their own data
      match /hotels/{hotelId} {
        allow write: if request.auth != null && request.auth.uid == resource.data.ownerId;
      }
    }
  }
//   User Authentication and Role Management
// Hotel Owner Role: Can post and update food items, accept bids, and view stock.
// Customer Role: Can view available food items, place bids, and make prepayments.  
const user = firebase.auth().currentUser;
const userDoc = await firestore.collection('users').doc(user.uid).get();

if (userDoc.data().role === 'hotel-owner') {
  // Show hotel owner dashboard
} else {
  // Show customer dashboard
}
// Handling Offline Usage (Optional)
// Implement Firebase Firestore Offline Persistence to allow the app to function in case of intermittent connectivity (especially useful in rural areas)
const firestore = firebase.firestore();
firestore.enablePersistence()
  .catch((err) => {
    console.log('Persistence error:', err);
  });
