"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onChange: (base64: string) => void;
  value?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
}) => {
  const [base64, setBase64] = useState(value);

  const handleChange = useCallback(
    (base64: string) => {
      onChange(base64);
    },
    [onChange],
  );

  const handleDrop = useCallback(
    (files: any) => {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setBase64(event.target.result);
        handleChange(event.target.result);
      };
      reader.readAsDataURL(file);
    },
    [handleChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    onDrop: handleDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`relative w-40 h-40 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-center text-gray-500 cursor-pointer transition-colors duration-300 ease-in-out hover:border-blue-500 hover:bg-blue-50 ${
        isDragActive ? "border-blue-500 bg-blue-50" : ""
      }`}
    >
      <input {...getInputProps()} />
      {base64 ? (
        <>
          <Image
            src={base64}
            alt='Profile'
            layout='fill'
            objectFit='cover'
            className='rounded-full'
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBase64("");
              onChange("");
            }}
            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors'
            aria-label='Remove image'
          >
            <X size={16} />
          </button>
        </>
      ) : (
        <div className='flex flex-col items-center'>
          <Image
            src='/images/dummy-profile.svg'
            alt='Dummy Profile'
            width={80}
            height={80}
            className='opacity-50'
          />
          <p className='mt-2 text-xs'>
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop or click to upload"}
          </p>
        </div>
      )}
    </div>
  );
};
