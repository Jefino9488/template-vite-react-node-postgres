import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const checkBackend = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/health');
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to connect to backend');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Vite + React + Node.js + PostgreSQL</h1>
            <button
                onClick={checkBackend}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
                {loading ? 'Checking...' : 'Check Backend Connection'}
            </button>
            {message && <p className="mt-4 text-lg">{message}</p>}
        </div>
    );
}

export default App;