import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { processOrder } from '../services/OrderService';
import { OrderType, CustomerInfoType, PaymentInfoType } from '../types';
import { CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Form validation types
interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  
  // Redirect to landing page if cart is empty
  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }
  
  // Form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfoType>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoType>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  // Handle customer info change
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({ ...customerInfo, [name]: value });
    
    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  // Handle payment info change
  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Only allow numbers and limit to 16 digits
      const formattedValue = value.replace(/\D/g, '').slice(0, 16);
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    } else if (name === 'expiryDate') {
      // Format as MM/YY
      let formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    } else if (name === 'cvv') {
      // Only allow numbers and limit to 3 digits
      const formattedValue = value.replace(/\D/g, '').slice(0, 3);
      setPaymentInfo({ ...paymentInfo, [name]: formattedValue });
    } else {
      setPaymentInfo({ ...paymentInfo, [name]: value });
    }
    
    // Clear error for the field being edited
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate customer info
    if (!customerInfo.fullName) newErrors.fullName = 'Full name is required';
    
    if (!customerInfo.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!customerInfo.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!customerInfo.address) newErrors.address = 'Address is required';
    if (!customerInfo.city) newErrors.city = 'City is required';
    if (!customerInfo.state) newErrors.state = 'State is required';
    if (!customerInfo.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    // Validate payment info
    if (!paymentInfo.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (paymentInfo.cardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!paymentInfo.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else {
      // Check if expiry date is in the future
      const [month, year] = paymentInfo.expiryDate.split('/');
      const expiryDate = new Date();
      expiryDate.setFullYear(2000 + parseInt(year || '0', 10));
      expiryDate.setMonth(parseInt(month || '0', 10) - 1);
      
      if (expiryDate <= new Date()) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!paymentInfo.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (paymentInfo.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Process the order
      const order: OrderType = await processOrder(
        customerInfo,
        paymentInfo,
        cartItems
      );
      
      // Show appropriate message based on transaction status
      if (order.status === 'approved') {
        toast.success('Transaction approved! Redirecting to confirmation page...');
      } else if (order.status === 'declined') {
        toast.error('Transaction declined. Please try a different payment method.');
      } else {
        toast.error('Transaction error. Please try again later.');
      }
      
      // Navigate to thank you page regardless of status
      // The thank you page will show appropriate information based on status
      setTimeout(() => {
        navigate(`/thank-you/${order.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container-custom py-8 md:py-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer and Payment Form */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ShoppingBag size={20} className="mr-2 text-blue-500" />
                Customer Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleCustomerInfoChange}
                    className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                  />
                  {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className={`input-field ${errors.email ? 'input-error' : ''}`}
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className={`input-field ${errors.phone ? 'input-error' : ''}`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <p className="error-message">{errors.phone}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleCustomerInfoChange}
                    className={`input-field ${errors.address ? 'input-error' : ''}`}
                  />
                  {errors.address && <p className="error-message">{errors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    className={`input-field ${errors.city ? 'input-error' : ''}`}
                  />
                  {errors.city && <p className="error-message">{errors.city}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={customerInfo.state}
                      onChange={handleCustomerInfoChange}
                      className={`input-field ${errors.state ? 'input-error' : ''}`}
                    />
                    {errors.state && <p className="error-message">{errors.state}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={customerInfo.zipCode}
                      onChange={handleCustomerInfoChange}
                      className={`input-field ${errors.zipCode ? 'input-error' : ''}`}
                    />
                    {errors.zipCode && <p className="error-message">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <CreditCard size={20} className="mr-2 text-blue-500" />
                Payment Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handlePaymentInfoChange}
                    className={`input-field ${errors.cardNumber ? 'input-error' : ''}`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
                </div>
                
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={paymentInfo.expiryDate}
                    onChange={handlePaymentInfoChange}
                    className={`input-field ${errors.expiryDate ? 'input-error' : ''}`}
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
                </div>
                
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handlePaymentInfoChange}
                    className={`input-field ${errors.cvv ? 'input-error' : ''}`}
                    placeholder="123"
                  />
                  {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Enter 1 for approval, 2 for decline, 3 for error
                  </p>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn btn-primary py-3 px-8"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Complete Order
                    <ArrowRight size={16} className="ml-2" />
                  </span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        {/* Order Summary */}
        <motion.div 
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
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
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200 text-lg font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Free shipping
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                30-day money-back guarantee
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;