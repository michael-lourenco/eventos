// app/api/users/settings/currency/route.ts

import { NextResponse } from "next/server";
import { dbFirestore, updateUserCurrency } from "@/services/firebase/FirebaseService";
import { verify } from "jsonwebtoken";
import { validateAuth, isAdmin } from "@/lib/auth/api-auth";

// PUT - Atualizar moeda do usuário
export async function PUT(request: Request) {
  try {
    // Validar autenticação
    const auth = await validateAuth(request);
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Obter dados do corpo da requisição
    const { currency } = await request.json();
    
    // Verificar se a moeda foi fornecida
    if (!currency || !currency.value) {
      return NextResponse.json({ 
        error: 'Dados incompletos. Objeto currency com propriedade value é obrigatório' 
      }, { status: 400 });
    }
    
    // Atualizar moeda do usuário
    await updateUserCurrency(auth.user.email, currency, dbFirestore);
    
    return NextResponse.json({
      success: true,
      message: 'Moeda do usuário atualizada com sucesso',
      currency
    });
  } catch (error) {
    console.error("Erro ao atualizar moeda do usuário:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao atualizar moeda do usuário" 
    }, { status: 500 });
  }
}