import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function EvaluationsTableContent({ evaluations, openFeedbackModal, openEvaluationModal, openEvaluationDetail }:any) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead className="hidden sm:table-cell">Email</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Note</TableHead>
          <TableHead className="hidden sm:table-cell">Reviewer</TableHead>
          <TableHead className="hidden sm:table-cell">Reviewer Email</TableHead>
          <TableHead className="text-center">Actions</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {evaluations.map((evaluation:any, index:number) => (
          <TableRow key={index}>
            <TableCell>{evaluation.employee.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{evaluation.employee.email}</TableCell>
            <TableCell>{evaluation.score}</TableCell>
            <TableCell>
              <div className="relative">
                <p className="line-clamp-3">
                  {evaluation.note || "No note provided"}
                </p>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">{evaluation.evaluator.name}</TableCell>
            <TableCell className="hidden sm:table-cell">{evaluation.evaluator.email}</TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={() => openFeedbackModal(evaluation)}>Add Feedback</Button>
                <Button variant="outline" onClick={() => openEvaluationModal(evaluation)}>Edit</Button>
                <Button variant="outline" onClick={() => openEvaluationDetail(evaluation._id)}>View Details</Button>
              </div>
            </TableCell>
            <TableCell>{new Date(evaluation.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
