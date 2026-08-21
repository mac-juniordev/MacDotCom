// ============================================
// SERVICES COMPONENT
// Display services with animations
// ============================================

import { motion } from 'framer-motion';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const Services = () => {
  const services: Service[] = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Full-stack web applications with modern technologies',
      icon: '💻',
      features: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Mobile Development',
      description: 'Cross-platform mobile apps for iOS and Android',
      icon: '📱',
      features: ['React Native', 'Flutter', 'Firebase'],
    },
    {
      id: 3,
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interfaces',
      icon: '🎨',
      features: ['Figma', 'Adobe XD', 'Prototyping'],
    },
    {
      id: 4,
      title: 'API Development',
      description: 'Scalable and secure REST APIs',
      icon: '🔌',
      features: ['Express', 'GraphQL', 'Docker'],
    },
    {
      id: 5,
      title: 'Cloud Solutions',
      description: 'Cloud infrastructure and deployment',
      icon: '☁️',
      features: ['AWS', 'Azure', 'CI/CD'],
    },
    {
      id: 6,
      title: 'Consulting',
      description: 'Technical consulting and code reviews',
      icon: '🤝',
      features: ['Architecture', 'Code Review', 'Mentoring'],
    },
  ];

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <motion.p
            className="text-gray-600 dark:text-gray-400"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            What we can do for you
          </motion.p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: 'spring',
                bounce: 0.4,
              }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="group relative glass rounded-2xl p-6"
            >
              {/* Animated icon */}
              <motion.div
                className="text-5xl mb-4 inline-block"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {service.icon}
              </motion.div>

              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {service.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, featureIndex) => (
                  <motion.span
                    key={feature}
                    className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    {feature}
                  </motion.span>
                ))}
              </div>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;