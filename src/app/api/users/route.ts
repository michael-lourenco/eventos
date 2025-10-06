// app/api/users/route.ts

import { NextResponse } from "next/server";
import { dbFirestore, fetchUserData } from "@/services/firebase/FirebaseService";
import { verify } from "jsonwebtoken";
import { validateAuth, isAdmin } from "@/lib/auth/api-auth";

// GET - Obter dados do usuário atual
export async function GET(request: Request) {
  try {
    // Validar autenticação
    const auth = await validateAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const userData = await fetchUserData(dbFirestore, auth.user.email);
    
    if (!userData) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Erro ao obter dados do usuário:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao obter dados do usuário" 
    }, { status: 500 });
  }
}