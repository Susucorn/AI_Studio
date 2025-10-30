
import React, { useCallback, useRef } from 'react';
import { ImageFile } from '../types';
import { UploadIcon, XCircleIcon } from './Icon';

interface ImageUploaderProps {
    title: string;
    description: string;
    onImageSelect: (imageFile: ImageFile | null) => void;
    imageFile: ImageFile | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, description, onImageSelect, imageFile }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageSelect({
                file,
                preview: URL.createObjectURL(file),
            });
        }
    }, [onImageSelect]);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageSelect(null);
        if(inputRef.current) {
            inputRef.current.value = "";
        }
    }
    
    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mb-3">{description}</p>
            <div 
                onClick={handleClick}
                className="relative flex-grow flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200 aspect-w-4 aspect-h-5"
            >
                {imageFile ? (
                    <>
                        <img src={imageFile.preview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                         <button onClick={handleClear} className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-500 hover:text-gray-800 transition-colors">
                            <XCircleIcon />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-gray-500">
                        <UploadIcon />
                        <p className="mt-2 text-sm font-medium">Click to upload</p>
                        <p className="text-xs">PNG, JPG, WEBP</p>
                    </div>
                )}
                <input
                    type="file"
                    ref={inputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUploader;
