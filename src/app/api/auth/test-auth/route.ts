// app/api/auth/test-auth/route.ts

import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

// Esta chave secreta deve ser a mesma usada para assinar o token
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "seu_segredo_temporario";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    // Verificar se o cabeçalho de autorização existe
    if (!authHeader) {
      return NextResponse.json({ 
        error: 'Cabeçalho Authorization não encontrado',
        dica: 'Adicione um cabeçalho Authorization com valor: Bearer seu_token_aqui'
      }, { status: 401 });
    }
    
    // Verificar se o formato do cabeçalho está correto
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Formato incorreto do cabeçalho Authorization',
        cabeçalhoRecebido: authHeader,
        formatoEsperado: 'Bearer seu_token_aqui'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verificar e decodificar o token
      const decoded = verify(token, JWT_SECRET) as { email: string, name: string };
      
      return NextResponse.json({
        success: true,
        message: 'Token válido',
        userData: {
          email: decoded.email,
          name: decoded.name
        },
        tokenInfo: {
          secretUsado: JWT_SECRET === process.env.JWT_SECRET ? 'JWT_SECRET' : 
                       JWT_SECRET === process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ? 'NEXT_PUBLIC_NEXTAUTH_SECRET' : 
                       'fallback_secret'
        }
      });
    } catch (error) {
      return NextResponse.json({ 
        error: 'Token inválido ou expirado',
        detalhes: (error as Error).message
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      error: 'Erro no processamento da autenticação',
      detalhes: (error as Error).message
    }, { status: 500 });
  }
}