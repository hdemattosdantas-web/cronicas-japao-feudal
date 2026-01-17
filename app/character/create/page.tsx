"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { professions, Profession } from "@/lib/professions";
import ImageUpload from "@/app/components/ImageUpload";

export default function CreateCharacterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [name, setName] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (!session) router.push("/auth/signin");
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="container fade-in">
        <div className="card text-center">
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }
  const [age, setAge] = useState("");
  const [origin, setOrigin] = useState("Owari");
  const [lore, setLore] = useState("");
  const [profession, setProfession] = useState("Camponês");
  const [characterImage, setCharacterImage] = useState<File | null>(null);
  const [characterImageUrl, setCharacterImageUrl] = useState<string>('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  function validateForm(): boolean {
    const newErrors: {[key: string]: string} = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!age) {
      newErrors.age = "Idade é obrigatória";
    } else {
      const ageNum = parseInt(age);
      if (ageNum < 18) {
        newErrors.age = "Idade mínima é 18 anos";
      } else if (ageNum > 80) {
        newErrors.age = "Idade máxima é 80 anos";
      }
    }

    if (!lore.trim()) {
      newErrors.lore = "História de vida é obrigatória";
    } else if (lore.length < 50) {
      newErrors.lore = "História deve ter pelo menos 50 caracteres";
    } else if (lore.length > 1000) {
      newErrors.lore = "História deve ter no máximo 1000 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      router.push(
        `/character/confirm?name=${encodeURIComponent(name)}&age=${age}&origin=${origin}&profession=${encodeURIComponent(
          profession
        )}&lore=${encodeURIComponent(lore)}&image=${encodeURIComponent(characterImageUrl)}`
      );
    }, 500);
  }

  return (
    <div className="container fade-in">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
              🎭 Criação de Personagem
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Bem-vindo, {session?.user?.name || session?.user?.email}! Vamos criar seu personagem para o Japão feudal.
            </p>
          </div>
          <Link href="/">
            <button style={{
              background: 'transparent',
              border: '2px solid var(--border)',
              color: 'var(--foreground)',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              ← Voltar
            </button>
          </Link>
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* Character Image Upload */}
          <div className="text-center">
            <label className="block text-sm font-semibold mb-4">
              🖼️ Imagem do Personagem (Opcional)
            </label>
            <ImageUpload
              onImageChange={(file, url) => {
                setCharacterImage(file)
                setCharacterImageUrl(url || '')
              }}
              placeholder="Adicione uma imagem para seu personagem"
              size="large"
              shape="circle"
            />
            <p className="text-xs opacity-70 mt-2">
              PNG, JPG ou GIF • Máximo 5MB
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              👤 Nome do Personagem *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              className="w-full"
              style={{ borderColor: errors.name ? '#dc3545' : undefined }}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">❌ {errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              🎂 Idade *
            </label>
            <input
              type="number"
              min={18}
              max={80}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="18-80 anos"
              className="w-full"
              style={{ borderColor: errors.age ? '#dc3545' : undefined }}
            />
            {errors.age && (
              <p className="text-red-600 text-sm mt-1">❌ {errors.age}</p>
            )}
            <p className="text-xs opacity-70 mt-1">
              No Japão feudal, a maturidade vem com a experiência de vida
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              🗺️ Província de Origem
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full"
            >
              <option value="Owari">🏯 Owari - Terras férteis do centro</option>
              <option value="Kai">⛰️ Kai - Montanhas e tradições antigas</option>
              <option value="Amashito">🌊 Amashito - Costas e comércio marítimo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              ⚒️ Profissão
            </label>
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full"
            >
              {professions.map((p: Profession) => (
                <option key={p.name} value={p.name}>
                  {p.name} — {p.description}
                </option>
              ))}
            </select>
            <p className="text-xs opacity-70 mt-1">
              Sua profissão molda suas habilidades e perspectivas de vida
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              📖 História de Vida (Lore) *
            </label>
            <textarea
              rows={8}
              value={lore}
              onChange={(e) => setLore(e.target.value)}
              placeholder="Conte a história de vida do seu personagem. Como ele chegou até aqui? Que experiências moldaram sua personalidade? Que sonhos ou medos ele carrega?"
              className="w-full resize-vertical"
              style={{ borderColor: errors.lore ? '#dc3545' : undefined }}
            />
            {errors.lore && (
              <p className="text-red-600 text-sm mt-1">❌ {errors.lore}</p>
            )}
            <div className="flex justify-between text-xs opacity-70 mt-1">
              <span>{lore.length}/1000 caracteres</span>
              <span>Mínimo 50 caracteres</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '✨ Criando Personagem...' : '🎭 Criar Personagem'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'rgba(139, 69, 19, 0.1)' }}>
          <h3 className="font-semibold mb-2">💡 Dicas para uma boa lore:</h3>
          <ul className="text-sm space-y-1 opacity-80">
            <li>• Descreva origens humildes e realistas</li>
            <li>• Mencione perdas, conquistas ou desafios</li>
            <li>• Mostre personalidade através de ações passadas</li>
            <li>• Evite poderes sobrenaturais no início</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
