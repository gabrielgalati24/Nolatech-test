import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader } from "../ui/loader";
import { service } from '@/utils/service';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function EvaluationDetail() {
  const { id } = useParams();  
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        setLoading(true);
        const response = await service.get(`/api/evaluations/${id}`);
        const data = await response.json();
        setEvaluation(data);
      } catch (error) {
        console.error("Failed to fetch evaluation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!evaluation) {
    return <p>No evaluation found.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{evaluation.employee?.name || "Employee"}'s Evaluation</CardTitle>
        <CardDescription>Details and feedback for this evaluation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Sección de Evaluación */}
        <section>
          <h2 className="text-lg font-semibold">Evaluation Details</h2>
          <p><strong>Score:</strong> <Badge>{evaluation.score || "N/A"}</Badge></p>
          <p><strong>Note:</strong> {evaluation.note || "No note provided"}</p>
        </section>

        <Separator />

        <section>
          <h2 className="text-lg font-semibold">Employee Information</h2>
          <p><strong>Name:</strong> {evaluation.employee?.name || "N/A"}</p>
          <p><strong>Age:</strong> {evaluation.employee?.age || "N/A"}</p>
          <p><strong>Email:</strong> {evaluation.employee?.email || "N/A"}</p>
          <p><strong>Role:</strong> {evaluation.employee?.role || "N/A"}</p>
        </section>

        <Separator />

        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">Feedbacks</h2>
          {evaluation.feedbacks && evaluation.feedbacks.length > 0 ? (
            <div className="max-h-72 overflow-y-auto space-y-4">
              {evaluation.feedbacks.map((feedback:any, index:number) => (
                <div
                  key={index}
                  className="p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                >
                  <p className="text-gray-800 mb-2">{feedback.feedback}</p>
                  <p className="text-xs text-gray-400 italic">
                    Created At: {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No feedbacks available for this evaluation.</p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
