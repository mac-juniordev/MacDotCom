// ============================================
// PROJECTS PAGE - CONNECTED TO API
// Fetches real projects from backend
// ============================================

import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import { Search, FolderKanban, ExternalLink } from 'lucide-react';
import ParticleField from '../components/effects/ParticleField';
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

const CATEGORIES = [
  'all',
  'web',
  'mobile',
  'desktop',
  'api',
  'fullstack',
  'other',
];

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await axios.get<ProjectsResponse>(
          `${API_URL}/projects`,
          {
            params: {
              limit: 50,
            },
          }
        );

        setProjects(response.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setProjects([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getThumbnailUrl = (thumbnail?: string) => {
    if (!thumbnail) {
      return '';
    }

    // Thumbnail is already an absolute URL.
    if (/^https?:\/\//i.test(thumbnail)) {
      return thumbnail;
    }

    return `${BACKEND_URL}/${thumbnail.replace(/^\/+/, '')}`;
  };

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const category = (project.category || 'other').toLowerCase();

      const matchesFilter =
        filter === 'all' || category === filter.toLowerCase();

      if (!normalizedSearch) {
        return matchesFilter;
      }

      const title = (project.title || '').toLowerCase();
      const description = (project.description || '').toLowerCase();
      const technologies = (project.technologies || [])
        .join(' ')
        .toLowerCase();

      const matchesSearch =
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        technologies.includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [projects, filter, searchTerm]);

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
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              Our Projects
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
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="pl-12 pr-6 py-3 rounded-full glass focus:outline-none focus:ring-2 focus:ring-blue-500 text-primary bg-card w-full sm:w-64"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((category) => (
              <motion.button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                }}
                whileTap={{ scale: 0.95 }}
                aria-pressed={filter === category}
                className={`px-4 py-2 rounded-full font-medium capitalize transition-colors ${
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
              aria-label="Loading projects"
            />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20">
            <FolderKanban className="w-16 h-16 text-red-400 mx-auto mb-4" />

            <h2 className="text-xl font-semibold text-primary mb-2">
              Unable to load projects
            </h2>

            <p className="text-secondary">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <p className="text-secondary">
              {searchTerm.trim() || filter !== 'all'
                ? 'No projects found matching your filters.'
                : 'No projects available yet.'}
            </p>

            {(searchTerm.trim() || filter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                className="mt-4 px-5 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && filteredProjects.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {
                opacity: 0,
              },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filteredProjects.map((project) => {
              const technologies = project.technologies || [];
              const thumbnailUrl = getThumbnailUrl(project.thumbnail);

              return (
                <motion.div
                  key={project._id}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 50,
                      scale: 0.8,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        bounce: 0.4,
                      },
                    },
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    rotate: 1,
                  }}
                  className="group relative glass rounded-2xl overflow-hidden"
                >
                  {/* Thumbnail */}
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

                    {/* Thumbnail overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-primary line-clamp-1">
                        {project.title}
                      </h3>

                      {project.status && (
                        <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 capitalize">
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
                        {technologies.slice(0, 5).map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500"
                          >
                            {tech}
                          </span>
                        ))}

                        {technologies.length > 5 && (
                          <span className="px-3 py-1 rounded-full text-xs bg-gray-500/10 text-gray-500">
                            +{technologies.length - 5} more
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

                  {/* Hover glow */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)',
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;

