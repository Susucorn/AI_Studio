
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center text-gray-600">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-medium text-lg">Generating your look...</p>
            <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
    );
};

export default Spinner;
