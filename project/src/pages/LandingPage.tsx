import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronRight, Heart, Share2, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProduct } from '../services/ProductService';
import { useCart } from '../contexts/CartContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Get the product (in a real app, this might come from an API)
  const product = getProduct('1');
  
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({
    'Color': product?.variants[0].options[0] || '',
    'Size': product?.variants[1].options[0] || '',
  });
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  if (!product) {
    return <div className="container-custom py-12">Product not found</div>;
  }
  
  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants({
      ...selectedVariants,
      [variantName]: option
    });
  };
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, Math.min(10, quantity + change));
    setQuantity(newQuantity);
  };
  
  const handleBuyNow = () => {
    // Combine variant selections into a single string
    const variantString = Object.entries(selectedVariants)
      .map(([name, value]) => `${name}: ${value}`)
      .join(', ');
    
    // Add to cart
    addToCart(product, variantString, quantity);
    
    // Navigate to checkout
    navigate('/checkout');
  };
  
  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={product.images[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover object-center"
            />
          </div>
          
          <div className="flex space-x-2 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setActiveImage(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Product Details */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-2xl font-medium text-gray-900">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>
          
          {/* Variants */}
          <div className="space-y-6">
            {product.variants.map((variant) => (
              <div key={variant.name}>
                <h3 className="text-sm font-medium text-gray-900">{variant.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`px-4 py-2 text-sm rounded-md border ${
                        selectedVariants[variant.name] === option
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                      onClick={() => handleVariantChange(variant.name, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Quantity Selector */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
            <div className="mt-2 flex items-center border border-gray-300 w-32 rounded-md">
              <button 
                className="px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button 
                className="px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button 
              className="btn btn-primary flex-1 py-3"
              onClick={handleBuyNow}
            >
              <ShoppingCart size={18} className="mr-2" />
              Buy Now
            </button>
            
            <div className="flex space-x-3">
              <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-600 p-3">
                <Heart size={18} />
              </button>
              <button className="btn bg-gray-100 hover:bg-gray-200 text-gray-600 p-3">
                <Share2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center text-sm text-blue-600">
              <span>View full product details</span>
              <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;