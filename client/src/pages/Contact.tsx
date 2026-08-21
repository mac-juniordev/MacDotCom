// ============================================
// CONTACT PAGE - FIXED
// Theme-aware inputs with Lucide icons
// ============================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import MagneticWrapper from '../components/effects/MagneticWrapper';
import ParticleField from '../components/effects/ParticleField';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

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
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Contact Us
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Let's discuss your project
          </motion.p>
        </motion.div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, label: 'Email', value: 'junmac108@gmail.com' },
            { icon: Phone, label: 'Phone', value: '+237 683 76 49 24' },
            { icon: MapPin, label: 'Location', value: 'Remote, Worldwide' },
          ].map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <motion.div
                  className="inline-block mb-2"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index }}
                >
                  <Icon className="w-8 h-8 text-blue-500" />
                </motion.div>
                <h3 className="font-bold text-primary">{info.label}</h3>
                <p className="text-secondary">{info.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Contact form */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className="block text-sm font-medium mb-2 text-primary">Name</label>
              <motion.input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500"
                placeholder="Your name"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label className="block text-sm font-medium mb-2 text-primary">Email</label>
              <motion.input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500"
                placeholder="Your email"
                required
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label className="block text-sm font-medium mb-2 text-primary">Subject</label>
            <motion.input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500"
              placeholder="Subject"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <label className="block text-sm font-medium mb-2 text-primary">Message</label>
            <motion.textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500"
              rows={6}
              placeholder="Your message"
              required
            />
          </motion.div>

          <MagneticWrapper>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold text-lg relative overflow-hidden flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Message
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