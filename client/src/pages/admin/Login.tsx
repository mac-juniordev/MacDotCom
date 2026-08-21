// ============================================
// ADMIN LOGIN
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ============================================
  // CLEANUP REDIRECT TIMER
  // ============================================

  useEffect(() => {
    if (!success) return;

    const timer = window.setTimeout(() => {
      navigate('/command-center/dashboard', {
        replace: true,
      });
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [success, navigate]);

  // ============================================
  // LOGIN
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email.trim(),
          password,
        }
      );

      console.log('LOGIN RESPONSE:', response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || 'Login failed'
        );
      }

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token) {
        throw new Error(
          'Login succeeded but no authentication token was returned.'
        );
      }

      // ============================================
      // STORE AUTH DATA
      // ============================================

      localStorage.setItem('token', token);

      if (user) {
        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );
      }

      // ============================================
      // SHOW SUCCESS SCREEN
      // ============================================

      setSuccess(true);
      setLoading(false);
    } catch (err: unknown) {
      console.error('LOGIN ERROR:', err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            'Unable to login. Please check your credentials.'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }

      setLoading(false);
    }
  };

  // ============================================
  // SUCCESS SCREEN
  // ============================================

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.12) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 50%, rgba(59,130,246,0.12) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.12) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="relative z-10 text-center"
        >
          {/* Logo */}
          <motion.div
            initial={{
              scale: 0,
              rotate: -180,
            }}
            animate={{
              scale: 1,
              rotate: 0,
            }}
            transition={{
              type: 'spring',
              bounce: 0.5,
              duration: 1,
            }}
            className="mb-8 inline-block"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-24 h-24"
            >
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />

              <path
                d="M 35 35 L 50 20 L 65 35 L 65 65 L 50 80 L 35 65 Z"
                fill="#10b981"
              />
            </svg>
          </motion.div>

          {/* Success */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
            }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, Mac!
            </h2>

            <p className="text-gray-400">
              Loading your dashboard...
            </p>
          </motion.div>

          {/* Loading bar */}
          <motion.div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto mt-6">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
              initial={{
                x: '-100%',
              }}
              animate={{
                x: '100%',
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ============================================
  // LOGIN PAGE
  // ============================================

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(59,130,246,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      {/* Login card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          type: 'spring',
          bounce: 0.4,
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-2xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="inline-block mb-4"
            >
              <svg
                viewBox="0 0 100 100"
                className="w-16 h-16"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="#10b981"
                  opacity="0.2"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />

                <path
                  d="M 35 35 L 50 20 L 65 35 L 65 65 L 50 80 L 35 65 Z"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                />
              </svg>
            </motion.div>

            <h1 className="text-2xl font-bold text-white">
              Mac Command Center
            </h1>

            <p className="text-gray-400 mt-2">
              Private Access Only
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: -20,
                }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-12 pr-12 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{
                scale: loading ? 1 : 1.02,
              }}
              whileTap={{
                scale: loading ? 1 : 0.98,
              }}
              className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;