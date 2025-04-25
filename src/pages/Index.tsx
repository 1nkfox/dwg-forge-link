
import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import FileList, { UploadedFile } from "@/components/FileList";
import ConversionOptions from "@/components/ConversionOptions";
import { toast } from "sonner";
import { 
  generateUniqueId, 
  performSecurityCheck,
  processFileContour
} from "@/utils/fileUtils";

const Index = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessingContour, setIsProcessingContour] = useState(false);
  
  const handleFileAccepted = async (file: File) => {
    setIsUploading(true);
    
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const fileId = generateUniqueId();
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        originalUrl: URL.createObjectURL(file),
        isSecurityChecked: false,
        originalFile: file,
      };
      
      setUploadedFiles(prev => [newFile, ...prev]);
      
      toast.success("File uploaded successfully!");
      
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
  
  const handleDownloadFile = (file: UploadedFile) => {
    if (file.originalUrl) {
      const a = document.createElement('a');
      a.href = file.originalUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success(`Downloading ${file.name}...`);
    }
  };
  
  const handleGenerateContour = async () => {
    const fileToProcess = uploadedFiles.find(file => 
      file.isSecurityChecked && file.originalFile
    );
    
    if (!fileToProcess || !fileToProcess.originalFile) {
      toast.error("No valid files to process.");
      return;
    }
    
    setIsProcessingContour(true);
    
    try {
      toast.info(`Processing contour for ${fileToProcess.name}...`);
      
      const contourBlob = await processFileContour(fileToProcess.originalFile);
      const contourUrl = URL.createObjectURL(contourBlob);
      
      const baseName = fileToProcess.name.replace(/\.(dwg|dxf)$/i, '');
      const contourName = `${baseName}_contour.dwg`;
      
      const contourFileId = generateUniqueId();
      const contourFile: UploadedFile = {
        id: contourFileId,
        name: contourName,
        size: contourBlob.size,
        originalUrl: contourUrl,
        isSecurityChecked: true,
        isContour: true,
      };
      
      setUploadedFiles(prev => [contourFile, ...prev]);
      
      toast.success(`Contour generated successfully!`);
    } catch (error) {
      console.error('Contour processing error:', error);
      toast.error("Contour processing failed. Please try again.");
    } finally {
      setIsProcessingContour(false);
    }
  };
  
  const disableContour = isProcessingContour || !uploadedFiles.some(file => 
    file.isSecurityChecked && file.originalFile
  );
  
  return (
    <div className="app-container container mx-auto px-4 py-8 max-w-5xl">
      <div className="app-header text-center mb-8">
        <h1 className="app-logo text-3xl font-bold text-primary mb-2">DWG Forge Link</h1>
        <p className="app-description text-muted-foreground">
          Upload and extract contours from your CAD files securely
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
              onGenerateContour={handleGenerateContour}
              disableContour={disableContour}
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
