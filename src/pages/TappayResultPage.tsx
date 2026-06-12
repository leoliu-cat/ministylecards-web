import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../components/CartContext';

export function TappayResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');

    if (status === '0') {
      clearCart();
      navigate('/order/success', { replace: true });
    } else {
      navigate('/checkout?payment_error=true', { replace: true });
    }
  }, [location, navigate, clearCart]);

  return (
    <div className="pt-32 pb-24 px-4 min-h-[60vh] flex flex-col items-center justify-center">
      <p className="text-gray-500">正在處理付款結果...</p>
    </div>
  );
}
