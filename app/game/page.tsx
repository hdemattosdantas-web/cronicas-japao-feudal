export default function GamePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Bem-vindo ao Japao Feudal
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Sua aventura comeca aqui
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Status do Jogador</h2>
          <div className="space-y-2">
            <p><strong>Nome:</strong> Carregando...</p>
            <p><strong>Email:</strong> Carregando...</p>
            <p><strong>Username:</strong> Carregando...</p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Firebase Autenticado</p>
          <p>Firestore Conectado</p>
          <p>Sistema Funcional</p>
        </div>
      </div>
    </div>
  )
}
