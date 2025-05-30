import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container-custom py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600 flex items-center">
          <ShoppingBag className="mr-2" size={24} />
          <span>ShopFlow</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          
          <Link to="/checkout" className="relative">
            <ShoppingBag size={20} className="text-gray-600 hover:text-blue-600 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;