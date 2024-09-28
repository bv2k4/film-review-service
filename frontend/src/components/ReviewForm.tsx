import React, { useState, useEffect } from 'react';
import { validateReview } from '../utils';

interface ReviewFormProps {
  onSubmit: (review: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearResponse: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading, error, clearResponse }) => {
  const [review, setReview] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setValidationError(null);
  }, [review]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationResult = validateReview(review);
    if (validationResult) {
      setValidationError(validationResult);
      clearResponse();
      return;
    }
    setValidationError(null);
    await onSubmit(review);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg border border-green-400">
      <textarea
        className="w-full p-2 bg-gray-700 text-green-400 border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Enter your film review here (10-256 words)"
        rows={4}
        required
        disabled={loading}
      />
      {(validationError || error) && (
        <p className="text-red-400 mt-2">{validationError || error}</p>
      )}
      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700 disabled:opacity-50 transition duration-200"
        disabled={loading || !review.trim()}
      >
        {loading ? (
          <span className="flex items-center">
            <span className="loading-animation mr-2"></span>
            Analyzing...
          </span>
        ) : (
          'Analyze Review'
        )}
      </button>
    </form>
  );
};

export default ReviewForm;