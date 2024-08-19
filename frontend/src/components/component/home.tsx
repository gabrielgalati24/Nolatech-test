import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { service } from "@/utils/service";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AddEmployeeModal } from "./add-employee-modal";
import { AddEvaluationModal } from "./add-evaluation-modal";
import { Link } from "react-router-dom";
import Header from "./header";

export function Home() {

  const currentRole = useSelector((state: RootState) => state.auth.role);



  // const [currentRole, setCurrentRole] = useState("admin");
  const [employees, setEmployees] = useState([]); // Inicializamos con un array vacío
  const [loading, setLoading] = useState(true); // Estado de carga
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [itemsPerPage] = useState<any>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // 
  // Función para obtener los empleados desde la API


  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // Usamos el servicio `service.get` en lugar de `fetch` directamente
      const response = await service.get(`/api/employees`);
      const data = await response.json();
  
      // Actualizamos el estado con los empleados y el total
      setEmployees(data.employees || []); // Asegurarse de que sea un array
      setTotalEmployees(data.total || 0); // Asegurarse de que sea un número
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };
  
  // Efecto para realizar la solicitud cuando el componente se monta o cuando se cambia la página o el límite de items
  useEffect(() => {
    fetchEmployees();
  }, [currentPage, itemsPerPage]);

  // Aplicar el filtro solo si employees está definido como un array
  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((employee) =>
        Object.values(employee).some((value:any) => value.toString().toLowerCase().includes(filterText.toLowerCase()))
      )
    : [];

  const sortedEmployees = filteredEmployees.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (column:any) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleFilter = (event:any) => {
    setFilterText(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page:any) => {
    setCurrentPage(page);
  };

  // const handleRoleChange = (role) => {
  //   setCurrentRole(role);
  // };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 p-6">
        {currentRole && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Employees</CardTitle>
                <CardDescription>View and manage employee information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-full max-w-md">
                    <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search employees..."
                      className="pl-8"
                      value={filterText}
                      onChange={handleFilter}
                    />
                  </div>
                  <Button variant={"blue"} onClick={() => setIsModalOpen(true)}>Add Employee</Button>
                </div>
                {loading ? (
                  <p>Loading employees...</p> // Indicador de carga
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                            Name{" "}
                            {sortColumn === "name" && (
                              <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("position")}>
                            Role{" "}
                            {sortColumn === "role" && (
                              <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                            Email{" "}
                            {sortColumn === "email" && (
                              <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                            )}
                          </TableHead>
                          <TableHead className="cursor-pointer" onClick={() => handleSort("hireDate")}>
                            Total Evaluations{" "}
                            {sortColumn === "hireDate" && (
                              <span className="ml-1">{sortDirection === "asc" ? "\u2191" : "\u2193"}</span>
                            )}
                          </TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedEmployees.map((employee:any) => (
                          <TableRow key={employee._id}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell>{employee.email}</TableCell>
                            <TableCell>{employee.evaluations.length}</TableCell>
                            <TableCell>
                            <Link to={`/employee-profile/${employee._id}`}>
                                <Button variant="outline">View Profile</Button>
                              </Link>
                            <Button
                            variant={"outline"}
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setIsEvaluationModalOpen(true);
                                }}
                                className="text-primary hover:text-primary-dark"
                              >
                                Add Evaluation
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="flex justify-end mt-4">
                      <Pagination
                        currentPage={currentPage as number}
                        totalPages={Math.ceil(totalEmployees / itemsPerPage)}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <AddEmployeeModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          fetchEmployees();
        }} 
      />

{selectedEmployee && (
        <AddEvaluationModal
          isOpen={isEvaluationModalOpen}
          onClose={() => {
            setIsEvaluationModalOpen(false)
            fetchEmployees();
          }}
          employee={selectedEmployee} // Pasar el empleado seleccionado al modal
        />
      )}
    </div>
  );
}
