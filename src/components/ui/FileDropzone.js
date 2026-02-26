import React, { useState, useRef } from "react";

export default function FileDropzone({
  label,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onFilesSelected,
  error,
  helperText,
  disabled = false,
  className = "",
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize) {
        console.warn(`File ${file.name} exceeds max size`);
        return false;
      }
      return true;
    });

    const updatedFiles = multiple
      ? [...files, ...validFiles]
      : validFiles.slice(0, 1);
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected?.(updatedFiles);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <p
          className="block text-sm font-medium mb-1.5"
          style={{ color: "#1D3D64" }}
        >
          {label}
        </p>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
        style={{
          borderColor: error
            ? "#f8851a"
            : isDragging
            ? "#f8851a"
            : "rgba(29, 61, 100, 0.2)",
          backgroundColor: isDragging
            ? "rgba(248, 133, 26, 0.05)"
            : "transparent",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
          aria-label="File upload"
        />

        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: isDragging
                ? "rgba(248, 133, 26, 0.2)"
                : "rgba(29, 61, 100, 0.1)",
            }}
          >
            <svg
              className="w-6 h-6 transition-colors"
              style={{
                color: isDragging ? "#f8851a" : "rgba(29, 61, 100, 0.6)",
              }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-medium" style={{ color: "#1D3D64" }}>
              <span style={{ color: "#f8851a" }}>Click to upload</span> or drag
              and drop
            </p>
            <p
              className="text-xs mt-1"
              style={{ color: "rgba(29, 61, 100, 0.6)" }}
            >
              {accept ? accept.split(",").join(", ") : "Any file type"} (Max:{" "}
              {formatFileSize(maxSize)})
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ backgroundColor: "rgba(29, 61, 100, 0.05)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(248, 133, 26, 0.1)" }}
                >
                  <svg
                    className="w-5 h-5"
                    style={{ color: "#f8851a" }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "#1D3D64" }}
                  >
                    {file.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(29, 61, 100, 0.6)" }}
                  >
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="p-1 rounded-lg transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: "rgba(29, 61, 100, 0.6)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-1.5 text-sm" style={{ color: "#f8851a" }} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          className="mt-1.5 text-sm"
          style={{ color: "rgba(29, 61, 100, 0.6)" }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
