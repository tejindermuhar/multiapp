import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const maxFileSize = 20 * 1024 * 1024;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "application/pdf": [".pdf"] },
    maxSize: maxFileSize,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onFileSelect?.(null);
  };

  return (
    <div className="w-full">
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          {selectedFile ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="pdf" className="size-10" />
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <button className="p-2 cursor-pointer" onClick={handleRemoveFile}>
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
           <div className="flex flex-col items-center justify-center text-center bg-white rounded-2xl p-8 shadow-sm">
              <div className="mx-auto w-16 h-16 flex items-center justify-center mb-3">
                <img src="/icons/upload.svg" alt="upload" className="w-16 h-16" />
              </div>

              <p className="text-[18px] text-[#666666] font-body mb-1">
                <span className="font-semibold text-[#222222]">Click to upload</span> or drag and drop
              </p>

              <p className="text-[18px] text-[#666666] font-body">
                PDF (max {formatSize(maxFileSize)})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
