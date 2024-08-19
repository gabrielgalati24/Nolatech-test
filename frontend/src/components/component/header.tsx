import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Menu, X } from "lucide-react"; 


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const currentRole = useSelector((state: RootState) => state.auth.role);

  const navigate = useNavigate();


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    // Eliminar token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    

    
    // Redirigir al login
    navigate('/login');
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>

        {/* Icono de menú hamburguesa */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X /> : <Menu />} 
        </button>

        <div className="hidden md:flex gap-4 items-center">
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button asChild>
            <Link to="/evaluations">My Evaluations</Link>
          </Button>

          {(currentRole === "Admin" || currentRole === "Manager") && (
            <Button asChild>
              <Link to="/all-evaluations">All Evaluations</Link>
            </Button>
          )}

          <Button asChild>
            <Link to="/results">Results</Link>
          </Button>

    
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>


      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Button asChild className="w-full">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/evaluations">My Evaluations</Link>
          </Button>
          {(currentRole === "Admin" || currentRole === "Manager") && (
            <Button asChild className="w-full">
              <Link to="/all-evaluations">All Evaluations</Link>
            </Button>
          )}
          <Button asChild className="w-full">
            <Link to="/results">Results</Link>
          </Button>


          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}

export default Header;
