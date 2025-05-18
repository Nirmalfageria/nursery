'use client';

import { useEffect } from 'react';

export default function WhatsappRedirect() {
  useEffect(() => {
    const phoneNumber = '918353064425';
    const message = encodeURIComponent('Hi');
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center',
      backgroundColor: '#f8fff8',
      color: '#333',
      fontFamily: 'Arial, sans-serif',
      padding: '1rem'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Redirecting to WhatsApp...</h1>
      <p style={{ fontSize: '1.2rem' }}>
        If nothing happens,{' '}
        <a
          href="https://wa.me/918353064425?text=Hi"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#25D366', fontWeight: 'bold', textDecoration: 'underline' }}
        >
          click here
        </a>.
      </p>
    </div>
  );
}
