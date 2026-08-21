// ============================================
// CONTACT PAGE
// Sends contact messages to the backend API
// ============================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

import MagneticWrapper from '../components/effects/MagneticWrapper';
import ParticleField from '../components/effects/ParticleField';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

const INITIAL_FORM: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const Contact = () => {
  const [formData, setFormData] =
    useState<ContactFormData>(INITIAL_FORM);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    setIsSubmitted(false);

    try {
      const response = await axios.post<ApiResponse>(
        `${API_URL}/messages`,
        formData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || 'Failed to send message.'
        );
      }

      setIsSubmitted(true);
      setFormData(INITIAL_FORM);
    } catch (err: unknown) {
      console.error('Failed to send message:', err);

      if (axios.isAxiosError<ApiResponse>(err)) {
        setError(
          err.response?.data?.message ||
            'Failed to send message. Please try again.'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'junmac108@gmail.com',
      href: 'mailto:junmac108@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: 'Available on request',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Remote, Worldwide',
    },
  ];

  return (
    <section className="relative min-h-screen pt-24 pb-20">
      <ParticleField count={25} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Contact Us
            </span>
          </motion.h1>

          <motion.p
            className="text-xl text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Let&apos;s discuss your project
          </motion.p>
        </motion.div>

        {/* Contact information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;

            const content = (
              <>
                <motion.div
                  className="inline-flex items-center justify-center mb-3"
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.2,
                  }}
                >
                  <Icon
                    className="w-8 h-8 text-blue-500"
                    aria-hidden="true"
                  />
                </motion.div>

                <h3 className="font-bold text-primary">
                  {info.label}
                </h3>

                <p className="text-secondary break-words">
                  {info.value}
                </p>
              </>
            );

            return (
              <motion.div
                key={info.label}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.2,
                  duration: 0.5,
                }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                }}
                className="glass rounded-2xl p-6 text-center"
              >
                {info.href ? (
                  <a
                    href={info.href}
                    className="block hover:text-blue-500 transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Success message */}
        {isSubmitted && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            role="status"
            aria-live="polite"
            className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 flex items-center gap-3"
          >
            <CheckCircle
              className="w-5 h-5 shrink-0"
              aria-hidden="true"
            />

            <span>
              Your message has been sent successfully. We&apos;ll get
              back to you soon.
            </span>
          </motion.div>
        )}

        {/* Error message */}
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
            role="alert"
            aria-live="assertive"
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 flex items-center gap-3"
          >
            <AlertCircle
              className="w-5 h-5 shrink-0"
              aria-hidden="true"
            />

            <span>{error}</span>
          </motion.div>
        )}

        {/* Contact form */}
        <motion.form
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.5,
          }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 sm:p-8 space-y-6"
        >
          {/* Name and email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.7,
              }}
            >
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium mb-2 text-primary"
              >
                Name
              </label>

              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Your name"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 transition-colors"
              />
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.8,
              }}
            >
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium mb-2 text-primary"
              >
                Email
              </label>

              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Your email"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 transition-colors"
              />
            </motion.div>
          </div>

          {/* Subject */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.9,
            }}
          >
            <label
              htmlFor="contact-subject"
              className="block text-sm font-medium mb-2 text-primary"
            >
              Subject
            </label>

            <input
              id="contact-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 transition-colors"
            />
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
            }}
          >
            <label
              htmlFor="contact-message"
              className="block text-sm font-medium mb-2 text-primary"
            >
              Message
            </label>

            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              placeholder="Tell us about your project..."
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60 transition-colors resize-y"
            />
          </motion.div>

          {/* Submit */}
          <MagneticWrapper>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.03 } : undefined}
              whileTap={!isSubmitting ? { scale: 0.97 } : undefined}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold text-lg relative overflow-hidden flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="w-5 h-5 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Sending...</span>
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                  <span>Message Sent</span>
                </>
              ) : (
                <>
                  <Send
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </MagneticWrapper>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;

