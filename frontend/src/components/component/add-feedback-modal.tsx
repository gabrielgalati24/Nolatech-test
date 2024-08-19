import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from 'zod';
import { service } from '@/utils/service';
import { Loader } from '../ui/loader';
import { useToast } from '../ui/use-toast';


const feedbackSchema = z.object({
  feedback: z.string().min(1, "Feedback is required"),
});

export function AddFeedbackModal({ isOpen, onClose, evaluation }:any) {
  console.log({evaluation});
  const { toast } = useToast();
  const [feedbackData, setFeedbackData] = useState({ feedback: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: value,
    });
    setErrors((prev: any) => ({ ...prev, [name]: '' })); // Limpiar error
  };

  const handleSave = () => {
    // Validación utilizando el esquema de Zod
    try {
      feedbackSchema.parse(feedbackData);
      saveFeedback(feedbackData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: any = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const saveFeedback = async (feedbackData: { feedback: string }) => {
    console.log({evaluation});
    setIsLoading(true);
    const feedbackDataToSave = { evaluationId: evaluation._id, ...feedbackData };
    console.log({feedbackDataToSave});
    try {
      const response = await service.post('/api/feedback', {
        body: JSON.stringify(feedbackDataToSave),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save feedback');
      }

      setFeedbackData({ feedback: '' });

      toast({
        title: 'Feedback saved successfully',
        variant: 'default',
      });
      onClose();
      return data;
    } catch (error:any) {
      console.error('Error saving feedback:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save feedback: ${error.message}`,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFeedbackData({ feedback: '' });
      setErrors({});
    }
  }, [evaluation]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Feedback </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Please provide feedback for the evaluation.
          </DialogDescription>
        </DialogHeader>
        <>
          {/* Formulario de feedback */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm font-medium">Feedback</Label>
              <Input
                id="feedback"
                name="feedback"
                placeholder="Enter feedback"
                value={feedbackData.feedback}
                onChange={handleInputChange}
                className="border-gray-300 focus:ring-primary focus:border-primary"
              />
              {errors.feedback && <p className="text-red-500">{errors.feedback}</p>}
            </div>
          </div>

          <DialogFooter className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={onClose} className="bg-gray-200 hover:bg-gray-300">
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} className="bg-primary text-white hover:bg-primary-dark">
              {isLoading ? <Loader /> : 'Save Feedback'}
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
}
