import axios from 'axios';
import { OrderType } from '../types';

// Mailtrap.io credentials (these would normally be in environment variables)
const MAILTRAP_ENDPOINT = 'https://send.api.mailtrap.io/api/send';
const MAILTRAP_API_TOKEN = 'your_mailtrap_api_token'; // Replace with actual token

// Templates for different transaction outcomes
const getEmailTemplate = (order: OrderType) => {
  const { orderNumber, customer, items, subtotal, tax, total, status } = order;
  const date = new Date(order.date).toLocaleDateString();
  
  // Common HTML header and styles
  const headerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #3B82F6; padding: 20px; text-align: center; color: white;">
        <h1>ShopFlow</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e5e5e5; border-top: none;">
  `;
  
  // Common HTML footer
  const footerHtml = `
      </div>
      <div style="padding: 20px; text-align: center; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} ShopFlow. All rights reserved.</p>
        <p>If you have any questions, please contact our support team at support@shopflow.com</p>
      </div>
    </div>
  `;
  
  // Item list HTML
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${item.name} (${item.variant})</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e5e5;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');
  
  if (status === 'approved') {
    return {
      subject: `Order Confirmed: #${orderNumber}`,
      html: `
        ${headerHtml}
          <h2 style="color: #10B981;">Your Order is Confirmed!</h2>
          <p>Dear ${customer.fullName},</p>
          <p>Thank you for your purchase. We're pleased to confirm that your order has been received and is being processed.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Order Date:</strong> ${date}</p>
          
          <h3>Shipping Information</h3>
          <p>${customer.fullName}<br>
          ${customer.address}<br>
          ${customer.city}, ${customer.state} ${customer.zipCode}<br>
          ${customer.phone}</p>
          
          <h3>Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
                <th style="padding: 10px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px;">$${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
                <td style="padding: 10px;">$${tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px;"><strong>$${total.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
        ${footerHtml}
      `
    };
  } else if (status === 'declined') {
    return {
      subject: `Payment Declined: Order #${orderNumber}`,
      html: `
        ${headerHtml}
          <h2 style="color: #EF4444;">Payment Declined</h2>
          <p>Dear ${customer.fullName},</p>
          <p>We regret to inform you that your payment for order #${orderNumber} has been declined by your payment provider.</p>
          
          <h3>What to do next:</h3>
          <ul>
            <li>Check that your payment details are correct</li>
            <li>Ensure you have sufficient funds available</li>
            <li>Try again with a different payment method</li>
            <li>Contact your bank if the issue persists</li>
          </ul>
          
          <p>For assistance, please contact our customer support team at support@shopflow.com.</p>
          
          <div style="margin: 20px 0; text-align: center;">
            <a href="#" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Try Again</a>
          </div>
        ${footerHtml}
      `
    };
  } else {
    return {
      subject: `Order Processing Error: #${orderNumber}`,
      html: `
        ${headerHtml}
          <h2 style="color: #FBBF24;">Order Processing Error</h2>
          <p>Dear ${customer.fullName},</p>
          <p>We encountered an unexpected error while processing your order #${orderNumber}.</p>
          
          <p>Our technical team has been notified and is working to resolve the issue. You have not been charged for this transaction.</p>
          
          <h3>What to do next:</h3>
          <ul>
            <li>Please try again in a few minutes</li>
            <li>If the problem persists, try using a different payment method</li>
            <li>Contact our customer support for immediate assistance</li>
          </ul>
          
          <p>We apologize for any inconvenience this may have caused.</p>
          
          <div style="margin: 20px 0; text-align: center;">
            <a href="#" style="background-color: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Try Again</a>
          </div>
        ${footerHtml}
      `
    };
  }
};

// Send order confirmation email via Mailtrap
export const sendOrderConfirmationEmail = async (order: OrderType): Promise<boolean> => {
  try {
    const { subject, html } = getEmailTemplate(order);
    
    // In a real application, this would make an actual API call to Mailtrap
    // For this demo, we'll simulate the API call
    console.log(`Sending email: ${subject}`);
    console.log(`To: ${order.customer.email}`);
    
    // Uncomment and provide API token to actually send emails via Mailtrap
    /*
    const response = await axios.post(
      MAILTRAP_ENDPOINT,
      {
        from: {
          email: "orders@shopflow.com",
          name: "ShopFlow Orders"
        },
        to: [
          {
            email: order.customer.email,
            name: order.customer.fullName
          }
        ],
        subject,
        html
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Token": MAILTRAP_API_TOKEN
        }
      }
    );
    
    return response.status === 200;
    */
    
    // Simulate successful email sending
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};