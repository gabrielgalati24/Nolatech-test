import { Routes, Route } from 'react-router-dom'; // Importar Routes y Route
import Login from './pages/login';
import Register from './pages/register';
import HomePage from './pages/home';
import { Toaster } from "@/components/ui/toaster";
import AllEvaluationsPage from './pages/evaluations';
import ResultsPage from './pages/results';
import EvaluationDetailPage from './pages/evaluation-detail';
import UserEvaluationDetailPage from './pages/user-evaluation-detail';
import EmployeeProfilePage from './pages/employee-profile';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/all-evaluations" element={<AllEvaluationsPage />} />
        <Route path="/evaluations" element={<UserEvaluationDetailPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/evaluation/:id" element={<EvaluationDetailPage />} />
        <Route path="/employee-profile/:id" element={<EmployeeProfilePage />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
