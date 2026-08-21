// ============================================
// CONTACT PREVIEW COMPONENT - FIXED
// Theme aware with Lucide icons
// ============================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send } from 'lucide-react';

const ContactPreview = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className="relative py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-primary">
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <motion.p
            className="text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Have a question or want to work together?
          </motion.p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
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
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
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
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium mb-2 text-primary">Message</label>
            <motion.textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500"
              rows={5}
              placeholder="Your message"
              required
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold text-lg relative overflow-hidden group flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send Message
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1, repeat: Infinity, delay: 1 }}
            />
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default ContactPreview;