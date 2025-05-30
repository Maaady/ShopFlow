import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOrder } from '../services/OrderService';
import { OrderType } from '../types';
import { useCart } from '../contexts/CartContext';
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, Printer, Package } from 'lucide-react';

const ThankYouPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId) {
      const fetchedOrder = getOrder(orderId);
      if (fetchedOrder) {
        setOrder(fetchedOrder);
        // Clear the cart since order is complete
        clearCart();
      }
      setLoading(false);
    }
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="container-custom py-12 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <XCircle size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} className="mr-2" />
          Return to Home
        </Link>
      </div>
    );
  }

  // Format date
  const orderDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStatusDetails = () => {
    switch (order.status) {
      case 'approved':
        return {
          icon: <CheckCircle size={48} className="text-green-500" />,
          title: 'Order Confirmed!',
          message: 'Your order has been received and is being processed.',
          messageDetail: 'You will receive an email confirmation shortly.',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case 'declined':
        return {
          icon: <XCircle size={48} className="text-red-500" />,
          title: 'Payment Declined',
          message: 'Your payment could not be processed.',
          messageDetail: 'Please check your payment details or try a different payment method.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      case 'error':
        return {
          icon: <AlertTriangle size={48} className="text-yellow-500" />,
          title: 'Processing Error',
          message: 'We encountered an error while processing your order.',
          messageDetail: 'Your payment has not been charged. Please try again later.',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      default:
        return {
          icon: <AlertTriangle size={48} className="text-gray-500" />,
          title: 'Order Status Unknown',
          message: 'The status of your order is unknown.',
          messageDetail: 'Please contact customer support for assistance.',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  const status = getStatusDetails();

  return (
    <div className="container-custom py-8 md:py-12">
      <motion.div
        className={`card p-6 md:p-8 ${status.bgColor} ${status.borderColor} border mb-8`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          {status.icon}
          <h1 className={`text-2xl md:text-3xl font-bold mt-4 ${status.color}`}>{status.title}</h1>
          <p className="text-gray-700 mt-2">{status.message}</p>
          <p className="text-gray-600 text-sm mt-1">{status.messageDetail}</p>
        </div>

        <div className="bg-white rounded-md p-4 md:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
              <p className="text-gray-500 text-sm">Placed on {orderDate}</p>
            </div>

            <div className="flex mt-4 md:mt-0 space-x-3">
              <button className="btn bg-white hover:bg-gray-50 border-gray-300 text-gray-700">
                <Printer size={16} className="mr-2" />
                Print
              </button>
              
              {order.status === 'approved' && (
                <Link to="/" className="btn btn-primary">
                  <Package size={16} className="mr-2" />
                  Track Order
                </Link>
              )}
              
              {(order.status === 'declined' || order.status === 'error') && (
                <Link to="/checkout" className="btn btn-primary">
                  Try Again
                </Link>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.variant}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-medium">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                <p className="text-sm">{order.customer.fullName}</p>
                <p className="text-sm">{order.customer.email}</p>
                <p className="text-sm">{order.customer.phone}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
                <p className="text-sm">{order.customer.address}</p>
                <p className="text-sm">{order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h4>
                <p className="text-sm">Credit Card ending in {order.payment.cardNumber.slice(-4)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="text-center">
        <Link to="/" className="btn bg-gray-100 hover:bg-gray-200 text-gray-700">
          <ArrowLeft size={16} className="mr-2" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;