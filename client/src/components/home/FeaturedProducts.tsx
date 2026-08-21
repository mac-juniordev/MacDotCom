// ============================================
// FEATURED PRODUCTS COMPONENT
// Display featured products with animations
// ============================================

import { motion } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  status: string;
}

const FeaturedProducts = () => {
  const products: Product[] = [
    { id: 1, name: 'TradeMirror', tagline: 'AI Trading Analytics', icon: '📊', color: '#3b82f6', status: 'Launched' },
    { id: 2, name: 'Chronova', tagline: 'Time Management Suite', icon: '⏰', color: '#10b981', status: 'Beta' },
    { id: 3, name: 'PathMind', tagline: 'Learning Path Generator', icon: '🧠', color: '#f59e0b', status: 'Development' },
    { id: 4, name: 'BookMySlot', tagline: 'Appointment Scheduler', icon: '📅', color: '#ef4444', status: 'Coming Soon' },
  ];

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
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <motion.span
              className="inline-block bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Our Products
            </motion.span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Software solutions we've built
          </p>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50, rotate: -10 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                type: 'spring',
                bounce: 0.5,
              }}
              whileHover={{ scale: 1.1, rotate: 5, y: -10 }}
              className="relative glass rounded-2xl p-6 text-center cursor-pointer group"
            >
              {/* Floating icon */}
              <motion.div
                className="text-5xl mb-4 inline-block"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                {product.icon}
              </motion.div>

              {/* Product name */}
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                {product.tagline}
              </p>

              {/* Status badge */}
              <motion.span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: `${product.color}20`,
                  color: product.color,
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {product.status}
              </motion.span>

              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle at center, ${product.color}20 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;