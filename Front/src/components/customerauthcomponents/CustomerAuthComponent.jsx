// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import CustomerSignInComponent from './CustomerSignInComponent';
import CustomerRegisterComponent from './CustomerRegisterComponent';
import ResetPasswordComponent from './ResetPasswordComponent';

// eslint-disable-next-line react/prop-types
const CustomerAuthComponent = ({ onClose }) => {
  const [currentView, setCurrentView] = useState('sign-in');

  const handleChangeView = (view) => {
    setCurrentView(view);
  };

  return (
    <div>
      {currentView === 'sign-in' && (
        <CustomerSignInComponent onClose={onClose} onChangeView={handleChangeView} />
      )}
      {currentView === 'register' && (
        <CustomerRegisterComponent onClose={onClose} onChangeView={handleChangeView} />
      )}
      {currentView === 'reset-password' && (
        <ResetPasswordComponent onClose={onClose} onChangeView={handleChangeView} />
      )}
    </div>
  );
};

export default CustomerAuthComponent;
