// ============================================
// SKILLS MANAGER
// Manage technical skills
// ============================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  X,
  GripVertical,
} from 'lucide-react';
import axios from 'axios';

interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  order: number;
}

interface SkillFormData {
  name: string;
  category: string;
  proficiency: number;
}

const API_URL = 'http://localhost:5000/api';

const DEFAULT_FORM_DATA: SkillFormData = {
  name: '',
  category: 'frontend',
  proficiency: 80,
};

const SkillsManager = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] =
    useState<Skill | null>(null);

  const [formData, setFormData] =
    useState<SkillFormData>(DEFAULT_FORM_DATA);

  // ============================================
  // FETCH SKILLS
  // ============================================

  useEffect(() => {
    let mounted = true;

    const loadSkills = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `${API_URL}/skills/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (mounted) {
          setSkills(response.data?.data ?? []);
        }
      } catch (error) {
        console.error(
          'Failed to fetch skills:',
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadSkills();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // OPEN ADD MODAL
  // ============================================

  const handleAddNew = () => {
    setEditingSkill(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
    });
    setShowModal(true);
  };

  // ============================================
  // OPEN EDIT MODAL
  // ============================================

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);

    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
    });

    setShowModal(true);
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingSkill(null);

    setFormData({
      ...DEFAULT_FORM_DATA,
    });
  };

  // ============================================
  // SAVE SKILL
  // ============================================

  const handleSave = async () => {
    if (!formData.name.trim()) {
      window.alert('Please enter a skill name.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        proficiency: formData.proficiency,
      };

      if (editingSkill) {
        await axios.put(
          `${API_URL}/skills/${editingSkill._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/skills`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Refresh the list after saving.
      const response = await axios.get(
        `${API_URL}/skills/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSkills(response.data?.data ?? []);

      setShowModal(false);
      setEditingSkill(null);

      setFormData({
        ...DEFAULT_FORM_DATA,
      });
    } catch (error) {
      console.error(
        'Failed to save skill:',
        error
      );

      window.alert(
        'Failed to save skill. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE SKILL
  // ============================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Delete this skill? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `${API_URL}/skills/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSkills((previousSkills) =>
        previousSkills.filter(
          (skill) => skill._id !== id
        )
      );
    } catch (error) {
      console.error(
        'Failed to delete skill:',
        error
      );

      window.alert(
        'Failed to delete skill. Please try again.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================
  // SORT SKILLS
  // ============================================

  const sortedSkills = [...skills].sort(
    (a, b) => a.order - b.order
  );

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">

      {/* ============================================
          HEADER
      ============================================ */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Skills Manager
          </h2>

          <p className="text-gray-400">
            Manage your technical skills
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
          Add Skill
        </motion.button>
      </div>

      {/* ============================================
          SKILLS GRID
      ============================================ */}

      {sortedSkills.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-10 border border-gray-800 text-center">
          <p className="text-gray-400 mb-4">
            No skills found.
          </p>

          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedSkills.map((skill) => (
            <motion.div
              key={skill._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              {/* Skill header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <GripVertical className="w-5 h-5 text-gray-500 flex-shrink-0" />

                  <h3 className="text-lg font-bold text-white truncate">
                    {skill.name}
                  </h3>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(skill)
                    }
                    disabled={
                      deletingId === skill._id
                    }
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    aria-label={`Edit ${skill.name}`}
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(skill._id)
                    }
                    disabled={
                      deletingId === skill._id
                    }
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    aria-label={`Delete ${skill.name}`}
                  >
                    {deletingId === skill._id ? (
                      <motion.div
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full"
                      />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-full text-xs bg-gray-800 text-gray-400 capitalize">
                  {skill.category}
                </span>
              </div>

              {/* Proficiency */}
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Proficiency
                </span>

                <span className="text-sm font-medium text-green-500">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Proficiency bar */}
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-green-500 rounded-full"
                  initial={{
                    width: 0,
                  }}
                  animate={{
                    width: `${skill.proficiency}%`,
                  }}
                  transition={{
                    duration: 1,
                    ease: 'easeOut',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ============================================
          MODAL
      ============================================ */}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(event) => {
              if (
                event.target === event.currentTarget
              ) {
                handleCloseModal();
              }
            }}
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
              transition={{
                type: 'spring',
                bounce: 0.3,
              }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800 shadow-2xl"
            >

              {/* Modal header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingSkill
                    ? 'Edit Skill'
                    : 'Add Skill'}
                </h3>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4">

                {/* Name */}
                <div>
                  <label
                    htmlFor="skill-name"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Name
                  </label>

                  <input
                    id="skill-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData(
                        (previousData) => ({
                          ...previousData,
                          name: e.target.value,
                        })
                      )
                    }
                    placeholder="e.g. React"
                    disabled={saving}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="skill-category"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Category
                  </label>

                  <select
                    id="skill-category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData(
                        (previousData) => ({
                          ...previousData,
                          category:
                            e.target.value,
                        })
                      )
                    }
                    disabled={saving}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <option value="frontend">
                      Frontend
                    </option>

                    <option value="backend">
                      Backend
                    </option>

                    <option value="database">
                      Database
                    </option>

                    <option value="devops">
                      DevOps
                    </option>

                    <option value="tools">
                      Tools
                    </option>

                    <option value="languages">
                      Languages
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                {/* Proficiency */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="skill-proficiency"
                      className="block text-sm text-gray-400"
                    >
                      Proficiency
                    </label>

                    <span className="text-sm font-semibold text-green-500">
                      {formData.proficiency}%
                    </span>
                  </div>

                  <input
                    id="skill-proficiency"
                    type="range"
                    min="0"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) =>
                      setFormData(
                        (previousData) => ({
                          ...previousData,
                          proficiency:
                            Number(
                              e.target.value
                            ),
                        })
                      )
                    }
                    disabled={saving}
                    className="w-full accent-green-500 disabled:opacity-50"
                  />

                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={
                      saving ||
                      !formData.name.trim()
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <motion.div
                          animate={{
                            rotate: 360,
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />

                        Saving...
                      </>
                    ) : editingSkill ? (
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

export default SkillsManager;