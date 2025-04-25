
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, File, FileArchive, X } from "lucide-react";
import { formatFileSize } from "@/utils/fileUtils";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  originalUrl: string;
  convertedUrl?: string;
  convertedFormat?: string;
  isConverting: boolean;
  isSecurityChecked: boolean;
  originalFile?: File;  // Add this property for storing the original File object
  isContour?: boolean;  // Add this property to identify contour files
}

interface FileListProps {
  files: UploadedFile[];
  onDeleteFile: (id: string) => void;
  onDownloadFile: (file: UploadedFile, isOriginal: boolean) => void;
}

const FileList = ({ files, onDeleteFile, onDownloadFile }: FileListProps) => {
  const [activeTab, setActiveTab] = useState("all");
  
  if (files.length === 0) {
    return null;
  }
  
  const filteredFiles = activeTab === "all" 
    ? files 
    : activeTab === "converted" 
      ? files.filter(f => f.convertedUrl)
      : files.filter(f => !f.convertedUrl);
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Uploaded Files</h2>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="original">Original</TabsTrigger>
            <TabsTrigger value="converted">Converted</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="space-y-2">
        {filteredFiles.map((file) => (
          <div key={file.id} className="file-item">
            <div className="flex items-center">
              {file.convertedUrl ? (
                <FileArchive className="h-6 w-6 text-primary mr-3" />
              ) : (
                <File className="h-6 w-6 text-primary mr-3" />
              )}
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {file.isSecurityChecked ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Secure
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Checking...
                </Badge>
              )}
              
              {file.isConverting && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Converting...
                </Badge>
              )}
              
              {file.convertedUrl && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {file.convertedFormat?.toUpperCase()}
                </Badge>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onDownloadFile(file, true)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {file.convertedUrl && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onDownloadFile(file, false)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => onDeleteFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FileList;
