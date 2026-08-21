// ============================================
// FEATURED PRODUCTS - CONNECTED TO API
// Using Lucide icons with one-time spin
// ============================================

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Brain,
  Calendar,
  Package,
} from 'lucide-react';
import {
  ComponentType,
  CSSProperties,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  tagline: string;
  status: string;
  featured: boolean;
}

const API_URL = 'http://localhost:5000/api';

// Icon mapping based on product name
const iconMap: Record<
  string,
  ComponentType<{
    className?: string;
    style?: CSSProperties;
  }>
> = {
  TradeMirror: TrendingUp,
  Chronova: Clock,
  PathMind: Brain,
  BookMySlot: Calendar,
};

// Color mapping based on product name
const colorMap: Record<string, string> = {
  TradeMirror: '#3b82f6',
  Chronova: '#10b981',
  PathMind: '#f59e0b',
  BookMySlot: '#ef4444',
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First try to fetch featured products
        const response = await axios.get(
          `${API_URL}/products?featured=true&limit=4`
        );

        setProducts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch featured products:', error);

        // Fallback: fetch all products if featured request fails
        try {
          const allResponse = await axios.get(
            `${API_URL}/products?limit=4`
          );

          setProducts(allResponse.data.data || []);
        } catch (fallbackError) {
          console.error(
            'Failed to fetch all products:',
            fallbackError
          );

          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59,130,246,0.1) 0%, transparent 50%)',
            'linear-gradient(-45deg, rgba(16,185,129,0.1) 0%, transparent 50%)',
            'linear-gradient(45deg, rgba(59,130,246,0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary">
            <motion.span
              className="inline-block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: [
                  '0% 50%',
                  '100% 50%',
                  '0% 50%',
                ],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              Our Products
            </motion.span>
          </h2>

          <p className="text-secondary">
            Software solutions we've built
          </p>
        </motion.div>

        {/* Products grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              No products available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const Icon = iconMap[product.name] || Package;
              const color = colorMap[product.name] || '#3b82f6';

              return (
                <motion.div
                  key={product._id}
                  initial={{
                    opacity: 0,
                    y: 50,
                    rotate: -10,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    type: 'spring',
                    bounce: 0.5,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: 2,
                    y: -10,
                  }}
                  className="relative glass rounded-2xl p-6 text-center cursor-pointer group"
                >
                  {/* Icon with one-time spin */}
                  <motion.div
                    className="mb-4 inline-block text-primary"
                    initial={{
                      rotate: 0,
                      scale: 0,
                    }}
                    whileInView={{
                      rotate: 360,
                      scale: 1,
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      type: 'spring',
                    }}
                  >
                    <Icon
                      className="w-12 h-12"
                      style={{ color }}
                    />
                  </motion.div>

                  {/* Product name */}
                  <h3 className="text-xl font-bold mb-2 text-primary">
                    {product.name}
                  </h3>

                  {/* Product tagline */}
                  <p className="text-secondary text-sm mb-3">
                    {product.tagline}
                  </p>

                  {/* Status badge */}
                  <motion.span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: `${color}20`,
                      color,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {product.status}
                  </motion.span>

                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${color}20 0%, transparent 70%)`,
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;