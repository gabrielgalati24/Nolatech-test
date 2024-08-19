import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { LoginFormData, loginSchema } from '@/utils/schemas';
import { endpoints } from '@/utils/endpoints';
import { useDispatch } from 'react-redux';
import { setRole } from '@/store/authSlice';

function Login() {
  const [isLoading, setIsLoading] = useState(false);  
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const login = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(''); 

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoints.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await res.json();
      localStorage.setItem('token', responseData.token);
      localStorage.setItem('role', responseData.role); 
      dispatch(setRole(responseData.role));
      
      navigate('/'); // Redirige solo si el login es exitoso
    } catch (err:any) {
      setErrorMessage(err.message); 
      console.log(err);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit(login)} className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Enter your credentials to access your account.</p>
        </div>
        <Card>
          <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Email">Email</Label>
            <Input id="Email" type="text" {...register("email")} placeholder="Enter your email" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder="Enter your password" />
              {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </CardFooter>
        </Card>
        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
