import z from "zod";


export const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email('Please enter a valid email address'),
  password: z.string().min(1, "Password is required"),
});
export type SignInFormData = z.infer<typeof signInSchema>;


export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  familyName: z.string().min(1, 'Family name is required'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
export type SignUpFormData = z.infer<typeof signUpSchema>;


export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;