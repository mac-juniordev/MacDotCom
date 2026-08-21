// ============================================
// PROJECTS MANAGER
// Full CRUD for projects
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  Upload,
  X,
} from 'lucide-react';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
  status: string;
  featured: boolean;
}

const API_URL = 'http://localhost:5000/api';

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    category: 'web',
    status: 'completed',
    featured: false,
  });

  // ============================================
  // FETCH PROJECTS
  // ============================================

const fetchProjects = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProjects(response.data.data);
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  } finally {
    setLoading(false);
  }
};

  // Fetch projects when component mounts
  useEffect(() => {
  let cancelled = false;

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!cancelled) {
        setProjects(response.data.data);
        setLoading(false);
      }
    } catch (error) {
      if (!cancelled) {
        console.error('Failed to fetch projects:', error);
        setLoading(false);
      }
    }
  };

  loadProjects();

  return () => {
    cancelled = true;
  };
}, []);

  // ============================================
  // HANDLE FORM INPUT
  // ============================================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  // ============================================
  // OPEN ADD PROJECT MODAL
  // ============================================

  const handleAddNew = () => {
    setEditingProject(null);

    setFormData({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      category: 'web',
      status: 'completed',
      featured: false,
    });

    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT PROJECT MODAL
  // ============================================

  const handleEdit = (project: Project) => {
    setEditingProject(project);

    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      category: project.category,
      status: project.status,
      featured: project.featured,
    });

    setShowModal(true);
  };

  // ============================================
  // SAVE PROJECT
  // Create or update
  // ============================================

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      const technologies = formData.technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean);

      const projectData = {
        ...formData,
        technologies,
      };

      if (editingProject) {
        await axios.put(
          `${API_URL}/projects/${editingProject._id}`,
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/projects`,
          projectData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setShowModal(false);
      setEditingProject(null);

      await fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  // ============================================
  // DELETE PROJECT
  // ============================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`${API_URL}/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // ============================================
  // TOGGLE FEATURED
  // ============================================

  const handleToggleFeatured = async (project: Project) => {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `${API_URL}/projects/${project._id}/featured`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProjects();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  // ============================================
  // FILTER PROJECTS
  // ============================================

  const filteredProjects = projects.filter((project) =>
    project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Projects Manager
          </h2>

          <p className="text-gray-400">
            Manage your portfolio projects
          </p>
        </div>

        <motion.button
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Project
        </motion.button>
      </div>

      {/* ========================================
          SEARCH
      ======================================== */}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* ========================================
          PROJECTS TABLE
      ======================================== */}

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <Upload className="w-10 h-10 text-gray-600 mx-auto mb-3" />

            <p className="text-gray-400">
              {searchTerm
                ? 'No projects found matching your search.'
                : 'No projects available yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Project
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Category
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Featured
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800">

                {filteredProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >

                    {/* Project */}

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">

                          {project.thumbnail ? (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="w-5 h-5 text-gray-500" />
                          )}

                        </div>

                        <div>
                          <p className="text-white font-medium">
                            {project.title}
                          </p>

                          <p className="text-xs text-gray-400">
                            {project.technologies.join(', ')}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-6 py-4 text-gray-400">
                      {project.category}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'completed'
                            ? 'bg-green-500/20 text-green-500'
                            : project.status === 'in-progress'
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {project.status}
                      </span>

                    </td>

                    {/* Featured */}

                    <td className="px-6 py-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleToggleFeatured(project)
                        }
                        className={`p-1 rounded ${
                          project.featured
                            ? 'text-yellow-500'
                            : 'text-gray-500'
                        } hover:bg-gray-700 transition-colors`}
                        aria-label={
                          project.featured
                            ? 'Remove from featured'
                            : 'Mark as featured'
                        }
                      >
                        <Star
                          className="w-5 h-5"
                          fill={
                            project.featured
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() => handleEdit(project)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          aria-label="Edit project"
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(project._id)
                          }
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          aria-label="Delete project"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ========================================
          ADD / EDIT MODAL
      ======================================== */}

      <AnimatePresence>

        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >

            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
              }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800 max-h-[90vh] overflow-y-auto"
            >

              {/* Modal header */}

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-xl font-bold text-white">
                  {editingProject
                    ? 'Edit Project'
                    : 'Add Project'}
                </h3>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <div className="space-y-4">

                {/* Title */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Project title"
                    required
                  />
                </div>

                {/* Description */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Project description"
                    required
                  />
                </div>

                {/* Technologies */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Technologies (comma separated)
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                {/* URLs */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      GitHub URL
                    </label>

                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Live URL
                    </label>

                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://..."
                    />
                  </div>

                </div>

                {/* Category + Status */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Category
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="web">Web</option>
                      <option value="mobile">Mobile</option>
                      <option value="desktop">Desktop</option>
                      <option value="api">API</option>
                      <option value="fullstack">
                        Full Stack
                      </option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="completed">
                        Completed
                      </option>

                      <option value="in-progress">
                        In Progress
                      </option>

                      <option value="maintenance">
                        Maintenance
                      </option>

                      <option value="archived">
                        Archived
                      </option>
                    </select>
                  </div>

                </div>

                {/* Featured */}

                <div className="flex items-center gap-2">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-green-500"
                  />

                  <label className="text-sm text-gray-400">
                    Featured Project
                  </label>

                </div>

                {/* Modal buttons */}

                <div className="flex gap-4 justify-end mt-6">

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                  >
                    {editingProject
                      ? 'Update'
                      : 'Create'}
                  </button>

                </div>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default ProjectsManager;