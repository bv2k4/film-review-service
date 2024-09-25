import React, { useState, useCallback } from 'react';

const App: React.FC = () => {
    const [review, setReview] = useState('');
    const [response, setResponse] = useState<{ sentiment: string; confidence: number; rating: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    const validateReview = useCallback((text: string): string | null => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            return 'The review cannot be empty.';
        }
        const words = trimmedText.split(/\s+/);
        if (words.length < 10) {
            return 'The review must contain at least 10 words.';
        }
        if (words.length > 256) {
            return 'The review must contain no more than 256 words.';
        }
        if (!/[a-zA-Z]/.test(trimmedText)) {
            return 'The review must contain at least one letter.';
        }
        if (words.some(word => word.length > 30)) {
            return 'Each word in the review must not exceed 30 characters.';
        }
        return null;
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const validationError = validateReview(review);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${apiUrl}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: review.trim() }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Network response was not ok');
            }

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Film Review App</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={review}
                    onChange={(e) => {
                        setReview(e.target.value);
                        setError(null);
                    }}
                    placeholder="Enter your film review here (10-256 words)"
                    rows={4}
                    cols={50}
                />
                <br />
                <button type="submit" disabled={loading || !review.trim()}>Submit Review</button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {response && (
                <div>
                    <h2>Response:</h2>
                    <p>Sentiment: {response.sentiment}</p>
                    <p>Confidence: {response.confidence.toFixed(2)}</p>
                    <p>Rating: {response.rating.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
};

export default App;