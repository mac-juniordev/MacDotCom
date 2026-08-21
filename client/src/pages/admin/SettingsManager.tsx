// ============================================
// SETTINGS MANAGER
// Profile, password, and site settings
// ============================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  User,
  Lock,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

// ============================================
// API
// ============================================

const API_URL = 'http://localhost:5000/api';

// ============================================
// TYPES
// ============================================

interface Profile {
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  phone: string;
  address: string;
}

// ============================================
// COMPONENT
// ============================================

const SettingsManager = () => {
  // ============================================
  // PROFILE STATE
  // ============================================

  const [profile, setProfile] = useState<Profile>({
    name: '',
    email: '',
    title: '',
    bio: '',
    location: '',
  });

  // ============================================
  // PASSWORD STATE
  // ============================================

  const [passwordData, setPasswordData] =
    useState<PasswordData>({
      currentPassword: '',
      newPassword: '',
    });

  // ============================================
  // SITE SETTINGS STATE
  // ============================================

  const [siteSettings, setSiteSettings] =
    useState<SiteSettings>({
      siteName: 'MacDotCom',
      siteDescription: '',
      contactEmail: '',
      phone: '',
      address: '',
    });

  // ============================================
  // UI STATE
  // ============================================

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] =
    useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);
  const [savingSiteSettings, setSavingSiteSettings] =
    useState(false);
  const [uploadingResume, setUploadingResume] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState('');
  const [errorMessage, setErrorMessage] =
    useState('');

  // ============================================
  // HELPERS
  // ============================================

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const getAuthHeaders = () => {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setErrorMessage('');

    window.setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setSuccessMessage('');
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');

        const [profileResponse, siteResponse] =
          await Promise.all([
            axios.get(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            axios.get(`${API_URL}/site-settings`),
          ]);

        if (cancelled) {
          return;
        }

        // ========================================
        // PROFILE
        // ========================================

        const profileData =
          profileResponse.data?.data;

        if (profileData) {
          setProfile({
            name: profileData.name || '',
            email: profileData.email || '',
            title: profileData.title || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
          });
        }

        // ========================================
        // SITE SETTINGS
        // ========================================

        const siteData =
          siteResponse.data?.data;

        if (siteData) {
          setSiteSettings({
            siteName:
              siteData.siteName || 'MacDotCom',
            siteDescription:
              siteData.siteDescription || '',
            contactEmail:
              siteData.contactEmail || '',
            phone: siteData.phone || '',
            address: siteData.address || '',
          });
        }
      } catch (error: unknown) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load settings:',
          error
        );

        if (axios.isAxiosError(error)) {
          showError(
            error.response?.data?.message ||
              'Failed to load settings.'
          );
        } else {
          showError('Failed to load settings.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================
  // SAVE PROFILE
  // ============================================

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      showError('Name is required.');
      return;
    }

    if (!profile.email.trim()) {
      showError('Email is required.');
      return;
    }

    try {
      setSavingProfile(true);
      setErrorMessage('');
      setSuccessMessage('');

      await axios.put(
        `${API_URL}/auth/me`,
        {
          name: profile.name.trim(),
          email: profile.email.trim(),
          title: profile.title.trim(),
          bio: profile.bio.trim(),
          location: profile.location.trim(),
        },
        {
          headers: getAuthHeaders(),
        }
      );

      showSuccess(
        'Profile updated successfully.'
      );
    } catch (error: unknown) {
      console.error(
        'Failed to save profile:',
        error
      );

      if (axios.isAxiosError(error)) {
        showError(
          error.response?.data?.message ||
            'Failed to save profile.'
        );
      } else {
        showError('Failed to save profile.');
      }
    } finally {
      setSavingProfile(false);
    }
  };

  // ============================================
  // CHANGE PASSWORD
  // ============================================

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword.trim() ||
      !passwordData.newPassword.trim()
    ) {
      showError(
        'Please fill in all password fields.'
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError(
        'New password must be at least 6 characters.'
      );
      return;
    }

    try {
      setChangingPassword(true);
      setErrorMessage('');
      setSuccessMessage('');

      await axios.put(
        `${API_URL}/auth/password`,
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword:
            passwordData.newPassword,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setPasswordData({
        currentPassword: '',
        newPassword: '',
      });

      showSuccess(
        'Password changed successfully.'
      );
    } catch (error: unknown) {
      console.error(
        'Failed to change password:',
        error
      );

      if (axios.isAxiosError(error)) {
        showError(
          error.response?.data?.message ||
            'Failed to change password.'
        );
      } else {
        showError(
          'Failed to change password.'
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================
  // SAVE SITE SETTINGS
  // ============================================

  const handleSaveSiteSettings = async () => {
    if (!siteSettings.siteName.trim()) {
      showError('Site name is required.');
      return;
    }

    try {
      setSavingSiteSettings(true);
      setErrorMessage('');
      setSuccessMessage('');

      await axios.put(
        `${API_URL}/site-settings`,
        {
          siteName:
            siteSettings.siteName.trim(),
          siteDescription:
            siteSettings.siteDescription.trim(),
          contactEmail:
            siteSettings.contactEmail.trim(),
          phone: siteSettings.phone.trim(),
          address:
            siteSettings.address.trim(),
        },
        {
          headers: getAuthHeaders(),
        }
      );

      showSuccess(
        'Site settings saved successfully.'
      );
    } catch (error: unknown) {
      console.error(
        'Failed to save site settings:',
        error
      );

      if (axios.isAxiosError(error)) {
        showError(
          error.response?.data?.message ||
            'Failed to save site settings.'
        );
      } else {
        showError(
          'Failed to save site settings.'
        );
      }
    } finally {
      setSavingSiteSettings(false);
    }
  };

  // ============================================
  // RESUME UPLOAD
  // ============================================

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      showError(
        'Please upload a PDF, DOC, or DOCX file.'
      );

      event.target.value = '';
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      showError(
        'Resume must be smaller than 10MB.'
      );

      event.target.value = '';
      return;
    }

    const formData = new FormData();

    formData.append('resume', file);

    try {
      setUploadingResume(true);
      setErrorMessage('');
      setSuccessMessage('');

      await axios.post(
        `${API_URL}/site-settings/resume`,
        formData,
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      showSuccess(
        'Resume uploaded successfully.'
      );

      event.target.value = '';
    } catch (error: unknown) {
      console.error(
        'Failed to upload resume:',
        error
      );

      if (axios.isAxiosError(error)) {
        showError(
          error.response?.data?.message ||
            'Failed to upload resume.'
        );
      } else {
        showError(
          'Failed to upload resume.'
        );
      }
    } finally {
      setUploadingResume(false);
    }
  };

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
          Settings
        </h2>

        <p className="text-gray-400">
          Manage your profile and site settings
        </p>
      </div>

      {/* ============================================
          SUCCESS MESSAGE
      ============================================ */}

      {successMessage && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <CheckCircle className="w-5 h-5 text-green-500" />

          <p className="text-sm text-green-400">
            {successMessage}
          </p>
        </motion.div>
      )}

      {/* ============================================
          ERROR MESSAGE
      ============================================ */}

      {errorMessage && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-500" />

          <p className="text-sm text-red-400">
            {errorMessage}
          </p>
        </motion.div>
      )}

      {/* ============================================
          PROFILE
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5" />
          Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Name
            </label>

            <input
              type="text"
              value={profile.name}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  name: event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your name"
            />
          </div>

          {/* Email */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  email: event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Title */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Title
            </label>

            <input
              type="text"
              value={profile.title}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  title: event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Software Developer"
            />
          </div>

          {/* Location */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Location
            </label>

            <input
              type="text"
              value={profile.location}
              onChange={(event) =>
                setProfile({
                  ...profile,
                  location: event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Bamenda, Cameroon"
            />
          </div>

        </div>

        {/* Bio */}

        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-2">
            Bio
          </label>

          <textarea
            value={profile.bio}
            onChange={(event) =>
              setProfile({
                ...profile,
                bio: event.target.value,
              })
            }
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Tell visitors about yourself..."
          />
        </div>

        {/* Save */}

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={savingProfile}
          className="mt-5 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />

          {savingProfile
            ? 'Saving...'
            : 'Save Profile'}
        </button>

      </div>

      {/* ============================================
          CHANGE PASSWORD
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Current Password */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={
                passwordData.currentPassword
              }
              onChange={(event) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword:
                    event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Current password"
            />
          </div>

          {/* New Password */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={
                passwordData.newPassword
              }
              onChange={(event) =>
                setPasswordData({
                  ...passwordData,
                  newPassword:
                    event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="New password"
            />
          </div>

        </div>

        <button
          type="button"
          onClick={handleChangePassword}
          disabled={changingPassword}
          className="mt-5 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {changingPassword
            ? 'Changing Password...'
            : 'Change Password'}
        </button>

      </div>

      {/* ============================================
          RESUME UPLOAD
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Resume Upload
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Upload your latest resume in PDF, DOC,
          or DOCX format. Maximum size: 10MB.
        </p>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          disabled={uploadingResume}
          onChange={handleResumeUpload}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600 disabled:opacity-50"
        />

        {uploadingResume && (
          <p className="text-sm text-green-400 mt-3">
            Uploading resume...
          </p>
        )}

      </div>

      {/* ============================================
          SITE SETTINGS
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">

        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Site Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Site Name */}

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Site Name
            </label>

            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(event) =>
                setSiteSettings({
                  ...siteSettings,
                  siteName:
                    event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="MacDotCom"
            />
          </div>

          {/* Contact Email */}

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Email
            </label>

            <input
              type="email"
              value={
                siteSettings.contactEmail
              }
              onChange={(event) =>
                setSiteSettings({
                  ...siteSettings,
                  contactEmail:
                    event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="contact@example.com"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </label>

            <input
              type="text"
              value={siteSettings.phone}
              onChange={(event) =>
                setSiteSettings({
                  ...siteSettings,
                  phone: event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="+237 ..."
            />
          </div>

          {/* Address */}

          <div>
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>

            <input
              type="text"
              value={siteSettings.address}
              onChange={(event) =>
                setSiteSettings({
                  ...siteSettings,
                  address:
                    event.target.value,
                })
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your business address"
            />
          </div>

        </div>

        {/* Site Description */}

        <div className="mt-4">
          <label className="block text-sm text-gray-400 mb-2">
            Site Description
          </label>

          <textarea
            value={
              siteSettings.siteDescription
            }
            onChange={(event) =>
              setSiteSettings({
                ...siteSettings,
                siteDescription:
                  event.target.value,
              })
            }
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            placeholder="Describe your website..."
          />
        </div>

        {/* Save */}

        <button
          type="button"
          onClick={handleSaveSiteSettings}
          disabled={savingSiteSettings}
          className="mt-5 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />

          {savingSiteSettings
            ? 'Saving...'
            : 'Save Site Settings'}
        </button>

      </div>

    </div>
  );
};

export default SettingsManager;