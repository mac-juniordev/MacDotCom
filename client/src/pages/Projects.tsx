// ============================================
// PROJECTS PAGE - FIXED
// Using Lucide icons with one-time spin
// ============================================

import { motion } from 'framer-motion';
import { ComponentType, CSSProperties, useState } from 'react';
import { TrendingUp, Clock, Brain, Calendar, Users, Cloud, Search } from 'lucide-react';
import ParticleField from '../components/effects/ParticleField';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  status: string;
icon: ComponentType<{
    className?: string;
    style?: CSSProperties;
  }>;
  color: string;
}

const Projects = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const projects: Project[] = [
    {
      id: 1,
      title: 'TradeMirror',
      description: 'Real-time trading analytics platform with AI predictions and market insights',
      category: 'fullstack',
      technologies: ['React', 'Node.js', 'MongoDB', 'WebSocket'],
      status: 'Live',
      icon: TrendingUp,
      color: '#3b82f6',
    },
    {
      id: 2,
      title: 'Chronova',
      description: 'Time management and productivity suite for modern teams',
      category: 'web',
      technologies: ['TypeScript', 'Express', 'PostgreSQL'],
      status: 'Beta',
      icon: Clock,
      color: '#10b981',
    },
    {
      id: 3,
      title: 'PathMind',
      description: 'AI-powered learning path generator for developers',
      category: 'api',
      technologies: ['Next.js', 'Python', 'TensorFlow'],
      status: 'Development',
      icon: Brain,
      color: '#f59e0b',
    },
    {
      id: 4,
      title: 'BookMySlot',
      description: 'Appointment scheduling system with calendar integration',
      category: 'fullstack',
      technologies: ['React', 'Node.js', 'Redis'],
      status: 'Coming Soon',
      icon: Calendar,
      color: '#ef4444',
    },
    {
      id: 5,
      title: 'DevConnect',
      description: 'Social platform for developers to share and collaborate',
      category: 'web',
      technologies: ['React', 'GraphQL', 'MongoDB'],
      status: 'Live',
      icon: Users,
      color: '#8b5cf6',
    },
    {
      id: 6,
      title: 'CloudDeploy',
      description: 'Automated deployment pipeline for cloud applications',
      category: 'devops',
      technologies: ['Docker', 'Kubernetes', 'AWS'],
      status: 'Beta',
      icon: Cloud,
      color: '#06b6d4',
    },
  ];

  const categories = ['all', 'web', 'fullstack', 'api', 'devops'];

  const filteredProjects = projects.filter((project) => {
    const matchesFilter = filter === 'all' || project.category === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="relative min-h-screen pt-24 pb-20">
      <ParticleField count={20} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              Our Projects
            </span>
          </motion.h1>
          <motion.p
            className="text-xl text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Explore our latest work and creations
          </motion.p>
        </motion.div>

        {/* Search and filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <motion.input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              whileFocus={{ scale: 1.05, boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
              className="pl-12 pr-6 py-3 rounded-full glass focus:outline-none text-primary bg-card"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`px-4 py-2 rounded-full font-medium capitalize ${
                  filter === category
                    ? 'bg-blue-500 text-white'
                    : 'glass hover:bg-blue-500/20 text-primary'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {filteredProjects.map((project) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: 'spring', bounce: 0.4 },
                  },
                }}
                whileHover={{ y: -10, scale: 1.03, rotate: 2 }}
                className="group relative glass rounded-2xl p-6 cursor-pointer overflow-hidden"
              >
                {/* Project icon with one-time spin */}
                <motion.div
                  className="mb-4 text-primary"
                  initial={{ rotate: 0, scale: 0 }}
                  animate={{ rotate: 360, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    type: 'spring',
                  }}
                >
                  <Icon className="w-12 h-12" style={{ color: project.color }} />
                </motion.div>

                {/* Status badge */}
                <motion.span
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${project.color}20`,
                    color: project.color,
                  }}
                >
                  {project.status}
                </motion.span>

                <h3 className="text-xl font-bold mb-2 text-primary">{project.title}</h3>
                <p className="text-secondary mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.2 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at center, ${project.color}20 0%, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;