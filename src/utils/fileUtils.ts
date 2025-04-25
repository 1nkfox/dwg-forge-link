
/**
 * Checks if the file is a valid CAD file by extension (DWG or DXF)
 */
export const isValidCadFile = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  return fileName.endsWith('.dwg') || fileName.endsWith('.dxf');
};

/**
 * Checks if the file is a DWG file by extension
 */
export const isDwgFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.dwg');
};

/**
 * Checks if the file is a DXF file by extension
 */
export const isDxfFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.dxf');
};

/**
 * Checks if the file size is valid (less than maxSize MB)
 */
export const isValidFileSize = (file: File, maxSizeMB = 50): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Formats file size from bytes to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generates a unique ID for uploaded files
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Simulates file security check (in a real app, this would perform actual checks)
 */
export const performSecurityCheck = (file: File): Promise<boolean> => {
  // This is a mock security check
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, we'll consider files less than 10MB to be "safe"
      // In a real app, you'd perform actual security checks
      resolve(file.size < 10 * 1024 * 1024);
    }, 1000);
  });
};

/**
 * Simulates file conversion (in a real app, this would use a conversion API)
 */
export const simulateFileConversion = (fileId: string, format: string): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would return a URL to the converted file
      resolve(`/api/converted/${fileId}.${format}`);
    }, 2000);
  });
};

/**
 * Process file contour using the Python backend API
 */
export const processFileContour = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/contour', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to process contour');
  }
  
  return await response.blob();
};
