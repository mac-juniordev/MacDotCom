// ============================================
// FEATURED PROJECTS - FIXED
// Using Lucide icons instead of emojis
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, TrendingUp, Clock, Brain } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import type { ComponentType, CSSProperties } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{
    className?: string;
    style?: CSSProperties;
  }>;
  technologies: string[];
  status: string;
  color: string;
}

const FeaturedProjects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: 'TradeMirror',
      description: 'Real-time trading analytics platform with AI predictions',
      icon: TrendingUp,
      technologies: ['React', 'Node.js', 'MongoDB'],
      status: 'Live',
      color: '#3b82f6',
    },
    {
      id: 2,
      title: 'Chronova',
      description: 'Time management and productivity suite for teams',
      icon: Clock,
      technologies: ['TypeScript', 'Express', 'PostgreSQL'],
      status: 'Beta',
      color: '#10b981',
    },
    {
      id: 3,
      title: 'PathMind',
      description: 'AI-powered learning path generator for developers',
      icon: Brain,
      technologies: ['Next.js', 'Python', 'TensorFlow'],
      status: 'Development',
      color: '#f59e0b',
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
          <motion.h2
            className="text-4xl sm:text-5xl font-black mb-4 text-primary"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </motion.h2>
          <motion.p
            className="text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Some of our best work
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 100, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: 'spring',
                  bounce: 0.3,
                }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative glass rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Project icon */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-green-500/20 flex items-center justify-center overflow-hidden">
                  <motion.div
                    initial={{ rotate: 0, scale: 1 }}
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 0, ease: 'easeOut' }}
                    className="text-primary"
                  >
                    <Icon className="w-20 h-20" style={{ color: project.color }} />
                  </motion.div>
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                    <motion.span
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {project.status}
                    </motion.span>
                  </div>
                  
                  <p className="text-secondary mb-4">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + techIndex * 0.1 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    <Link
                      to={`/projects/${project.id}`}
                      className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
                    >
                      View Project
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <a href="#" className="text-secondary hover:text-primary">
                      <FaGithub className="w-4 h-4" />
                    </a>
                    <a href="#" className="text-secondary hover:text-primary">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Hover border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    border: '2px solid rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
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

export default FeaturedProjects;