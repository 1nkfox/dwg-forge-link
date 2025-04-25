
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConversionOptionsProps {
  onGenerateContour: () => void;
  disableContour: boolean;
}

const ConversionOptions = ({ 
  onGenerateContour,
  disableContour
}: ConversionOptionsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Process CAD File</h3>
      
      <div>
        <Button 
          onClick={onGenerateContour}
          disabled={disableContour}
          className="w-full md:w-auto"
        >
          Process Contour
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Extract the outer contour from your CAD file
        </p>
      </div>
    </Card>
  );
};

export default ConversionOptions;
