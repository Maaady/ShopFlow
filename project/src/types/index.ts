export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants: {
    name: string;
    options: string[];
  }[];
  inventory: number;
}

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
}

export interface CustomerInfoType {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentInfoType {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerInfoType;
  payment: PaymentInfoType;
  items: CartItemType[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'approved' | 'declined' | 'error';
}