import { ProductType } from '../types';

// Mock product data
const products: ProductType[] = [
  {
    id: '1',
    name: 'Converse Chuck Taylor All Star II Hi',
    description: 'The Converse Chuck Taylor All Star II Hi gives the iconic silhouette a modern upgrade. The premium canvas upper and Lunarlon cushioning provide elevated comfort, while the embroidered All Star patch and higher foxing deliver the unmistakable look you love.',
    price: 85,
    images: [
      'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      'https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    variants: [
      {
        name: 'Color',
        options: ['Black', 'White', 'Red', 'Navy']
      },
      {
        name: 'Size',
        options: ['7', '8', '9', '10', '11', '12']
      }
    ],
    inventory: 50
  }
];

export const getProduct = (id: string): ProductType | undefined => {
  return products.find(product => product.id === id);
};

export const getAllProducts = (): ProductType[] => {
  return products;
};

// Simulated inventory update
export const updateInventory = (productId: string, quantity: number): boolean => {
  const product = products.find(p => p.id === productId);
  
  if (!product) return false;
  
  if (product.inventory >= quantity) {
    product.inventory -= quantity;
    return true;
  }
  
  return false;
};