import { verify } from "jsonwebtoken";

// Define types for authentication results
export type AuthSuccess = {
  valid: true
  user: { email: string; name: string }
}

export type AuthFailure = {
  valid: false
  error: string
}
// auth success or failure
export type AuthResult = AuthSuccess | AuthFailure

// Get the JWT secret from environment variables
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET

  if (!secret) {
    console.warn("Warning: JWT_SECRET or NEXT_PUBLIC_NEXTAUTH_SECRET is not defined")
    return "seu_segredo_temporario" // Fallback, but you should set a proper secret
  }

  return secret
}

/**
 * Validates authentication from a request's Authorization header
 * @param request The incoming request object
 * @returns AuthResult indicating success or failure
 */
export async function validateAuth(request: Request): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Token de autenticação não fornecido" }
  }

  const token = authHeader.split(" ")[1]
  const JWT_SECRET = getJwtSecret()

  try {
    const decoded = verify(token, JWT_SECRET) as { email: string; name: string }
    return { valid: true, user: decoded }
  } catch (error) {
    return { valid: false, error: "Token inválido ou expirado" }
  }
}

// List of admin emails - you might want to move this to environment variables or a database
export const ADMIN_EMAILS = ["admin@exemplo.com", "kontempler@gmail.com "]

/**
 * Checks if a user has admin privileges
 * @param email The user's email address
 * @returns boolean indicating if the user is an admin
 */
export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email)
}
