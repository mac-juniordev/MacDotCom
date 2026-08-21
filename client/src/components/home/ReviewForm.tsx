// ============================================
// REVIEW FORM COMPONENT
// Interactive star rating like Play Store
// Connected to Testimonials API
// ============================================

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Star,
  Send,
  CheckCircle,
  Loader2,
  X,
} from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface FormData {
  name: string;
  role: string;
  content: string;
  rating: number;
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  role: '',
  content: '',
  rating: 0,
};

const ReviewForm = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [submitError, setSubmitError] = useState('');

  // ============================================
  // RATING LABEL
  // ============================================

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Select rating';
    }
  };

  // ============================================
  // RATING COLOR
  // ============================================

  const getRatingColor = (rating: number) => {
    if (rating >= 4) {
      return '#10b981';
    }

    if (rating === 3) {
      return '#3b82f6';
    }

    if (rating >= 1) {
      return '#ef4444';
    }

    return '#6b7280';
  };

  // ============================================
  // HANDLE INPUT CHANGES
  // ============================================

  const handleInputChange = (
    field: keyof FormData,
    value: string
  ) => {
    setSubmitError('');

    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ============================================
  // HANDLE RATING
  // ============================================

  const handleRatingChange = (rating: number) => {
    setFormData((previous) => ({
      ...previous,
      rating,
    }));

    setRatingError('');
    setSubmitError('');
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate rating
    if (formData.rating === 0) {
      setRatingError('Please select a star rating.');
      return;
    }

    // Clear previous errors
    setRatingError('');
    setSubmitError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${API_URL}/testimonials`,
        formData
      );

      if (response.data?.success) {
        setIsSubmitted(true);

        // Reset form after successful submission
        setFormData(INITIAL_FORM_DATA);
        setHoverRating(0);
      } else {
        setSubmitError(
          response.data?.message ||
            'Failed to submit review. Please try again.'
        );
      }
    } catch (error) {
      console.error('Failed to submit review:', error);

      if (axios.isAxiosError(error)) {
        setSubmitError(
          error.response?.data?.message ||
            'Failed to submit review. Please try again.'
        );
      } else {
        setSubmitError(
          'Something went wrong. Please try again.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // CURRENT DISPLAY RATING
  // ============================================

  const displayRating = hoverRating || formData.rating;

  return (
    <section className="relative py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ============================================
            HEADER
        ============================================ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center mb-8"
        >
          <h3 className="text-3xl font-black mb-2 text-primary">
            Leave a Review
          </h3>

          <p className="text-secondary">
            Share your experience with MacDotCom
          </p>
        </motion.div>

        {/* ============================================
            FORM
        ============================================ */}

        <motion.form
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
          }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6"
        >

          {/* ============================================
              STAR RATING
          ============================================ */}

          <div className="text-center">

            <label className="block text-sm font-medium mb-3 text-primary">
              Your Rating
            </label>

            {/* Stars */}
            <div
              className="flex justify-center gap-1"
              role="radiogroup"
              aria-label="Rating"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = displayRating >= star;
                const isHovered = hoverRating === star;
                const isSelected = formData.rating === star;

                return (
                  <motion.button
                    key={star}
                    type="button"
                    role="radio"
                    aria-label={`Rate ${star} out of 5`}
                    aria-checked={isSelected}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => {
                      setHoverRating(star);
                      setRatingError('');
                    }}
                    onMouseLeave={() => {
                      setHoverRating(0);
                    }}
                    onFocus={() => {
                      setHoverRating(star);
                      setRatingError('');
                    }}
                    onBlur={() => {
                      setHoverRating(0);
                    }}
                    whileHover={{
                      scale: 1.3,
                      y: -4,
                    }}
                    whileTap={{
                      scale: 0.8,
                    }}
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      y: isHovered ? -4 : 0,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="relative rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        isFilled
                          ? 'text-yellow-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          : 'text-gray-400 hover:text-yellow-300'
                      }`}
                      fill={
                        isFilled
                          ? 'currentColor'
                          : 'none'
                      }
                      strokeWidth={
                        isFilled
                          ? 1
                          : 2
                      }
                    />
                  </motion.button>
                );
              })}
            </div>

            {/* Rating label */}
            <motion.p
              key={displayRating}
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="mt-3 text-sm font-semibold"
              style={{
                color: getRatingColor(displayRating),
              }}
            >
              {getRatingLabel(displayRating)}
            </motion.p>

            {/* Rating error */}
            {ratingError && (
              <motion.p
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                className="mt-2 text-sm text-red-500 flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                {ratingError}
              </motion.p>
            )}
          </div>

          {/* ============================================
              NAME
          ============================================ */}

          <div>
            <label
              htmlFor="review-name"
              className="block text-sm font-medium mb-2 text-primary"
            >
              Name *
            </label>

            <input
              id="review-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                handleInputChange(
                  'name',
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="Your name"
              autoComplete="name"
              maxLength={100}
              required
              disabled={isSubmitting || isSubmitted}
            />
          </div>

          {/* ============================================
              ROLE
          ============================================ */}

          <div>
            <label
              htmlFor="review-role"
              className="block text-sm font-medium mb-2 text-primary"
            >
              Role (optional)
            </label>

            <input
              id="review-role"
              type="text"
              value={formData.role}
              onChange={(e) =>
                handleInputChange(
                  'role',
                  e.target.value
                )
              }
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="e.g., CEO, CTO, Founder"
              autoComplete="organization-title"
              maxLength={100}
              disabled={isSubmitting || isSubmitted}
            />
          </div>

          {/* ============================================
              REVIEW CONTENT
          ============================================ */}

          <div>
            <label
              htmlFor="review-content"
              className="block text-sm font-medium mb-2 text-primary"
            >
              Review *
            </label>

            <textarea
              id="review-content"
              value={formData.content}
              onChange={(e) =>
                handleInputChange(
                  'content',
                  e.target.value
                )
              }
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-card text-primary border border-border focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
              placeholder="Share your experience..."
              maxLength={1000}
              required
              disabled={isSubmitting || isSubmitted}
            />

            <div className="flex justify-end mt-1">
              <span className="text-xs text-secondary">
                {formData.content.length}/1000
              </span>
            </div>
          </div>

          {/* ============================================
              SUBMIT ERROR
          ============================================ */}

          {submitError && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-500"
            >
              <X className="w-4 h-4 flex-shrink-0" />

              <span>
                {submitError}
              </span>
            </motion.div>
          )}

          {/* ============================================
              SUCCESS MESSAGE
          ============================================ */}

          {isSubmitted && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-4 text-green-500"
            >
              <CheckCircle className="w-8 h-8" />

              <p className="font-semibold">
                Review Published!
              </p>

              <p className="text-sm text-secondary">
                Thank you for sharing your experience.
              </p>
            </motion.div>
          )}

          {/* ============================================
              SUBMIT BUTTON
          ============================================ */}

          <motion.button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            whileHover={
              !isSubmitting && !isSubmitted
                ? {
                    scale: 1.02,
                  }
                : undefined
            }
            whileTap={
              !isSubmitting && !isSubmitted
                ? {
                    scale: 0.98,
                  }
                : undefined
            }
            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : isSubmitted ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Review Published!
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review
              </>
            )}
          </motion.button>

        </motion.form>
      </div>
    </section>
  );
};

export default ReviewForm;