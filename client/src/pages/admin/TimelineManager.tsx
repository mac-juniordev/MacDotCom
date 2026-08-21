// ============================================
// TIMELINE MANAGER
// Manage career timeline entries
// React 19 / TypeScript safe
// ============================================

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
} from 'lucide-react';
import axios from 'axios';

// ============================================
// TYPES
// ============================================

interface TimelineEntry {
  _id: string;
  year: string;
  title: string;
  description: string;
  type: string;
}

interface TimelineFormData {
  year: string;
  title: string;
  description: string;
  type: string;
}

interface TimelineResponse {
  data?: TimelineEntry[];
  message?: string;
}

// ============================================
// CONSTANTS
// ============================================

const API_URL = 'http://localhost:5000/api';

const INITIAL_FORM_DATA: TimelineFormData = {
  year: '',
  title: '',
  description: '',
  type: 'milestone',
};

// ============================================
// COMPONENT
// ============================================

const TimelineManager = () => {
  // ============================================
  // STATE
  // ============================================

  const [entries, setEntries] = useState<TimelineEntry[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [editingEntry, setEditingEntry] =
    useState<TimelineEntry | null>(null);

  const [formData, setFormData] =
    useState<TimelineFormData>(INITIAL_FORM_DATA);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState('');

  // ============================================
  // INITIAL FETCH
  //
  // IMPORTANT:
  // We don't call fetchEntries() from the effect.
  // The async function lives inside the effect,
  // which avoids the React effect setState lint
  // warning.
  // ============================================

  useEffect(() => {
    let cancelled = false;

    const loadTimeline = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('token');

        const response = await axios.get<TimelineResponse>(
          `${API_URL}/timeline/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cancelled) {
          return;
        }

        setEntries(response.data.data || []);
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to fetch timeline:',
          error
        );

        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              'Failed to load timeline entries.'
          );
        } else {
          setError(
            'Failed to load timeline entries.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadTimeline();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================
  // FETCH ENTRIES
  //
  // Used after create/update/delete.
  // This is NOT called directly from useEffect.
  // ============================================

  const fetchEntries = async () => {
    try {
      setError('');

      const token = localStorage.getItem('token');

      const response = await axios.get<TimelineResponse>(
        `${API_URL}/timeline/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEntries(response.data.data || []);
    } catch (error: unknown) {
      console.error(
        'Failed to fetch timeline:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to refresh timeline.'
        );
      } else {
        setError('Failed to refresh timeline.');
      }
    }
  };

  // ============================================
  // ADD NEW
  // ============================================

  const handleAddNew = () => {
    setEditingEntry(null);

    setFormData({
      ...INITIAL_FORM_DATA,
    });

    setError('');

    setShowModal(true);
  };

  // ============================================
  // EDIT
  // ============================================

  const handleEdit = (entry: TimelineEntry) => {
    setEditingEntry(entry);

    setFormData({
      year: entry.year,
      title: entry.title,
      description: entry.description,
      type: entry.type,
    });

    setError('');

    setShowModal(true);
  };

  // ============================================
  // CLOSE MODAL
  // ============================================

  const handleCloseModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingEntry(null);

    setFormData({
      ...INITIAL_FORM_DATA,
    });
  };

  // ============================================
  // FORM VALIDATION
  // ============================================

  const validateForm = () => {
    if (!formData.year.trim()) {
      setError('Please enter a year.');
      return false;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title.');
      return false;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description.');
      return false;
    }

    if (!formData.type.trim()) {
      setError('Please select a type.');
      return false;
    }

    return true;
  };

  // ============================================
  // SAVE
  // ============================================

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('token');

      const payload = {
        year: formData.year.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
      };

      if (editingEntry) {
        // ==========================================
        // UPDATE EXISTING ENTRY
        // ==========================================

        await axios.put(
          `${API_URL}/timeline/${editingEntry._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // ==========================================
        // CREATE NEW ENTRY
        // ==========================================

        await axios.post(
          `${API_URL}/timeline`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // ==========================================
      // CLOSE MODAL
      // ==========================================

      setShowModal(false);
      setEditingEntry(null);

      setFormData({
        ...INITIAL_FORM_DATA,
      });

      // ==========================================
      // REFRESH LIST
      // ==========================================

      await fetchEntries();
    } catch (error: unknown) {
      console.error(
        'Failed to save timeline entry:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to save timeline entry.'
        );
      } else {
        setError(
          'Failed to save timeline entry.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Delete this timeline entry?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError('');

      const token = localStorage.getItem('token');

      await axios.delete(
        `${API_URL}/timeline/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ==========================================
      // REMOVE LOCALLY FIRST
      // ==========================================

      setEntries((currentEntries) =>
        currentEntries.filter(
          (entry) => entry._id !== id
        )
      );

      // ==========================================
      // OPTIONAL SERVER REFRESH
      // ==========================================

      await fetchEntries();
    } catch (error: unknown) {
      console.error(
        'Failed to delete timeline entry:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to delete timeline entry.'
        );
      } else {
        setError(
          'Failed to delete timeline entry.'
        );
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================
  // SORT ENTRIES
  // ============================================

  const sortedEntries = [...entries].sort(
    (a, b) => {
      const yearA = parseInt(a.year, 10);
      const yearB = parseInt(b.year, 10);

      if (
        Number.isNaN(yearA) ||
        Number.isNaN(yearB)
      ) {
        return b.year.localeCompare(a.year);
      }

      return yearB - yearA;
    }
  );

  // ============================================
  // TYPE COLOR
  // ============================================

  const getTypeClasses = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-500/20 text-yellow-500';

      case 'experience':
        return 'bg-blue-500/20 text-blue-500';

      case 'education':
        return 'bg-purple-500/20 text-purple-500';

      case 'milestone':
      default:
        return 'bg-green-500/20 text-green-500';
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Timeline Manager
          </h2>

          <p className="text-gray-400">
            Manage your career milestones
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />

          <p className="text-gray-400 mt-4">
            Loading timeline...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Timeline Manager
          </h2>

          <p className="text-gray-400">
            Manage your career milestones
          </p>
        </div>

        <motion.button
          type="button"
          onClick={handleAddNew}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />

          Add Entry
        </motion.button>
      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-center justify-between gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-sm text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-300"
            aria-label="Close error"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ==========================================
          EMPTY STATE
      ========================================== */}

      {sortedEntries.length === 0 ? (
        <div className="bg-gray-900 rounded-2xl p-12 border border-gray-800 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
            <Plus className="w-7 h-7 text-green-500" />
          </div>

          <h3 className="text-lg font-semibold text-white">
            No timeline entries
          </h3>

          <p className="text-gray-500 text-sm mt-2">
            Add your first career milestone to get started.
          </p>

          <button
            type="button"
            onClick={handleAddNew}
            className="mt-5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
          >
            Add First Entry
          </button>
        </div>
      ) : (
        /* ==========================================
           TIMELINE LIST
        ========================================== */

        <div className="space-y-4">
          {sortedEntries.map((entry, index) => (
            <motion.div
              key={entry._id}
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex items-center gap-6"
            >
              {/* ====================================
                  YEAR
              ==================================== */}

              <div className="text-center min-w-[80px]">
                <motion.span
                  className="text-2xl font-black text-green-500"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {entry.year}
                </motion.span>
              </div>

              {/* ====================================
                  VERTICAL LINE
              ==================================== */}

              <div className="w-px h-16 bg-gray-800 flex-shrink-0" />

              {/* ====================================
                  CONTENT
              ==================================== */}

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white">
                  {entry.title}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {entry.description}
                </p>

                <span
                  className={`inline-block mt-2 px-2 py-1 rounded-full text-xs capitalize ${getTypeClasses(
                    entry.type
                  )}`}
                >
                  {entry.type}
                </span>
              </div>

              {/* ====================================
                  ACTIONS
              ==================================== */}

              <div className="flex gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(entry)
                  }
                  disabled={deletingId === entry._id}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={`Edit ${entry.title}`}
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(entry._id)
                  }
                  disabled={
                    deletingId === entry._id
                  }
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                  aria-label={`Delete ${entry.title}`}
                >
                  {deletingId === entry._id ? (
                    <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-500" />
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ==========================================
          ADD / EDIT MODAL
      ========================================== */}

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
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
              onClick={(event) =>
                event.stopPropagation()
              }
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-800 max-h-[90vh] overflow-y-auto"
            >
              {/* ====================================
                  MODAL HEADER
              ==================================== */}

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingEntry
                    ? 'Edit Entry'
                    : 'Add Entry'}
                </h3>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="text-gray-400 hover:text-white disabled:opacity-50"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ====================================
                  FORM
              ==================================== */}

              <div className="space-y-4">
                {/* YEAR */}

                <div>
                  <label
                    htmlFor="timeline-year"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Year
                  </label>

                  <input
                    id="timeline-year"
                    type="text"
                    value={formData.year}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        year: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="2024"
                    maxLength={4}
                    disabled={saving}
                  />
                </div>

                {/* TITLE */}

                <div>
                  <label
                    htmlFor="timeline-title"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Title
                  </label>

                  <input
                    id="timeline-title"
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Started my career"
                    disabled={saving}
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label
                    htmlFor="timeline-description"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Description
                  </label>

                  <textarea
                    id="timeline-description"
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        description:
                          event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Describe this milestone..."
                    disabled={saving}
                  />
                </div>

                {/* TYPE */}

                <div>
                  <label
                    htmlFor="timeline-type"
                    className="block text-sm text-gray-400 mb-2"
                  >
                    Type
                  </label>

                  <select
                    id="timeline-type"
                    value={formData.type}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        type: event.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={saving}
                  >
                    <option value="milestone">
                      Milestone
                    </option>

                    <option value="experience">
                      Experience
                    </option>

                    <option value="education">
                      Education
                    </option>

                    <option value="achievement">
                      Achievement
                    </option>
                  </select>
                </div>

                {/* ==================================
                    BUTTONS
                ================================== */}

                <div className="flex gap-4 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}

                    {saving
                      ? editingEntry
                        ? 'Updating...'
                        : 'Creating...'
                      : editingEntry
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

export default TimelineManager;