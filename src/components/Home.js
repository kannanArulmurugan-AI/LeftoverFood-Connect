import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Food Sharing Platform</h1>
      <Link to="/hotel">Hotel Owner Login</Link>
      <br />
      <Link to="/customer">Customer Login</Link>
    </div>
  );
}

export default Home;
