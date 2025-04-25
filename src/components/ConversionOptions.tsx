
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
  onGenerateContour: () => void;
  disableConversion: boolean;
  disableContour: boolean;
}

const ConversionOptions = ({ 
  onRequestConversion, 
  onGenerateContour,
  disableConversion,
  disableContour
}: ConversionOptionsProps) => {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  
  const handleConversionRequest = () => {
    onRequestConversion(selectedFormat);
  };
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Process CAD File</h3>
      
      <div className="flex flex-col space-y-4">
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
        
        <div className="border-t pt-4 mt-2">
          <h4 className="text-md font-medium mb-3">Generate Contour</h4>
          <Button 
            onClick={onGenerateContour}
            disabled={disableContour}
            className="w-full md:w-auto"
            variant="outline"
          >
            Process Contour
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            Extract the outer contour from your CAD file
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ConversionOptions;
