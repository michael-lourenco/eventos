// app/api/markers/remove-by-email/route.ts

import { NextResponse } from "next/server";
import { dbFirestore, removeMarkersByEmail } from "@/services/firebase/FirebaseService";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || "seu_segredo_temporario";

const ADMIN_EMAILS = ['admin@exemplo.com', 'kontempler@gmail.com'];

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ 
        error: 'Token de autenticação não fornecido',
        help: 'Adicione um cabeçalho Authorization com o formato: Bearer seu_token_aqui'
      }, { status: 401 });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'Formato de token inválido',
        received: authHeader,
        expected: 'Bearer seu_token_aqui'
      }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    const url = new URL(request.url);
    const targetEmail = url.searchParams.get('email');
    
    if (!targetEmail) {
      return NextResponse.json({ 
        error: 'Parâmetro de email não fornecido',
        help: 'Adicione o parâmetro email na URL: /api/markers/remove-by-email?email=exemplo@dominio.com'
      }, { status: 400 });
    }
    
    try {
      const decoded = verify(token, JWT_SECRET) as { email: string, name: string };
      
      console.log("Token verificado para usuário:", decoded.email);
      
      const isAdmin = process.env.NODE_ENV === 'development' || ADMIN_EMAILS.includes(decoded.email);
      
      if (!isAdmin) {
        return NextResponse.json({ 
          error: 'Permissão negada: Apenas administradores podem executar esta ação',
          userEmail: decoded.email,
          allowedEmails: ADMIN_EMAILS
        }, { status: 403 });
      }
      
      const result = await removeMarkersByEmail(dbFirestore, targetEmail);
      
      return NextResponse.json({
        success: true,
        message: `Removidos com sucesso ${result.count} marcadores do email: ${targetEmail}`,
        removedMarkers: result,
        targetEmail: targetEmail,
        requestedBy: decoded.email
      }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ 
        error: 'Token inválido ou expirado',
        details: (error as Error).message,
        help: 'Obtenha um novo token e tente novamente'
      }, { status: 401 });
    }
  } catch (error) {
    console.error("Erro ao remover marcadores por email:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Falha ao remover marcadores por email",
      details: (error as Error).message
    }, { status: 500 });
  }
}
