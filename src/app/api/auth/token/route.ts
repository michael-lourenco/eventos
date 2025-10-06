// app/api/auth/token/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { sign } from "jsonwebtoken";

// Esta chave secreta deve ser armazenada em variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "seu_segredo_temporario";

export async function GET(request: Request) {
  try {
    // Obter a sessão atual usando o getServerSession
    // Note que estamos usando o import dinâmico para evitar o erro de exportação
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Criar um token JWT com os dados do usuário
    const token = sign(
      { 
        email: session.user.email,
        name: session.user.name,
        // Adicione outros dados relevantes aqui
      },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );
    
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Erro ao gerar token:", error);
    return NextResponse.json({ error: "Falha ao gerar token de autenticação" }, { status: 500 });
  }
}