import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const BASE_URL = 'https://afeka-marathons-backend.vercel.app';

const LandingPage = () => {
  const [marathons, setMarathons] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/marathons`) // Sending request to the server to receive the list of marathons
      .then(response => setMarathons(response.data))
      .catch(error => console.error('Error fetching marathons:', error));
  }, []);

  return (
    <div className="landing-page">
      <h1>מרתונים זמינים</h1>
      <div className="marathon-list">
        {marathons.map(marathon => (
          <div key={marathon.id} className="marathon-card">
            <h2>{marathon.name}</h2>
            <p>תאריך: {marathon.date}</p>
            <p>מחיר: {marathon.price} ₪</p>
            <Link to={`/marathon/${marathon.id}`} className="register-button">הרשמה</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
