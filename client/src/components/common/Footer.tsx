// ============================================
// FOOTER COMPONENT
// MacDotCom branded animated footer
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

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
    {
      name: 'GitHub',
      url: 'https://github.com/mac-juniordev',
      icon: FaGithub,
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/',
      icon: FaLinkedin,
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/',
      icon: FaTwitter,
    },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8 }}
      className="relative z-10 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Link
                to="/"
                aria-label="MacDotCom home"
                className="group flex items-center gap-3"
              >
                <motion.img
                  src="/favicon.svg"
                  alt="MacDotCom"
                  className="w-12 h-12 object-contain"
                  whileHover={{
                    scale: 1.08,
                    rotate: 5,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 15,
                  }}
                />

                <span className="text-2xl font-black tracking-tight text-primary">
                  MacDotCom
                </span>
              </Link>
            </motion.div>

            <motion.p
              className="mt-4 text-gray-600 dark:text-gray-400 max-w-md leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Building Digital Experiences. Creating Software Solutions.
              We craft premium software products and digital experiences.
            </motion.p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;

                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit MacDotCom on ${social.name}`}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white transition-colors"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      delay: 0.2 + index * 0.1,
                      duration: 0.4,
                    }}
                    whileHover={{
                      scale: 1.15,
                      rotate: 360,
                      backgroundColor: '#3b82f6',
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <motion.h3
              className="text-lg font-bold mb-4 text-primary"
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
                delay: 0.3,
              }}
            >
              Quick Links
            </motion.h3>

            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li
                  key={link.path}
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
                    delay: 0.3 + index * 0.08,
                    duration: 0.4,
                  }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors relative inline-block group"
                  >
                    {link.label}

                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <motion.h3
              className="text-lg font-bold mb-4 text-primary"
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
                delay: 0.4,
              }}
            >
              Contact
            </motion.h3>

            <motion.ul
              className="space-y-4"
              initial={{
                opacity: 0,
              }}
              whileInView={{
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: 0.5,
              }}
            >
              {/* Email */}
              <li className="text-gray-600 dark:text-gray-400 flex items-center gap-3">
                <Mail
                  className="w-4 h-4 text-blue-500 shrink-0"
                  aria-hidden="true"
                />

                <a
                  href="mailto:junmac108@gmail.com"
                  className="hover:text-blue-500 transition-colors"
                >
                  junmac108@gmail.com
                </a>
              </li>

              {/* Location */}
              <li className="text-gray-600 dark:text-gray-400 flex items-center gap-3">
                <MapPin
                  className="w-4 h-4 text-blue-500 shrink-0"
                  aria-hidden="true"
                />

                <span>Remote, Worldwide</span>
              </li>
            </motion.ul>
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.6,
          }}
        >
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} MacDotCom. All rights reserved.
          </p>

          <motion.p
            className="mt-2 text-xs text-gray-400 dark:text-gray-500"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Building Digital Experiences. Creating Software Solutions.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;

