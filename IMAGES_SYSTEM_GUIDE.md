# 🎨 Sistema de Imagens - Crônicas do Japão

## Visão Geral

Implementado sistema completo de imagens incluindo backgrounds temáticos, mapa visual e upload de imagens de personagem.

## 📁 Estrutura de Imagens

### **Pasta `public/images/`**
```
public/images/
├── feudal-bg.jpeg     # Background atmosférico da página inicial (JPEG)
├── japan-map-bg.jpeg  # Background do mapa do jogo (JPEG)
├── feudal-bg.svg      # Versão SVG (mantida como backup)
├── japan-map-bg.svg   # Versão SVG (mantida como backup)
└── uploads/           # Imagens enviadas pelos usuários (criado dinamicamente)
```

## 🎭 Backgrounds Temáticos

### **Background Feudal (`feudal-bg.jpeg`)**
```svg
<!-- Características -->
- Gradiente azul-escuro (noite profunda)
- Névoa sutil com movimento animado
- Silhuetas de templos e torii gates
- Textura de envelhecimento
- Efeitos de profundidade
```

**Aplicação**: Página inicial com atmosfera misteriosa

### **Background do Mapa (`japan-map-bg.jpeg`)**
```svg
<!-- Características -->
- Padrão de pergaminho antigo
- Oceanos e montanhas estilizadas
- Rios e caminhos marcados
- Localizações importantes destacadas
- Rosa dos ventos funcional
- Escala cartográfica
```

**Aplicação**: Mapa do jogo com visual medieval

## 🎨 Estilos CSS

### **Variáveis CSS**
```css
:root {
  --bg-feudal: url('/images/feudal-bg.jpeg');
  --bg-map: url('/images/japan-map-bg.jpeg');
}
```

### **Classes de Background**
```css
.bg-feudal    /* Página inicial com atmosfera feudal */
.bg-map       /* Mapa com visual de pergaminho */
```

### **Estilos de Upload**
```css
.image-upload-container    /* Container do upload */
.character-image          /* Imagem circular do personagem */
.upload-placeholder       /* Texto de instrução */
```

## 📤 Sistema de Upload

### **Componente `ImageUpload.tsx`**
```typescript
interface ImageUploadProps {
  onImageChange: (file: File | null, imageUrl?: string) => void
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  shape?: 'square' | 'circle'
}
```

**Características**:
- ✅ Validação de tipo (apenas imagens)
- ✅ Limite de tamanho (5MB)
- ✅ Preview instantâneo
- ✅ Upload automático
- ✅ Remoção fácil
- ✅ Feedback visual

### **API Route `/api/upload`**
```typescript
// Validações implementadas:
- Autenticação obrigatória
- Tipo de arquivo (image/*)
- Tamanho máximo (5MB)
- Nome único por usuário/timestamp
```

**Resposta**:
```json
{
  "success": true,
  "imageUrl": "/uploads/user123_1234567890.jpg",
  "message": "Imagem enviada com sucesso"
}
```

## 🎯 Integração com Personagens

### **Criação de Personagem**
```tsx
// Campo opcional no formulário
<ImageUpload
  onImageChange={(file, url) => {
    setCharacterImage(file)
    setCharacterImageUrl(url || '')
  }}
  placeholder="Adicione uma imagem para seu personagem"
  size="large"
  shape="circle"
/>
```

### **Confirmação de Personagem**
```tsx
// Exibe imagem se fornecida
{image && (
  <img
    src={image}
    alt={`Imagem de ${name}`}
    className="character-image mx-auto"
  />
)}
```

### **Salvamento no Banco**
```json
{
  "name": "Hiroshi",
  "age": 25,
  "profession": "Samurai",
  "image": "/uploads/user123_1234567890.jpg",
  // ... outros campos
}
```

## 🗺️ Integração no Mapa

### **Background do Mapa**
```tsx
// GameMap.tsx atualizado
<defs>
  <pattern id="mapBackground">
    <image href="/images/japan-map-bg.jpeg" />
  </pattern>
</defs>

<rect fill="url(#mapBackground)" />
```

**Visual Resultado**:
- ✅ Fundo de pergaminho antigo
- ✅ Elementos cartográficos
- ✅ Atmosfera histórica
- ✅ Compatível com elementos interativos

## 📊 Impacto Visual

### **Página Inicial**
```
Antes: Fundo branco simples
Depois: Background feudal com névoa e templos
```

### **Mapa do Jogo**
```
Antes: Padrão verde simples
Depois: Pergaminho com rios, montanhas e cidades
```

### **Personagens**
```
Antes: Sem imagem personalizada
Depois: Avatar circular customizável
```

## 🔧 Configuração Técnica

### **Dependências**
```json
// Nenhuma nova dependência necessária
// Usa APIs nativas do navegador:
// - File API
// - FormData
// - Fetch API
```

### **Limitações de Segurança**
```typescript
// Validações implementadas:
✅ Autenticação obrigatória
✅ Tipos de arquivo restritos
✅ Limite de tamanho
✅ Sanitização de nomes
✅ Isolamento de uploads por usuário
```

### **Performance**
```typescript
// Otimizações:
✅ Upload assíncrono
✅ Preview local (sem upload desnecessário)
✅ Cache de imagens
✅ Compressão automática via navegador
```

## 🎨 Design System

### **Tamanhos de Imagem**
```css
.image-small   { width: 6rem; height: 6rem; }   /* 96px */
.image-medium  { width: 8rem; height: 8rem; }   /* 128px */
.image-large   { width: 10rem; height: 10rem; } /* 160px */
```

### **Formatos Suportados**
- ✅ PNG (transparência)
- ✅ JPG/JPEG (compactação)
- ✅ GIF (animação)
- ✅ WebP (moderno)

### **Aspectos Visuais**
```css
/* Imagem circular */
.character-image {
  border-radius: 50%;
  border: 3px solid var(--accent);
  box-shadow: 0 4px 8px var(--shadow);
}
```

## 🚀 Próximos Passos

### **Possíveis Melhorias**
- 📸 **Galeria de Avatares**: Avatares pré-definidos
- 🎨 **Filtros de Imagem**: Ajustes de brilho/contraste
- 📏 **Crop Automático**: Recorte inteligente
- ☁️ **CDN Externo**: Para melhor performance
- 🔄 **Compressão**: Redução automática de tamanho

### **Integrações Futuras**
- 🎭 **Imagens de NPCs**: Sistema de avatares para personagens do jogo
- 🏞️ **Backgrounds Dinâmicos**: Muda com a hora do dia/clima
- 📖 **Imagens de Eventos**: Ilustrações para encontros especiais

---

**O sistema de imagens transforma Crônicas do Japão de texto puro para uma experiência verdadeiramente imersiva, com atmosfera visual rica e personalização de personagens!** 🎨🖼️⚔️