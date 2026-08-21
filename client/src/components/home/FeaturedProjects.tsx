// ============================================
// FEATURED PROJECTS - CONNECTED TO API
// Fetches real projects from backend
// ============================================

import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import {ExternalLink, FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  technologies?: string[];
  githubUrl?: string;
  liveUrl?: string;
  category?: string;
  status?: string;
  featured?: boolean;
}

interface ProjectsResponse {
  data?: Project[];
}

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000/api';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') ||
  'http://localhost:5000';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(false);

      try {
        // First try featured projects.
        const featuredResponse = await axios.get<ProjectsResponse>(
          `${API_URL}/projects`,
          {
            params: {
              featured: true,
              limit: 6,
            },
          }
        );

        const featuredProjects = featuredResponse.data?.data || [];

        if (featuredProjects.length > 0) {
          setProjects(featuredProjects);
          return;
        }

        // If there are no featured projects, fall back to all projects.
        const allResponse = await axios.get<ProjectsResponse>(
          `${API_URL}/projects`,
          {
            params: {
              limit: 6,
            },
          }
        );

        setProjects(allResponse.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError(true);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getThumbnailUrl = (thumbnail?: string) => {
    if (!thumbnail) return '';

    // Already an absolute URL.
    if (/^https?:\/\//i.test(thumbnail)) {
      return thumbnail;
    }

    // Make sure there is exactly one slash.
    return `${BACKEND_URL}/${thumbnail.replace(/^\/+/, '')}`;
  };

  const getStatusClasses = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';

      case 'in-progress':
      case 'in progress':
        return 'bg-blue-500/20 text-blue-500';

      default:
        return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-4xl sm:text-5xl font-black mb-4 text-primary"
            animate={{ scale: [1, 1.02, 1] }}
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
            className="text-secondary"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Some of our best work
          </motion.p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Error / empty state */}
        {!loading && (error || projects.length === 0) && (
          <div className="text-center py-20">
            <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              {error
                ? 'Unable to load projects right now.'
                : 'No projects available yet.'}
            </p>
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const technologies = project.technologies || [];
              const thumbnailUrl = getThumbnailUrl(project.thumbnail);

              return (
                <motion.div
                  key={project._id}
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
                    delay: index * 0.1,
                    type: 'spring',
                    bounce: 0.3,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                  }}
                  className="group relative glass rounded-2xl overflow-hidden"
                >
                  {/* Project thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500/20 to-green-500/20 overflow-hidden">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={`${project.title} thumbnail`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FolderKanban className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: 'linear',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-primary line-clamp-1">
                        {project.title}
                      </h3>

                      {project.status && (
                        <span
                          className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      )}
                    </div>

                    <p className="text-secondary mb-4 line-clamp-2">
                      {project.description || 'No description available.'}
                    </p>

                    {/* Technologies */}
                    {technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                          >
                            {tech}
                          </span>
                        ))}

                        {technologies.length > 3 && (
                          <span className="px-3 py-1 rounded-full text-xs bg-gray-500/10 text-gray-500">
                            +{technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    {(project.githubUrl || project.liveUrl) && (
                      <div className="flex gap-4">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${project.title} on GitHub`}
                            className="text-secondary hover:text-primary transition-colors"
                          >
                            <FaGithub className="w-5 h-5" />
                          </a>
                        )}

                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View live ${project.title}`}
                            className="text-secondary hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hover border glow */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      border: '2px solid rgba(59, 130, 246, 0.5)',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
                    }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;

