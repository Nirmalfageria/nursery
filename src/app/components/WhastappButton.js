'use client';

import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsappButton() {
  return (
    <Link
      href="/whatsapp"
      style={{
        position: 'fixed',
        bottom: '45px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#25D366',
        padding: '10px',
        borderRadius: '50%',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FaWhatsapp size={32} color="white" />
    </Link>
  );
}
