import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Loader } from "../ui/loader";
import { Button } from "@/components/ui/button";
import { service } from "@/utils/service";
import { AddEvaluationModal } from "./add-evaluation-modal";



export function EmployeeProfile() {
  const { id } = useParams(); 
  const [employee, setEmployee] = useState<any>(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false); 
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);


  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      // Fetch employee data
      const employeeResponse = await service.get(`/api/employees/${id}`);
      const employeeData = await employeeResponse.json();
      setEmployee(employeeData);

      // Fetch employee evaluations
      const evaluationsResponse = await service.get(`/api/evaluations/employee/${id}`);
      const evaluationsData = await evaluationsResponse.json();
      setEvaluations(evaluationsData); 
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const openEditModal = (evaluation:any) => {
    setSelectedEvaluation(evaluation); 
    setIsEvaluationModalOpen(true);
  };

  const handleEvaluationUpdate = () => {
    setIsEvaluationModalOpen(false);
    fetchEmployeeData(); 
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto p-4">
      {employee ? (
        <Card>
          <CardHeader>
            <CardTitle>{employee.name}'s Profile</CardTitle>
            <CardDescription>Email: {employee.email}</CardDescription>
            <p>Role: {employee.role}</p>
            <p>Age: {employee.age}</p>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Evaluations History</h3>
            {evaluations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Score</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Evaluator</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((evaluation:any) => (
                    <TableRow key={evaluation._id}>
                      <TableCell>{evaluation.score}</TableCell>
                      <TableCell>{evaluation.note}</TableCell>
                      <TableCell>{evaluation.evaluator.name}</TableCell>
                      <TableCell>
                        <Button variant="outline" onClick={() => openEditModal(evaluation)}>
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>{new Date(evaluation.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>No evaluations found.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <p>Employee not found</p>
      )}


      {selectedEvaluation && (
        <AddEvaluationModal
          isOpen={isEvaluationModalOpen}
          onClose={handleEvaluationUpdate}
          employee={employee}
          evaluation={selectedEvaluation} 
        />
      )}
    </div>
  );
}
