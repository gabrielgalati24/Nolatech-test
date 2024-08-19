import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RegisterFormData, registerSchema } from '@/utils/schemas';
import { useNavigate } from 'react-router-dom';
import { endpoints } from '@/utils/endpoints';

import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import { setRole } from '@/store/authSlice';

function Register() {
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate(); 
  const { toast } = useToast(); 
  const dispatch = useDispatch();
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerUser = (data: RegisterFormData) => {
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoints.register}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || 'Registration failed');
          });
        }
        return res.json();
      })
      .then((responseData) => {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('role', responseData.role); 
        dispatch(setRole(responseData.role));

        navigate('/'); 
        toast({
          title: 'Registration successful!',
          variant: 'default',
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: 'Registration failed',
          description: err.message,
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false); 
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit(registerUser)} className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
        </div>
        <Card>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" {...register("name")} placeholder="Enter your name" />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="Enter your email" />
              {errors.email && <p className="text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register("age", { valueAsNumber: true })} placeholder="Enter your age" />
              {errors.age && <p className="text-red-500">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder="Enter your password" />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="Confirm your password" />
              {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value:any) => setValue("role", value)} defaultValue="Employee">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500">{errors.role.message}</p>}
            </div>

          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign Up'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Register;
