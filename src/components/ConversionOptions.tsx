
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface ConversionOptionsProps {
  onRequestConversion: (format: string) => void;
  disableConversion: boolean;
}

const ConversionOptions = ({ 
  onRequestConversion, 
  disableConversion 
}: ConversionOptionsProps) => {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  
  const handleConversionRequest = () => {
    onRequestConversion(selectedFormat);
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Convert DWG File</h3>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Select 
            value={selectedFormat}
            onValueChange={setSelectedFormat}
            disabled={disableConversion}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="svg">SVG</SelectItem>
              <SelectItem value="png">PNG</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleConversionRequest}
          disabled={disableConversion}
        >
          Convert File
        </Button>
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        Convert your DWG file to other formats for easier viewing and sharing
      </p>
    </Card>
  );
};

export default ConversionOptions;
