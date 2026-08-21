// ============================================
// PRODUCTS PAGE - FIXED
// Using Lucide icons with one-time spin
// ============================================

import { motion } from 'framer-motion';
import { TrendingUp, Clock, Brain, Calendar, CheckCircle } from 'lucide-react';
import { ComponentType, CSSProperties } from 'react';

interface Product {
  id: number;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  status: string;
  icon: ComponentType<{
    className?: string;
    style?: CSSProperties;
  }>;
  color: string;
}

const Products = () => {
  const products: Product[] = [
    {
      id: 1,
      name: 'TradeMirror',
      tagline: 'AI Trading Analytics',
      description: 'Real-time trading analytics platform with AI-powered predictions and market insights.',
      features: ['Real-time data', 'AI predictions', 'Portfolio tracking', 'Market alerts'],
      status: 'Launched',
      icon: TrendingUp,
      color: '#3b82f6',
    },
    {
      id: 2,
      name: 'Chronova',
      tagline: 'Time Management Suite',
      description: 'Comprehensive time management and productivity suite for modern teams.',
      features: ['Time tracking', 'Team collaboration', 'Analytics dashboard', 'Calendar integration'],
      status: 'Beta',
      icon: Clock,
      color: '#10b981',
    },
    {
      id: 3,
      name: 'PathMind',
      tagline: 'Learning Path Generator',
      description: 'AI-powered learning path generator that creates personalized development roadmaps.',
      features: ['Personalized paths', 'Progress tracking', 'Resource recommendations', 'Skill assessment'],
      status: 'Development',
      icon: Brain,
      color: '#f59e0b',
    },
    {
      id: 4,
      name: 'BookMySlot',
      tagline: 'Appointment Scheduler',
      description: 'Smart appointment scheduling system with automated reminders and calendar sync.',
      features: ['Smart scheduling', 'Automated reminders', 'Calendar sync', 'Payment integration'],
      status: 'Coming Soon',
      icon: Calendar,
      color: '#ef4444',
    },
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-black mb-4 text-primary"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Our Products
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Software solutions we've built
          </motion.p>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 100, rotateX: -30 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: 'spring',
                  bounce: 0.3,
                }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                className="group relative glass rounded-2xl p-8 cursor-pointer overflow-hidden"
              >
                {/* Icon with one-time spin */}
                <motion.div
                  className="mb-4 text-primary"
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 360, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: 'spring',
                  }}
                >
                  <Icon className="w-16 h-16" style={{ color: product.color }} />
                </motion.div>

                <h3 className="text-2xl font-bold mb-2 text-primary">{product.name}</h3>
                <p className="text-lg text-secondary mb-2">{product.tagline}</p>
                <p className="text-secondary mb-4">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((feature, featureIndex) => (
                    <motion.span
                      key={feature}
                      className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 flex items-center gap-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 + featureIndex * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </motion.span>
                  ))}
                </div>

                {/* Status */}
                <motion.span
                  className="inline-block px-4 py-2 rounded-full font-semibold"
                  style={{
                    backgroundColor: `${product.color}20`,
                    color: product.color,
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {product.status}
                </motion.span>

                {/* Hover effects */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at center, ${product.color}20 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;