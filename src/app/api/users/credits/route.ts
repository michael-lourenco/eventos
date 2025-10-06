import { NextResponse } from "next/server"
import { dbFirestore } from "@/services/firebase/FirebaseService"
import { verify } from "jsonwebtoken"
import { updateUserCredits } from "@/services/firebase/FirebaseService" // Make sure this import is correct
import { validateAuth, isAdmin } from "@/lib/auth/api-auth"

export async function PUT(request: Request) {
  try {
    // Validar autenticação
    const auth = await validateAuth(request)
    if (!auth.valid) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    // Verificar se é administrador
    if (!isAdmin(auth.user.email)) {
      return NextResponse.json(
        {
          error: "Permissão negada: Apenas administradores podem atualizar créditos",
        },
        { status: 403 },
      )
    }

    // Obter dados do corpo da requisição
    const { email, credits } = await request.json()

    // Verificar se os dados necessários foram fornecidos
    if (!email || credits === undefined) {
      return NextResponse.json(
        {
          error: "Dados incompletos. email e credits são obrigatórios",
        },
        { status: 400 },
      )
    }

    // Atualizar créditos do usuário - note the correct parameter order
    await updateUserCredits(email, credits, dbFirestore)

    return NextResponse.json({
      success: true,
      message: "Créditos do usuário atualizados com sucesso",
      email,
      credits,
    })
  } catch (error) {
    console.error("Erro ao atualizar créditos do usuário:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Falha ao atualizar créditos do usuário",
      },
      { status: 500 },
    )
  }
}
