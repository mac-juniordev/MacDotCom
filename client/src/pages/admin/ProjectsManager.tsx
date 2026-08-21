import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Star,
  Upload,
  X,
  Image as ImageIcon,
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

interface ProjectFormData {
  title: string;
  description: string;
  technologies: string;
  githubUrl: string;
  liveUrl: string;
  category: string;
  status: string;
  featured: boolean;
}

const SERVER_URL = 'http://localhost:5000';
const API_URL = `${SERVER_URL}/api`;

const ProjectsManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] =
    useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [formData, setFormData] =
    useState<ProjectFormData>({
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

      const response = await axios.get(
        `${API_URL}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.data || []);
    } catch (error: unknown) {
      console.error(
        'Failed to fetch projects:',
        error
      );

      if (axios.isAxiosError(error)) {
        console.error(
          'Server response:',
          error.response?.data
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // FETCH ON COMPONENT MOUNT
  // ============================================

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `${API_URL}/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setProjects(response.data.data || []);
        }
      } catch (error: unknown) {
        if (!cancelled) {
          console.error(
            'Failed to fetch projects:',
            error
          );

          if (axios.isAxiosError(error)) {
            console.error(
              'Server response:',
              error.response?.data
            );
          }
        }
      } finally {
        if (!cancelled) {
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
      HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
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
  // HANDLE THUMBNAIL UPLOAD
  // ============================================

  const handleThumbnailChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');

      e.target.value = '';

      return;
    }

    // Check file size - 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB.');

      e.target.value = '';

      return;
    }

    // Revoke previous preview URL
    if (
      thumbnailPreview &&
      thumbnailPreview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailFile(file);

    const previewUrl = URL.createObjectURL(file);

    setThumbnailPreview(previewUrl);
  };

  // ============================================
  // REMOVE THUMBNAIL
  // ============================================

  const handleRemoveThumbnail = () => {
    if (
      thumbnailPreview &&
      thumbnailPreview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailFile(null);
    setThumbnailPreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    if (isSubmitting) return;

    if (
      thumbnailPreview &&
      thumbnailPreview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setShowModal(false);
    setEditingProject(null);
    setThumbnailFile(null);
    setThumbnailPreview('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================
  // OPEN ADD PROJECT MODAL
  // ============================================

  const handleAddNew = () => {
    setEditingProject(null);
    setThumbnailFile(null);
    setThumbnailPreview('');

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

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT PROJECT MODAL
  // ============================================

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setThumbnailFile(null);

    setThumbnailPreview(project.thumbnail || '');

    setFormData({
      title: project.title || '',
      description: project.description || '',
      technologies:
        project.technologies?.join(', ') || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      category: project.category || 'web',
      status: project.status || 'completed',
      featured: Boolean(project.featured),
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setShowModal(true);
  };

  // ============================================
  // SAVE PROJECT
  // CREATE OR UPDATE
  // ============================================

  const handleSave = async () => {
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a project title.');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter a project description.');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');

      const technologies = formData.technologies
        .split(',')
        .map((technology) => technology.trim())
        .filter(Boolean);

      // Create FormData
      const formDataToSend = new FormData();

      formDataToSend.append(
        'title',
        formData.title.trim()
      );

      formDataToSend.append(
        'description',
        formData.description.trim()
      );

      formDataToSend.append(
        'technologies',
        JSON.stringify(technologies)
      );

      if (formData.githubUrl.trim()) {
        formDataToSend.append(
          'githubUrl',
          formData.githubUrl.trim()
        );
      }

      if (formData.liveUrl.trim()) {
        formDataToSend.append(
          'liveUrl',
          formData.liveUrl.trim()
        );
      }

      formDataToSend.append(
        'category',
        formData.category
      );

      formDataToSend.append(
        'status',
        formData.status
      );

      formDataToSend.append(
        'featured',
        String(formData.featured)
      );

      // Add thumbnail if selected
      if (thumbnailFile) {
        formDataToSend.append(
          'thumbnail',
          thumbnailFile
        );
      }

      if (editingProject) {
        // UPDATE
        await axios.put(
          `${API_URL}/projects/${editingProject._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let Axios set the multipart boundary automatically.
            },
          }
        );
      } else {
        // CREATE
        await axios.post(
          `${API_URL}/projects`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Close modal
      if (
        thumbnailPreview &&
        thumbnailPreview.startsWith('blob:')
      ) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      setShowModal(false);
      setEditingProject(null);
      setThumbnailFile(null);
      setThumbnailPreview('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh projects
      await fetchProjects();
    } catch (error: unknown) {
      console.error(
        'Failed to save project:',
        error
      );

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to save project. Please try again.';

        alert(message);
      } else if (error instanceof Error) {
        alert(
          error.message ||
            'Failed to save project. Please try again.'
        );
      } else {
        alert(
          'Failed to save project. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
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

      await axios.delete(
        `${API_URL}/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchProjects();
    } catch (error: unknown) {
      console.error(
        'Failed to delete project:',
        error
      );

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            'Failed to delete project.'
        );
      } else {
        alert('Failed to delete project.');
      }
    }
  };

  // ============================================
  // TOGGLE FEATURED
  // ============================================

  const handleToggleFeatured = async (
    project: Project
  ) => {
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
    } catch (error: unknown) {
      console.error(
        'Failed to toggle featured:',
        error
      );

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            'Failed to update featured status.'
        );
      } else {
        alert(
          'Failed to update featured status.'
        );
      }
    }
  };

  // ============================================
  // FILTER PROJECTS
  // ============================================

  const filteredProjects = projects.filter(
    (project) => {
      const search = searchTerm.toLowerCase();

      return (
        project.title
          ?.toLowerCase()
          .includes(search) ||
        project.category
          ?.toLowerCase()
          .includes(search) ||
        project.technologies?.some(
          (technology) =>
            technology
              .toLowerCase()
              .includes(search)
        )
      );
    }
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

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
          type="button"
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />

          Add Project
        </motion.button>
      </div>

      {/* SEARCH */}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          placeholder="Search projects..."
          className="w-full pl-12 pr-4 py-3 bg-gray-900 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* PROJECTS TABLE */}

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
                {filteredProjects.map(
                  (project) => (
                    <tr
                      key={project._id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      {/* PROJECT */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                            {project.thumbnail ? (
                              <img
                                src={`${SERVER_URL}${project.thumbnail}`}
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
                              {project.technologies?.join(
                                ', '
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4 text-gray-400">
                        {project.category}
                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            project.status ===
                            'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : project.status ===
                                'in-progress'
                              ? 'bg-blue-500/20 text-blue-500'
                              : 'bg-yellow-500/20 text-yellow-500'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>

                      {/* FEATURED */}

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleFeatured(
                              project
                            )
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

                      {/* ACTIONS */}

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(project)
                            }
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Edit project"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                project._id
                              )
                            }
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Delete project"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleCloseModal}
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
              onClick={(e) =>
                e.stopPropagation()
              }
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800 max-h-[90vh] overflow-y-auto"
            >
              {/* MODAL HEADER */}

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingProject
                    ? 'Edit Project'
                    : 'Add Project'}
                </h3>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* THUMBNAIL */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Thumbnail
                  </label>

                  {thumbnailPreview ||
                  editingProject?.thumbnail ? (
                    <div className="relative">
                      <img
                        src={
                          thumbnailPreview?.startsWith(
                            'blob:'
                          )
                            ? thumbnailPreview
                            : `${SERVER_URL}${
                                thumbnailPreview ||
                                editingProject?.thumbnail ||
                                ''
                              }`
                        }
                        alt="Thumbnail preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />

                      <button
                        type="button"
                        onClick={
                          handleRemoveThumbnail
                        }
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                        aria-label="Remove thumbnail"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-green-500 transition-colors"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-600" />

                      <span className="text-gray-400">
                        Click to upload thumbnail
                      </span>

                      <span className="text-xs text-gray-500">
                        PNG, JPG, WEBP (max 5MB)
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={
                      handleThumbnailChange
                    }
                    className="hidden"
                  />
                </div>

                {/* TITLE */}

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

                {/* DESCRIPTION */}

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

                {/* TECHNOLOGIES */}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Technologies (comma separated)
                  </label>

                  <input
                    type="text"
                    name="technologies"
                    value={
                      formData.technologies
                    }
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                {/* URLS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      GitHub URL (optional)
                    </label>

                    <input
                      type="url"
                      name="githubUrl"
                      value={
                        formData.githubUrl
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Live URL (optional)
                    </label>

                    <input
                      type="url"
                      name="liveUrl"
                      value={
                        formData.liveUrl
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* CATEGORY + STATUS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Category
                    </label>

                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleInputChange
                      }
                      className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="web">
                        Web
                      </option>

                      <option value="mobile">
                        Mobile
                      </option>

                      <option value="desktop">
                        Desktop
                      </option>

                      <option value="api">
                        API
                      </option>

                      <option value="fullstack">
                        Full Stack
                      </option>

                      <option value="other">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Status
                    </label>

                    <select
                      name="status"
                      value={
                        formData.status
                      }
                      onChange={
                        handleInputChange
                      }
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

                {/* FEATURED */}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleInputChange
                    }
                    className="w-4 h-4 accent-green-500"
                  />

                  <label className="text-sm text-gray-400">
                    Featured Project
                  </label>
                </div>

                {/* MODAL BUTTONS */}

                <div className="flex gap-4 justify-end mt-6">
                  <button
                    type="button"
                    onClick={
                      handleCloseModal
                    }
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                        Saving...
                      </>
                    ) : editingProject ? (
                      'Update'
                    ) : (
                      'Create'
                    )}
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