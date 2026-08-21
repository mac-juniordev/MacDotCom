// ============================================
// PRODUCTS PAGE
// Connected to API
// Lucide icons + animations
// React effect-safe data fetching
// ============================================

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Brain,
  Calendar,
  CheckCircle,
  Package,
} from 'lucide-react';
import {
  ComponentType,
  CSSProperties,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

// ============================================
// TYPES
// ============================================

interface Product {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  technologies: string[];
  status: string;
}

// ============================================
// API
// ============================================

const API_URL = 'http://localhost:5000/api';

// ============================================
// ICON MAPPING
// ============================================

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

// ============================================
// COLOR MAPPING
// ============================================

const colorMap: Record<string, string> = {
  TradeMirror: '#3b82f6',
  Chronova: '#10b981',
  PathMind: '#f59e0b',
  BookMySlot: '#ef4444',
};

// ============================================
// PRODUCTS COMPONENT
// ============================================

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================================
  // FETCH PRODUCTS
  // ============================================

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/products?limit=50`
        );

        if (cancelled) return;

        const data = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setProducts(data);
      } catch (error) {
        if (cancelled) return;

        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================
  // RENDER
  // ============================================

  return (
    <section className="relative min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ============================================
            PAGE HEADER
        ============================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl sm:text-6xl font-black mb-4 text-primary"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Our Products
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-secondary"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Software solutions we've built
          </motion.p>
        </motion.div>

        {/* ============================================
            LOADING STATE
        ============================================ */}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"
            />
          </div>
        ) : products.length === 0 ? (

          /* ============================================
             EMPTY STATE
          ============================================ */

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="text-center py-20"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              No products available yet.
            </p>
          </motion.div>

        ) : (

          /* ============================================
             PRODUCTS GRID
          ============================================ */

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product, index) => {
              const Icon =
                iconMap[product.name] || Package;

              const color =
                colorMap[product.name] || '#3b82f6';

              const features = Array.isArray(product.features)
                ? product.features
                : [];

              return (
                <motion.div
                  key={product._id}
                  initial={{
                    opacity: 0,
                    y: 100,
                    rotateX: -30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    type: 'spring',
                    bounce: 0.3,
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotate: index % 2 === 0 ? 2 : -2,
                  }}
                  className="group relative glass rounded-2xl p-8 cursor-pointer overflow-hidden"
                >

                  {/* ============================================
                      ICON
                  ============================================ */}

                  <motion.div
                    className="mb-4 text-primary relative z-10"
                    initial={{
                      rotate: 0,
                      scale: 0,
                    }}
                    whileInView={{
                      rotate: 360,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      type: 'spring',
                    }}
                  >
                    <Icon
                      className="w-16 h-16"
                      style={{
                        color,
                      }}
                    />
                  </motion.div>

                  {/* ============================================
                      PRODUCT NAME
                  ============================================ */}

                  <h3 className="relative z-10 text-2xl font-bold mb-2 text-primary">
                    {product.name}
                  </h3>

                  {/* ============================================
                      TAGLINE
                  ============================================ */}

                  <p className="relative z-10 text-lg text-secondary mb-2">
                    {product.tagline}
                  </p>

                  {/* ============================================
                      DESCRIPTION
                  ============================================ */}

                  <p className="relative z-10 text-secondary mb-4">
                    {product.description}
                  </p>

                  {/* ============================================
                      FEATURES
                  ============================================ */}

                  {features.length > 0 && (
                    <div className="relative z-10 flex flex-wrap gap-2 mb-4">
                      {features
                        .slice(0, 4)
                        .map((feature, featureIndex) => (
                          <motion.span
                            key={`${product._id}-${feature}-${featureIndex}`}
                            className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 flex items-center gap-1"
                            initial={{
                              opacity: 0,
                              x: -20,
                            }}
                            whileInView={{
                              opacity: 1,
                              x: 0,
                            }}
                            viewport={{
                              once: true,
                            }}
                            transition={{
                              delay:
                                index * 0.2 +
                                featureIndex * 0.1,
                            }}
                            whileHover={{
                              scale: 1.1,
                            }}
                          >
                            <CheckCircle className="w-3 h-3" />

                            {feature}
                          </motion.span>
                        ))}
                    </div>
                  )}

                  {/* ============================================
                      STATUS
                  ============================================ */}

                  <motion.span
                    className="relative z-10 inline-block px-4 py-2 rounded-full font-semibold"
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
                    }}
                  >
                    {product.status}
                  </motion.span>

                  {/* ============================================
                      HOVER GLOW
                  ============================================ */}

                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background: `radial-gradient(
                        circle at center,
                        ${color}20 0%,
                        transparent 70%
                      )`,
                    }}
                  />

                  {/* ============================================
                      DECORATIVE BORDER GLOW
                  ============================================ */}

                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={{
                      opacity: 0,
                    }}
                    whileHover={{
                      opacity: 1,
                    }}
                    style={{
                      boxShadow: `inset 0 0 0 1px ${color}50`,
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

export default Products;