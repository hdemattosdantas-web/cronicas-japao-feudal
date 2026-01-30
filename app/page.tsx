export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Cronicas do Japao Feudal
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Sistema migrado para Firebase
          </p>
        </div>
        
        <div className="space-y-4">
          <a
            href="/auth/signin"
            className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Entrar
          </a>
          <a
            href="/auth/register"
            className="block w-full text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Registrar
          </a>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Firebase Configurado</p>
          <p>NextAuth Removido</p>
          <p>Firestore Pronto</p>
        </div>
      </div>
    </div>
  )
}
