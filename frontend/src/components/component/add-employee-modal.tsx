import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { z } from 'zod';
import { service } from '@/utils/service';
import { Loader } from '../ui/loader';
import { useToast } from '../ui/use-toast';


const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "Age must be 18 or older").nonnegative("Age is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["Admin", "Manager", "Employee"] as const),
});

export function AddEmployeeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { toast } = useToast()
  const [employeeData, setEmployeeData] = useState<any>({
    name: '',
    email: '',
    role: 'Employee', // Valor por defecto
    age: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value,
    });
    setErrors((prev: any) => ({ ...prev, [name]: '' })); // Limpiar error
  };

  const handleRoleChange = (role: string) => {
    setEmployeeData({
      ...employeeData,
      role: role,
    });
    setErrors((prev: any) => ({ ...prev, role: '' })); // Limpiar error
  };

  const handleSave = () => {

    try {
      employeeSchema.parse({
        ...employeeData,
        age: Number(employeeData.age) // Convertir la edad a número
      });
      saveEmployee(employeeData);
 
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

  const saveEmployee = async (employeeData: { name: string; email: string; role: string; age: string; password: string }) => {
    setIsLoading(true);
    const employeeDataToSave = {
        ...employeeData,
        age: Number(employeeData.age), 
      };
    try {
      const response = await service.post('/api/auth/register', {
        body: JSON.stringify(employeeDataToSave),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save employee'); 
      }
      setEmployeeData({});
      toast({
        title: 'Employee saved successfully',
        type: 'background',
        variant: 'default',
      })
      onClose();
      return data;
    } catch (error:any) {
        console.log({
            error
        })
      console.error('Error saving employee:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save employee: ${error.message}`,
      });
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Employee</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill in the details below to add a new employee.
          </DialogDescription>
        </DialogHeader>

 
          <>
            {/* Formulario de empleado */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={employeeData.name}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  type="email"
                  value={employeeData.email}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  name="age"
                  placeholder="Enter age"
                  type="number"
                  value={employeeData.age}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
                {errors.age && <p className="text-red-500">{errors.age}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  type="password"
                  value={employeeData.password}
                  onChange={handleInputChange}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
                {errors.password && <p className="text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                <Select onValueChange={handleRoleChange} value={employeeData.role}>
                  <SelectTrigger className="w-full border-gray-300">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-red-500">{errors.role}</p>}
              </div>
            </div>

            <DialogFooter className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={onClose} className="bg-gray-200 hover:bg-gray-300">
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} className="bg-primary text-white hover:bg-primary-dark">
                {isLoading ? <Loader /> : ' Save Employee'}
              </Button>
            </DialogFooter>
          </>
      
      </DialogContent>
    </Dialog>
  );
}
