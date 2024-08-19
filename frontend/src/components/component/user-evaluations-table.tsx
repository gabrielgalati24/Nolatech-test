import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader } from "../ui/loader";
import { service } from "@/utils/service";
import { AddEvaluationModal } from "./add-evaluation-modal";
import { AddFeedbackModal } from "./add-feedback-modal";
import { EvaluationsTableContent } from "./evaluations-table-content";
import { Pagination } from "./pagination-table";


export function UserEvaluationsTable() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams() as any;
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const navigate = useNavigate();

  const fetchEvaluations = async (page = 1) => {
    setLoading(true);
    try {
      const response = await service.get(`/api/evaluations/evaluator?page=${page}&limit=10`);
      const data = await response.json();
      setEvaluations(data.evaluations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch evaluations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setSearchParams({ page: currentPage - 1 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setSearchParams({ page: currentPage + 1 });
    }
  };

  const openEvaluationModal = (evaluation:any) => {
    setSelectedEvaluation(evaluation);
    setIsEvaluationModalOpen(true);
  };

  const openFeedbackModal = (evaluation:any) => {
    setSelectedEvaluation(evaluation);
    setIsFeedbackModalOpen(true);
  };

  const openEvaluationDetail = (evaluationId:any) => {
    navigate(`/evaluation/${evaluationId}`);
  };

  const handleEvaluationUpdate = () => {
    setIsEvaluationModalOpen(false);
    fetchEvaluations(currentPage);
  };

  const handleFeedbackAdded = () => {
    setIsFeedbackModalOpen(false);
    fetchEvaluations(currentPage);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee Evaluations</CardTitle>
        <CardDescription>Review the latest employee evaluations and their details.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader />
        ) : evaluations.length === 0 ? ( 
          <p className="text-center text-gray-500">No evaluations available.</p>  // Mostrar mensaje si no hay evaluaciones
        ) : (
          <>
            <EvaluationsTableContent
              evaluations={evaluations}
              openFeedbackModal={openFeedbackModal}
              openEvaluationModal={openEvaluationModal}
              openEvaluationDetail={openEvaluationDetail}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
            />
          </>
        )}
      </CardContent>


      {selectedEvaluation && (
        <AddEvaluationModal
          isOpen={isEvaluationModalOpen}
          onClose={handleEvaluationUpdate}
          employee={selectedEvaluation.employee}
          evaluation={selectedEvaluation || {}}
        />
      )}

      {selectedEvaluation && (
        <AddFeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={handleFeedbackAdded}
          employee={selectedEvaluation.employee}
          evaluation={selectedEvaluation || {}}
        />
      )}
    </Card>
  );
}
