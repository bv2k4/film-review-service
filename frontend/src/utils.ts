const MIN_WORDS = 10;
const MAX_WORDS = 256;
const MAX_WORD_LENGTH = 30;

export const validateReview = (text: string): string | null => {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
        return 'The review cannot be empty.';
    }
    
    if (!/[a-zA-Z]/.test(trimmedText)) {
        return 'The review must contain at least one letter.';
    }
    
    const words = trimmedText.split(/\s+/);
    
    if (words.length < MIN_WORDS) {
        return `The review must contain at least ${MIN_WORDS} words.`;
    }
    
    if (words.length > MAX_WORDS) {
        return `The review must contain no more than ${MAX_WORDS} words.`;
    }
    
    if (words.some(word => word.length > MAX_WORD_LENGTH)) {
        return `Each word in the review must not exceed ${MAX_WORD_LENGTH} characters.`;
    }
    
    return null;
};
  
  export const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';