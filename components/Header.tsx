
import React from 'react';
import { FashionIcon } from './Icon';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-full text-white">
                    <FashionIcon />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Virtual Fashion Try-On</h1>
                    <p className="text-sm text-gray-500">See it before you wear it with AI</p>
                </div>
            </div>
        </header>
    );
};

export default Header;
