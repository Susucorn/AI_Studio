
import React, { useState, useCallback } from 'react';
import { ImageFile } from './types';
import { fileToBase64 } from './utils/imageUtils';
import { virtualTryOn } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { ResultIcon, ArrowRightIcon } from './components/Icon';

const App: React.FC = () => {
    const [personImage, setPersonImage] = useState<ImageFile | null>(null);
    const [topImage, setTopImage] = useState<ImageFile | null>(null);
    const [bottomImage, setBottomImage] = useState<ImageFile | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!personImage || !topImage || !bottomImage) {
            setError('Please upload a person, a top, and a bottom image.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const [personImageBase64, topImageBase64, bottomImageBase64] = await Promise.all([
                fileToBase64(personImage.file),
                fileToBase64(topImage.file),
                fileToBase64(bottomImage.file)
            ]);
            
            const result = await virtualTryOn(
                personImageBase64,
                personImage.file.type,
                topImageBase64,
                topImage.file.type,
                bottomImageBase64,
                bottomImage.file.type
            );

            if (result) {
                setGeneratedImage(`data:image/png;base64,${result}`);
            } else {
                setError('The AI could not generate an image. Please try again with different images.');
            }

        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    }, [personImage, topImage, bottomImage]);
    
    const handleReset = () => {
        setPersonImage(null);
        setTopImage(null);
        setBottomImage(null);
        setGeneratedImage(null);
        setError(null);
        setIsLoading(false);
    };

    const canGenerate = personImage && topImage && bottomImage && !isLoading;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ImageUploader 
                                title="1. Upload Person's Photo" 
                                description="Select a clear, full-body photo of a person."
                                onImageSelect={setPersonImage}
                                imageFile={personImage}
                            />
                            <div className="space-y-6">
                                <ImageUploader
                                    title="2. Upload Top" 
                                    description="Select a photo of the top on a plain background."
                                    onImageSelect={setTopImage}
                                    imageFile={topImage}
                                />
                                <ImageUploader
                                    title="3. Upload Bottom" 
                                    description="Select a photo of the bottom on a plain background."
                                    onImageSelect={setBottomImage}
                                    imageFile={bottomImage}
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                onClick={handleGenerate}
                                disabled={!canGenerate}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-300"
                            >
                                {isLoading ? 'Generating...' : 'Virtual Try-On'}
                                <ArrowRightIcon />
                            </button>
                             <button
                                onClick={handleReset}
                                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-300"
                            >
                                Start Over
                            </button>
                        </div>
                        {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                    </div>

                    {/* Output Section */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 self-start">4. Result</h2>
                        <div className="w-full h-full aspect-w-1 aspect-h-1 flex-grow flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                           {isLoading && <Spinner />}
                           {!isLoading && generatedImage && (
                                <img src={generatedImage} alt="Generated virtual try-on" className="w-full h-full object-contain" />
                           )}
                           {!isLoading && !generatedImage && (
                                <div className="text-center text-gray-500 p-4">
                                    <ResultIcon />
                                    <p className="mt-2 font-medium">Your generated image will appear here.</p>
                                </div>
                           )}
                        </div>
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 text-sm text-gray-500">
                <p>Powered by Gemini. Designed by a world-class senior frontend React engineer.</p>
            </footer>
        </div>
    );
};

export default App;
