import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = 'https://afeka-marathons-backend.vercel.app';

const MarathonRegistration = () => {
  const { id } = useParams();
  const [marathon, setMarathon] = useState(null);
  const [student, setStudent] = useState({
    fullName: '',
    studentId: '',
    email: ''
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/api/marathon/${id}`) // Get marathon details from the server
      .then(response => setMarathon(response.data))
      .catch(error => console.error('Error fetching marathon details:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handlePaymentSuccess = (details) => {
    axios.post(`${BASE_URL}/api/register/${id}`, { student, transactionId: details.id }) // Save the registration information
      .then(response => alert('הרשמה בוצעה בהצלחה'))
      .catch(error => console.error('Error saving registration:', error));
  };

  return (
    <div className="registration-page">
      {marathon ? (
        <>
          <h1>הרשמה למרתון: {marathon.name}</h1>
          <input
            type="text"
            name="fullName"
            placeholder="שם מלא"
            value={student.fullName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="studentId"
            placeholder="תעודת זהות"
            value={student.studentId}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            value={student.email}
            onChange={handleInputChange}
          />
          
          <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: marathon.price.toString(),
                    },
                  }],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(handlePaymentSuccess);
              }}
            />
          </PayPalScriptProvider>
        </>
      ) : (
        <p>טוען פרטי מרתון...</p>
      )}
    </div>
  );
};

export default MarathonRegistration;
