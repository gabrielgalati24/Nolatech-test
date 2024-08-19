import { z } from 'zod';

// Esquema para el login
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Esquema para el registro
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" }),
  age: z
    .number()
    .min(18, { message: "Age must be 18 or older" })
    .nonnegative({ message: "Age is required" }),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password confirmation is required" }),
  role: z
    .enum(["Admin", "Manager", "Employee"])
    .default("Employee"),  // Valor por defecto
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords don't match",
});


export type RegisterFormData = z.infer<typeof registerSchema>;
