import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (!error) {
      const { id } = paymentMethod;
      try {
        const response = await axios.post('/create-payment-intent', {
          amount, // Pass the order amount here
          id,
        });

        if (response.data.success) {
          setPaymentSuccess(true);
          // Once payment is confirmed, update the order in Firebase
        }
      } catch (error) {
        console.error('Payment error:', error);
      }
    } else {
      console.error('Payment Method Error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay {amount} USD
      </button>
    </form>
  );
};

const Checkout = ({ amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
};

export default Checkout;
