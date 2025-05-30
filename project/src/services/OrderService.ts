import { v4 as uuidv4 } from 'uuid';
import { 
  OrderType, 
  CustomerInfoType, 
  PaymentInfoType, 
  CartItemType 
} from '../types';
import { updateInventory } from './ProductService';
import { sendOrderConfirmationEmail } from './EmailService';

// In-memory database for orders
const orders: OrderType[] = [];

// Generate a random order number
const generateOrderNumber = (): string => {
  return `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Calculate order totals
const calculateOrderTotals = (items: CartItemType[]) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;
  
  return { subtotal, tax, total };
};

// Process the order
export const processOrder = async (
  customer: CustomerInfoType,
  payment: PaymentInfoType,
  items: CartItemType[]
): Promise<OrderType> => {
  // Simulate different transaction outcomes based on CVV (as per requirements)
  let status: 'approved' | 'declined' | 'error';
  
  if (payment.cvv === '1') {
    status = 'approved';
  } else if (payment.cvv === '2') {
    status = 'declined';
  } else if (payment.cvv === '3') {
    status = 'error';
  } else {
    // For any other CVV, randomly determine outcome (for testing)
    const outcomes: ('approved' | 'declined' | 'error')[] = ['approved', 'declined', 'error'];
    status = outcomes[Math.floor(Math.random() * outcomes.length)];
  }

  const { subtotal, tax, total } = calculateOrderTotals(items);
  
  const order: OrderType = {
    id: uuidv4(),
    orderNumber: generateOrderNumber(),
    date: new Date().toISOString(),
    customer,
    payment: { ...payment, cardNumber: `xxxx-xxxx-xxxx-${payment.cardNumber.slice(-4)}` }, // Mask card number
    items,
    subtotal,
    tax,
    total,
    status
  };
  
  // Store the order in our "database"
  orders.push(order);
  
  // Update inventory only for approved transactions
  if (status === 'approved') {
    items.forEach(item => {
      updateInventory(item.id, item.quantity);
    });
  }
  
  // Send confirmation email
  await sendOrderConfirmationEmail(order);
  
  return order;
};

// Get order by ID
export const getOrder = (orderId: string): OrderType | undefined => {
  return orders.find(order => order.id === orderId);
};