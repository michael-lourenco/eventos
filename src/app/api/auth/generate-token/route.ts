// app/api/auth/generate-token/route.ts

import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";

// Esta chave secreta deve ser a mesma usada nos outros endpoints
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "seu_segredo_temporario";

export async function POST(request: Request) {
  try {
    // Apenas permitir em ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Este endpoint não está disponível em produção' }, { status: 403 });
    }
    
    // Obter dados do corpo da requisição
    const body = await request.json();
    const { email, password } = body;
    
    // Uma senha simples para proteger este endpoint de teste
    // Em produção, use um sistema de autenticação adequado!
    const testPassword = process.env.TEST_AUTH_PASSWORD || "teste";
    
    if (!email || !password || password !== testPassword) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }
    
    // Gerar token
    const token = sign(
      { 
        email,
        name: "Admin Test User",
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Retornar instruções completas para uso no Postman
    return NextResponse.json({
      token,
      instructions: {
        postman: "Copie este token e adicione ao cabeçalho Authorization como 'Bearer [token]'",
        curl: `curl -X DELETE -H "Authorization: Bearer ${token}" http://seu-dominio.com/api/markers/remove-anonymous`
      },
      securityNote: "Este endpoint é apenas para testes. Não use em produção."
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Falha ao gerar token',
      details: (error as Error).message
    }, { status: 500 });
  }
}