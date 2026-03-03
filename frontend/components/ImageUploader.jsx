"use client";

import {
  CameraIcon,
  ImageIcon,
  LoaderIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import Image from "next/image";

export default function ImageUploader({ onImageSelect, loading }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    },
    [onImageSelect],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", "jpeg", "png", "webp"],
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 10, // 10MB
    noClick: true,
    noKeyboard: true,
  });

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onDrop([file]);
    }

    fileInputRef.current.click();
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // preview mode
  if (preview) {
    return (
      <div className="relative w-full aspect-video bg-stone-100 rounded-2xl overflow-hidden border-2 border-stone-200">
        <Image src={preview} alt="preview" className="object-cover" fill />
        {!loading && (
          <button
            onClick={clearImage}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <XIcon className="size-5 text-stone-700 cursor-pointer" />
          </button>
        )}
        {loading && (
          <div className="absolute inset-0 bg black/40 flex items-center justify-center">
            <LoaderIcon color="white" className="animate-spin" />
          </div>
        )}
      </div>
    );
  }
  return (
    <>
      <div
        {...getRootProps()}
        className={`relative w-full aspect-square border-2 border-dashed rounded-2xl transition-all cursor-pointer ${isDragActive ? "border-orange-600 bg-orange-50 scale-[1.02]" : "border-stone-300 bg-stone-50 hover:border-orange-400 hover:bg-orange-50/50"} `}
      >
        <input {...getInputProps()} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div
            className={`p-4 rounded-full transition-all ${isDragActive ? "bg-orange-600 scale-110" : "bg-orange-100"}`}
          >
            {isDragActive ? (
              <ImageIcon className="h-10 w-10 text-white" />
            ) : (
              <CameraIcon className="h-10 w-10 text-orange-600" />
            )}
          </div>
          <div className="">
            <h3 className="text-xl text-stone-900 font-bold mb-2">
              {isDragActive ? "Drop your image here" : "Scan your pantry"}
            </h3>
            <p className="text-stone-600 text-xs max-w-sm">
              {isDragActive
                ? "Release to upload your image"
                : "Take a photo or drag and drop an image of your pantry/fridge and let AI do the rest."}
            </p>
          </div>
          {!isDragActive && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
                className="gap-2 cursor-pointer"
                variant="primary"
              >
                <CameraIcon className="h-4 w-4" />
                Take a photo
              </Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="border-orange-200 gap-2 text-orange-700 hover:bg-orange-50  cursor-pointer"
                variant="outline"
              >
                <UploadIcon className="h-4 w-4" />
                Browse files
              </Button>
            </div>
          )}
          <p className="text-xs text-stone-400">
            Supports jpg, jpeg, png, webp (10MB max)
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </>
  );
}
