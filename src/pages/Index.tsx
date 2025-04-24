
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import FileList, { UploadedFile } from "@/components/FileList";
import ConversionOptions from "@/components/ConversionOptions";
import { toast } from "sonner";
import { 
  generateUniqueId, 
  performSecurityCheck, 
  simulateFileConversion 
} from "@/utils/fileUtils";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const handleFileAccepted = async (file: File) => {
    setIsUploading(true);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Simulate network upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Complete the upload
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Create the uploaded file object
      const fileId = generateUniqueId();
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        originalUrl: URL.createObjectURL(file),
        isConverting: false,
        isSecurityChecked: false,
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      
      toast.success("File uploaded successfully!");
      
      // Perform security check in background
      performSecurityCheck(file).then(isSecure => {
        if (isSecure) {
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, isSecurityChecked: true } : f)
          );
          toast.success("Security check passed!");
        } else {
          setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
          toast.error("Security check failed. File has been removed.");
        }
      });
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDeleteFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast.success("File deleted successfully!");
  };
  
  const handleDownloadFile = (file: UploadedFile, isOriginal: boolean) => {
    const url = isOriginal ? file.originalUrl : file.convertedUrl;
    const fileName = isOriginal 
      ? file.name 
      : file.name.replace('.dwg', `.${file.convertedFormat}`);
      
    if (url) {
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Downloading ${fileName}...`);
    }
  };
  
  const handleRequestConversion = async (format: string) => {
    // Find the first unconverted file that has passed security check
    const fileToConvert = uploadedFiles.find(file => 
      !file.convertedUrl && file.isSecurityChecked
    );
    
    if (!fileToConvert) {
      toast.error("No valid files to convert.");
      return;
    }
    
    // Mark the file as converting
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileToConvert.id ? { ...f, isConverting: true } : f)
    );
    
    try {
      toast.info(`Converting ${fileToConvert.name} to ${format.toUpperCase()}...`);
      
      // Simulate conversion process
      const convertedUrl = await simulateFileConversion(fileToConvert.id, format);
      
      // Update the file with conversion result
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileToConvert.id 
            ? { ...f, convertedUrl, convertedFormat: format, isConverting: false } 
            : f
        )
      );
      
      toast.success(`File converted to ${format.toUpperCase()} successfully!`);
    } catch (error) {
      toast.error("Conversion failed. Please try again.");
      
      // Reset converting state
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileToConvert.id ? { ...f, isConverting: false } : f)
      );
    }
  };
  
  // Determine if conversion should be disabled
  const disableConversion = !uploadedFiles.some(file => 
    !file.convertedUrl && file.isSecurityChecked
  );
  
  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-logo">DWG Forge Link</h1>
        <p className="app-description">
          Upload, convert, and manage your CAD files securely with our DWG processing service
        </p>
      </div>
      
      <div className="upload-section">
        <FileUpload 
          onFileAccepted={handleFileAccepted}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      </div>
      
      {uploadedFiles.length > 0 && (
        <>
          <div className="my-8">
            <ConversionOptions 
              onRequestConversion={handleRequestConversion}
              disableConversion={disableConversion}
            />
          </div>
          
          <div className="files-section">
            <FileList 
              files={uploadedFiles} 
              onDeleteFile={handleDeleteFile}
              onDownloadFile={handleDownloadFile}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
