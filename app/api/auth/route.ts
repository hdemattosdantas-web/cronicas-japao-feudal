import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, action, name } = await request.json()

    if (action === 'register') {
      if (!name?.trim()) {
        return NextResponse.json(
          { error: 'Nome é obrigatório' },
          { status: 400 }
        )
      }

      if (!email?.trim()) {
        return NextResponse.json(
          { error: 'Email é obrigatório' },
          { status: 400 }
        )
      }

      if (!password || password.length < 6) {
        return NextResponse.json(
          { error: 'Senha deve ter pelo menos 6 caracteres' },
          { status: 400 }
        )
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await userCredential.user.updateProfile({
        displayName: name
      })

      return NextResponse.json({
        message: '✅ Conta criada com sucesso!',
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name
        }
      })
    }

    if (action === 'login') {
      if (!email?.trim() || !password) {
        return NextResponse.json(
          { error: 'Email e senha são obrigatórios' },
          { status: 400 }
        )
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      return NextResponse.json({
        message: '✅ Login realizado com sucesso!',
        user: {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName
        }
      })
    }

    return NextResponse.json(
      { error: 'Ação inválida' },
      { status: 400 }
    )

  } catch (error: any) {
    console.error('Erro na autenticação:', error)
    
    let errorMessage = 'Erro interno do servidor'
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email já está cadastrado'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Senha muito fraca'
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuário não encontrado'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Senha incorreta'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido'
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
