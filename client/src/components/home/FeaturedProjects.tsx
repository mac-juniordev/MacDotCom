// ============================================
// FEATURED PROJECTS COMPONENT
// Display featured projects with animations
// ============================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  status: string;
}

const FeaturedProjects = () => {
  const projects: Project[] = [
    {
      id: 1,
      title: 'TradeMirror',
      description:
        'Real-time trading analytics platform with AI predictions',
      image: '/projects/trademirror.jpg',
      technologies: ['React', 'Node.js', 'MongoDB'],
      status: 'Live',
    },
    {
      id: 2,
      title: 'Chronova',
      description:
        'Time management and productivity suite for teams',
      image: '/projects/chronova.jpg',
      technologies: ['TypeScript', 'Express', 'PostgreSQL'],
      status: 'Beta',
    },
    {
      id: 3,
      title: 'PathMind',
      description:
        'AI-powered learning path generator for developers',
      image: '/projects/pathmind.jpg',
      technologies: ['Next.js', 'Python', 'TensorFlow'],
      status: 'Development',
    },
  ];

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ============================================ */}
        {/* Section Header */}
        {/* ============================================ */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-black mb-4"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-400"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Some of our best work
          </motion.p>
        </motion.div>

        {/* ============================================ */}
        {/* Projects Grid */}
        {/* ============================================ */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                y: 100,
                rotateX: -30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotateX: 0,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: 'spring',
                bounce: 0.3,
              }}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
              className="group relative glass rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* ============================================ */}
              {/* Project Image / Visual */}
              {/* ============================================ */}

              <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-green-500/20 overflow-hidden">

                {/* Rotating Rocket */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center text-6xl"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  🚀
                </motion.div>

                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* ============================================ */}
              {/* Content */}
              {/* ============================================ */}

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">

                  {/* Project Title */}
                  <h3 className="text-xl font-bold">
                    {project.title}
                  </h3>

                  {/* Project Status */}
                  <motion.span
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-500"
                    animate={{
                      scale: [1, 1.08, 1],
                      opacity: [0.8, 1, 0.8],
                      boxShadow: [
                        '0 0 0px rgba(34, 197, 94, 0)',
                        '0 0 12px rgba(34, 197, 94, 0.35)',
                        '0 0 0px rgba(34, 197, 94, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {project.status}
                  </motion.span>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>

                {/* ============================================ */}
                {/* Technologies */}
                {/* ============================================ */}

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <motion.span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                      initial={{
                        opacity: 0,
                        scale: 0,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        delay: index * 0.2 + techIndex * 0.1,
                      }}
                      whileHover={{
                        scale: 1.2,
                        rotate: 360,
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* ============================================ */}
                {/* View Project Link */}
                {/* ============================================ */}

                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                  View Project

                  <motion.span
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>

              {/* ============================================ */}
              {/* Hover Border Glow */}
              {/* ============================================ */}

              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  border: '2px solid rgba(59, 130, 246, 0.5)',
                  boxShadow:
                    '0 0 30px rgba(59, 130, 246, 0.3)',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;