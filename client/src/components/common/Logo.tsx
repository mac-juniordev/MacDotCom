// ============================================
// LOGO COMPONENT
// Animated "M" logo with rotating rings
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: number;
  animated?: boolean;
}

const Logo = ({ size = 40, animated = true }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* Logo container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Rotating outer ring */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ borderStyle: 'dashed' }}
          />
        )}

        {/* Second rotating ring (opposite direction) */}
        {animated && (
          <motion.div
            className="absolute inset-1 rounded-full border border-green-500"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{ borderStyle: 'dotted' }}
          />
        )}

        {/* Glowing pulse */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* The "M" letter */}
        <motion.span
          className="relative z-10 font-black text-white"
          style={{ fontSize: size * 0.5 }}
          whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          M
        </motion.span>
      </div>

      {/* Company name */}
      <div className="flex flex-col">
        <motion.span
          className="font-bold text-lg leading-none"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          MacDotCom
        </motion.span>
        <motion.span
          className="text-xs text-gray-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Software Company
        </motion.span>
      </div>
    </Link>
  );
};

export default Logo;