import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Archive,
  X,
} from 'lucide-react';
import axios from 'axios';

// ============================================
// TYPES
// ============================================

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  reply?: string;
  createdAt: string;
}

// ============================================
// API
// ============================================

const API_URL = 'http://localhost:5000/api';

// ============================================
// MESSAGES MANAGER
// ============================================

const MessagesManager = () => {
  // ============================================
  // STATE
  // ============================================

  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<Message | null>(null);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [filter, setFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // ============================================
  // FETCH MESSAGES
  // ============================================

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${API_URL}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data?.data || []);
    } catch (error: unknown) {
      console.error('Failed to fetch messages:', error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to load messages.'
        );
      } else {
        setError('Failed to load messages.');
      }
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get(
          `${API_URL}/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!cancelled) {
          setMessages(response.data?.data || []);
          setError('');
        }
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to fetch messages:',
          error
        );

        if (axios.isAxiosError(error)) {
          setError(
            error.response?.data?.message ||
              'Failed to load messages.'
          );
        } else {
          setError('Failed to load messages.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================
  // MARK MESSAGE AS READ
  // ============================================

  const handleMarkRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `${API_URL}/messages/${id}/status`,
        {
          status: 'read',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update UI immediately
      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === id
            ? {
                ...message,
                status: 'read',
              }
            : message
        )
      );

      setSelectedMessage((current) =>
        current && current._id === id
          ? {
              ...current,
              status: 'read',
            }
          : current
      );
    } catch (error: unknown) {
      console.error(
        'Failed to mark as read:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to mark message as read.'
        );
      } else {
        setError(
          'Failed to mark message as read.'
        );
      }
    }
  };

  // ============================================
  // ARCHIVE MESSAGE
  // ============================================

  const handleArchive = async (id: string) => {
    try {
      const token = localStorage.getItem('token');

      await axios.patch(
        `${API_URL}/messages/${id}/status`,
        {
          status: 'archived',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchMessages();

      setSelectedMessage(null);
    } catch (error: unknown) {
      console.error(
        'Failed to archive message:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to archive message.'
        );
      } else {
        setError('Failed to archive message.');
      }
    }
  };

  // ============================================
  // DELETE MESSAGE
  // ============================================

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Delete this message?'
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.delete(
        `${API_URL}/messages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((currentMessages) =>
        currentMessages.filter(
          (message) => message._id !== id
        )
      );

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
        setShowReply(false);
        setReplyText('');
      }
    } catch (error: unknown) {
      console.error(
        'Failed to delete message:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to delete message.'
        );
      } else {
        setError('Failed to delete message.');
      }
    }
  };

  // ============================================
  // REPLY TO MESSAGE
  // ============================================

  const handleReply = async () => {
    if (!selectedMessage) {
      return;
    }

    if (!replyText.trim()) {
      setError(
        'Please enter a reply before sending.'
      );
      return;
    }

    try {
      setSaving(true);
      setError('');

      const token = localStorage.getItem('token');

      await axios.post(
        `${API_URL}/messages/${selectedMessage._id}/reply`,
        {
          reply: replyText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowReply(false);
      setReplyText('');

      await fetchMessages();

      setSelectedMessage(null);
    } catch (error: unknown) {
      console.error(
        'Failed to send reply:',
        error
      );

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            'Failed to send reply.'
        );
      } else {
        setError('Failed to send reply.');
      }
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // OPEN MESSAGE
  // ============================================

  const handleOpenMessage = (
    message: Message
  ) => {
    setSelectedMessage(message);

    if (message.status === 'unread') {
      void handleMarkRead(message._id);
    }
  };

  // ============================================
  // FILTER MESSAGES
  // ============================================

  const filteredMessages = messages.filter(
    (message) => {
      if (filter === 'all') {
        return true;
      }

      return message.status === filter;
    }
  );

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{
            rotate: 360,
          }}
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

      <div>
        <h2 className="text-2xl font-bold text-white">
          Messages Manager
        </h2>

        <p className="text-gray-400">
          View and manage contact messages
        </p>
      </div>

      {/* ============================================
          ERROR
      ============================================ */}

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
          className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <p className="text-sm text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ============================================
          FILTERS
      ============================================ */}

      <div className="flex flex-wrap gap-2">
        {[
          'all',
          'unread',
          'read',
          'replied',
          'archived',
        ].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === status
                ? 'bg-green-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ============================================
          MESSAGE COUNT
      ============================================ */}

      <div className="text-sm text-gray-500">
        Showing {filteredMessages.length}{' '}
        {filteredMessages.length === 1
          ? 'message'
          : 'messages'}
      </div>

      {/* ============================================
          MESSAGES LIST
      ============================================ */}

      <div className="space-y-4">

        {filteredMessages.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-10 border border-gray-800 text-center">
            <Mail className="w-10 h-10 text-gray-600 mx-auto mb-3" />

            <h3 className="text-white font-medium">
              No messages found
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              There are no messages matching this filter.
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <motion.div
              key={message._id}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              whileHover={{
                y: -2,
              }}
              transition={{
                duration: 0.2,
              }}
              className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 cursor-pointer hover:border-gray-700 transition-colors ${
                message.status === 'unread'
                  ? 'border-l-4 border-l-green-500'
                  : ''
              }`}
              onClick={() =>
                handleOpenMessage(message)
              }
            >
              {/* Message header */}

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3 min-w-0">

                  {message.status === 'unread' ? (
                    <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <MailOpen className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}

                  <div className="min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {message.name}
                    </h3>

                    <p className="text-sm text-gray-400 truncate">
                      {message.email}
                    </p>
                  </div>

                </div>

                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(
                    message.createdAt
                  ).toLocaleDateString()}
                </span>

              </div>

              {/* Subject */}

              <p className="text-gray-300 mt-3 font-medium">
                {message.subject}
              </p>

              {/* Message preview */}

              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {message.message}
              </p>

              {/* Status */}

              <div className="mt-4">
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs capitalize ${
                    message.status === 'unread'
                      ? 'bg-green-500/10 text-green-500'
                      : message.status === 'replied'
                      ? 'bg-blue-500/10 text-blue-500'
                      : message.status === 'archived'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {message.status}
                </span>
              </div>
            </motion.div>
          ))
        )}

      </div>

      {/* ============================================
          MESSAGE DETAIL MODAL
      ============================================ */}

      <AnimatePresence>
        {selectedMessage && (
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
            onClick={() =>
              setSelectedMessage(null)
            }
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
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800"
            >

              {/* Modal header */}

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-xl font-bold text-white">
                  Message Details
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedMessage(null)
                  }
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* Message details */}

              <div className="space-y-5">

                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    From
                  </p>

                  <p className="text-white">
                    {selectedMessage.name}
                  </p>

                  <p className="text-gray-400 text-sm">
                    {selectedMessage.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Subject
                  </p>

                  <p className="text-white">
                    {selectedMessage.subject}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">
                    Date
                  </p>

                  <p className="text-white">
                    {new Date(
                      selectedMessage.createdAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">
                    Message
                  </p>

                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-white whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Existing reply */}

                {selectedMessage.reply && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-400 mb-2">
                      Your Reply
                    </p>

                    <p className="text-white whitespace-pre-wrap">
                      {selectedMessage.reply}
                    </p>
                  </div>
                )}

              </div>

              {/* Actions */}

              <div className="flex flex-wrap gap-2 mt-6">

                <button
                  type="button"
                  onClick={() => {
                    setReplyText('');
                    setShowReply(true);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleArchive(
                      selectedMessage._id
                    )
                  }
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      selectedMessage._id
                    )
                  }
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================
          REPLY MODAL
      ============================================ */}

      <AnimatePresence>
        {showReply && selectedMessage && (
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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
            onClick={() =>
              setShowReply(false)
            }
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
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-800"
            >

              {/* Reply header */}

              <div className="flex justify-between items-center mb-6">

                <div>
                  <h3 className="text-xl font-bold text-white">
                    Reply to {selectedMessage.name}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {selectedMessage.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowReply(false)
                  }
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* Subject */}

              <div className="mb-4 bg-gray-800 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">
                  Subject
                </p>

                <p className="text-sm text-gray-300">
                  {selectedMessage.subject}
                </p>
              </div>

              {/* Reply textarea */}

              <textarea
                value={replyText}
                onChange={(event) =>
                  setReplyText(event.target.value)
                }
                rows={6}
                disabled={saving}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none disabled:opacity-50"
                placeholder="Write your reply..."
              />

              {/* Reply actions */}

              <div className="flex justify-end gap-3 mt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowReply(false)
                  }
                  disabled={saving}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReply}
                  disabled={
                    saving ||
                    !replyText.trim()
                  }
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? 'Sending...'
                    : 'Send Reply'}
                </button>

              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default MessagesManager;