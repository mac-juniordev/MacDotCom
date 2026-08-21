// ============================================
// FOOTER COMPONENT
// Animated footer with links and effects
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/mac-juniordev' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-2">
            <Logo animated={false} />
            <motion.p
              className="mt-4 text-gray-600 dark:text-gray-400 max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Building Digital Experiences. Creating Software Solutions.
              We craft premium software products and digital experiences.
            </motion.p>
            
            {/* Animated social icons */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 360, backgroundColor: '#3b82f6' }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <span className="text-sm font-bold">{social.name[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <motion.h3
              className="text-lg font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Quick Links
            </motion.h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors relative group"
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500"
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <motion.h3
              className="text-lg font-bold mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Contact
            </motion.h3>
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <li className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✉
                </motion.span>
                hello@macdotcom.com
              </li>
              <li className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📍
                </motion.span>
                Remote, Worldwide
              </li>
            </motion.ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} MacDotCom. All rights reserved.
          </p>
          <motion.p
            className="mt-2 text-xs text-gray-400 dark:text-gray-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Building Digital Experiences. Creating Software Solutions.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;