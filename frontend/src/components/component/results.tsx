import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { service } from "@/utils/service";
import { Loader } from "@/components/ui/loader";
import * as XLSX from "xlsx";
import { Employee, EvaluationData } from "@/utils/types";




export function EmployeeSearchAndResults() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await service.get(`/api/employees?search=${searchTerm}`);
      const data = await response.json();
      setEmployees(data.employees as Employee[]);
      setIsFirstSearch(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluationData = async (employeeId: string): Promise<EvaluationData | null> => {
    try {
      const response = await service.get(`/api/evaluations/results/${employeeId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching evaluation results:", error);
      return null;
    }
  };

  const exportToExcel = async () => {
    const exportDataPromises = employees.map(async (employee) => {
      const evaluationData = await fetchEvaluationData(employee._id);
      return {
        Name: employee.name,
        Email: employee.email,
        Role: employee.role,
        Total_Evaluations: evaluationData?.totalEvaluations || "N/A",
        Average_Score: evaluationData?.averageScore || "N/A",
        Max_Score: evaluationData?.maxScore || "N/A",
        Min_Score: evaluationData?.minScore || "N/A",
      };
    });

    const exportData = await Promise.all(exportDataPromises);

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Evaluations");

    XLSX.writeFile(workbook, "employee_evaluations.xlsx");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Search Employee Evaluations</CardTitle>
        <CardDescription>Search for employees and see their evaluation statistics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-4">
          <Input
            placeholder="Search for an employee..."
            aria-label="Search for employee by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 sm:mb-0"
          />
          <Button variant="blue" onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
          {employees.length > 0 && (
            <Button variant="blue" onClick={exportToExcel} className="w-full sm:w-auto ml-4">Export to Excel</Button>
          )}
        </div>

        {loading && <Loader aria-label="Loading employees..." />} 

        <div className="mt-4">
          {!loading && employees.length === 0 && !isFirstSearch && (
            <p className="text-center text-gray-500">No employees found matching your search.</p>
          )}

          {employees.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employees.map((employee) => (
                <div key={employee._id} className="p-6 border border-gray-300 rounded-lg shadow-md focus-within:outline focus-within:outline-blue-600" role="region" aria-labelledby={`employee-${employee._id}`}>
                  <h3 id={`employee-${employee._id}`} className="text-lg font-semibold mb-2">
                    {employee.name} <span className="text-sm text-gray-600">({employee.email})</span>
                  </h3>
                  <p>Role: {employee.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
