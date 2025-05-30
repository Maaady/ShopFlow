# eCommerce Checkout Flow Simulation

A modern, fully-featured eCommerce checkout flow built with React, TypeScript, and Tailwind CSS. This project demonstrates a complete product purchase journey with form validation, transaction simulation, and email notifications.

![Project Preview](https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## Features

- 🛍️ **Product Landing Page**
  - Dynamic product display with variants
  - Image gallery with thumbnails
  - Quantity selector
  - Real-time price updates

- 🛒 **Checkout Process**
  - Comprehensive form validation
  - Address collection
  - Secure payment processing
  - Order summary
  - Real-time error handling

- ✅ **Order Confirmation**
  - Transaction status display
  - Order details summary
  - Customer information review
  - Email notifications

## Transaction Simulation

Test different transaction outcomes using these CVV numbers:
- `1` → ✅ Approved Transaction
- `2` → ❌ Declined Transaction
- `3` → ⚠️ Gateway Error
- Any other 3-digit number → Random outcome

## Tech Stack

- **Frontend Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Routing:** React Router
- **Notifications:** React Hot Toast
- **Build Tool:** Vite

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce-checkout-flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── pages/         # Main page components
├── services/      # Business logic and API services
├── types/         # TypeScript type definitions
└── main.tsx       # Application entry point
```

## Key Features

### Form Validation
- Email format validation
- Phone number formatting
- Credit card number validation (16 digits)
- Future date validation for card expiry
- CVV validation (3 digits)

### Order Processing
- Unique order number generation
- Transaction status simulation
- Inventory management
- Email notifications for different transaction states

### User Experience
- Responsive design
- Real-time form validation
- Loading states
- Error handling
- Success/failure notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Product images from [Pexels](https://www.pexels.com)
- Icons from [Lucide](https://lucide.dev)# eCommerce Checkout Flow Simulation

A modern, fully-featured eCommerce checkout flow built with React, TypeScript, and Tailwind CSS. This project demonstrates a complete product purchase journey with form validation, transaction simulation, and email notifications.

![Project Preview](https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## Features

- 🛍️ **Product Landing Page**
  - Dynamic product display with variants
  - Image gallery with thumbnails
  - Quantity selector
  - Real-time price updates

- 🛒 **Checkout Process**
  - Comprehensive form validation
  - Address collection
  - Secure payment processing
  - Order summary
  - Real-time error handling

- ✅ **Order Confirmation**
  - Transaction status display
  - Order details summary
  - Customer information review
  - Email notifications

## Transaction Simulation

Test different transaction outcomes using these CVV numbers:
- `1` → ✅ Approved Transaction
- `2` → ❌ Declined Transaction
- `3` → ⚠️ Gateway Error
- Any other 3-digit number → Random outcome

## Tech Stack

- **Frontend Framework:** React with TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Routing:** React Router
- **Notifications:** React Hot Toast
- **Build Tool:** Vite

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce-checkout-flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── pages/         # Main page components
├── services/      # Business logic and API services
├── types/         # TypeScript type definitions
└── main.tsx       # Application entry point
```

## Key Features

### Form Validation
- Email format validation
- Phone number formatting
- Credit card number validation (16 digits)
- Future date validation for card expiry
- CVV validation (3 digits)

### Order Processing
- Unique order number generation
- Transaction status simulation
- Inventory management
- Email notifications for different transaction states

### User Experience
- Responsive design
- Real-time form validation
- Loading states
- Error handling
- Success/failure notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Product images from [Pexels](https://www.pexels.com)
- Icons from [Lucide](https://lucide.dev)
