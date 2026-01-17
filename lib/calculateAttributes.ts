export interface CharacterAttributes {
  corpo: number;      // Constituição física, saúde
  força: number;      // Força de vontade, determinação
  agilidade: number;  // Velocidade, reflexos
  percepção: number;  // Awareness espiritual e mundano
  intelecto: number;  // Conhecimento, raciocínio
  vontade: number;    // Força espiritual, resistência mental
}

export function calculateAttributes(
  lore: string,
  age: number,
  profession: string
): CharacterAttributes {
  // Atributos base (5 em tudo, não 10)
  const baseAttributes: CharacterAttributes = {
    corpo: 5,
    força: 5,
    agilidade: 5,
    percepção: 5,
    intelecto: 5,
    vontade: 5
  };

  // Limites: mínimo 3, máximo 8
  const clamp = (value: number) => Math.max(3, Math.min(8, value));

  // Modificadores baseados na idade (mais sutis)
  const ageModifier = Math.max(0, Math.min(2, Math.floor((age - 18) / 15)));
  baseAttributes.corpo += ageModifier;
  baseAttributes.percepção += ageModifier;

  // Modificadores baseados na profissão (reais e plausíveis)
  const professionModifiers: Record<string, Partial<CharacterAttributes>> = {
    "Camponês": { corpo: 1, força: 1 },
    "Ferreiro": { corpo: 1, agilidade: 1 },
    "Lenhador": { corpo: 2, força: 1 },
    "Pescador": { corpo: 1, percepção: 1 },
    "Mercador": { intelecto: 1, percepção: 1 },
    "Mensageiro": { agilidade: 2, percepção: 1 },
    "Monge budista": { vontade: 2, percepção: 1 },
    "Sacerdote xintoísta": { vontade: 1, intelecto: 1 },
    "Soldado raso": { corpo: 1, força: 1 },
    "Curandeiro": { intelecto: 1, percepção: 1 },
    "Artista ambulante": { percepção: 1, intelecto: 1 }
  };

  const profModifier = professionModifiers[profession] || {};
  Object.entries(profModifier).forEach(([attr, value]) => {
    (baseAttributes as any)[attr] += value;
  });

  // Modificadores baseados na lore (mais sutis)
  const loreWords = lore.split(' ').length;
  const loreModifier = Math.max(0, Math.min(2, Math.floor(loreWords / 50)));
  baseAttributes.percepção += loreModifier;
  baseAttributes.intelecto += loreModifier;

  // Aplicar limites
  Object.keys(baseAttributes).forEach(key => {
    (baseAttributes as any)[key] = clamp((baseAttributes as any)[key]);
  });

  return baseAttributes;
}