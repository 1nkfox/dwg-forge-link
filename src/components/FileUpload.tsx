
import { useState, useCallback, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import { toast } from "sonner";
import { isDwgFile, isValidFileSize } from "@/utils/fileUtils";

interface FileUploadProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const FileUpload = ({ onFileAccepted, isUploading, uploadProgress }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateAndProcessFile = (file: File) => {
    if (!file) return;
    
    if (!isDwgFile(file)) {
      toast.error("Invalid file type. Please upload a .dwg file.");
      return;
    }
    
    if (!isValidFileSize(file)) {
      toast.error("File is too large. Maximum file size is 50MB.");
      return;
    }
    
    onFileAccepted(file);
  };

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, [onFileAccepted]);

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="p-6">
      <div
        className={`file-drop-area ${isDragging ? 'drag-active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {isUploading ? (
          <div className="space-y-4">
            <File className="mx-auto h-12 w-12 text-primary" />
            <p className="text-lg font-medium">Uploading file...</p>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag & Drop your DWG file here</h3>
            <p className="text-muted-foreground mb-4">Or click to browse your files</p>
            <Button type="button">Select DWG File</Button>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".dwg"
        onChange={handleFileInput}
        className="hidden"
      />
      {!isUploading && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          <p>Only .dwg files are accepted (max 50MB)</p>
        </div>
      )}
    </Card>
  );
};

export default FileUpload;
