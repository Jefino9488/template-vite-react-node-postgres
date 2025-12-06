import { render } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
    it('renders correctly', () => {
        // Basic render test
        // We might need to wrap App if it depends on providers, but assuming it's simple for now.
        // If App fetches data on mount, we might need to mock fetch.
        const { container } = render(<App />);
        expect(container).toBeTruthy();
    });
});
