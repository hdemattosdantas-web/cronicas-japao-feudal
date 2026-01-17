# 🏯 Crônicas do Japão Feudal

Um RPG de vida online ambientado no período Sengoku do Japão feudal, onde uma **IA Mestre do Mundo** controla toda a narrativa, encontros com criaturas místicas e interações com NPCs. Jogue solo ou com amigos em tempo real!

## 🌟 Características Principais

### 🤖 IA Mestre do Mundo
- **Narrativa Dinâmica**: A IA gera histórias únicas baseadas nas suas escolhas
- **Controle Total**: Define encontros, diálogos NPC e rumos da trama
- **Adaptação Inteligente**: O mundo muda baseado no comportamento do jogador
- **Elementos Sobrenaturais**: Criaturas yokai, espíritos e magia sutil

### 🎮 Jogabilidade
- **Solo ou Multiplayer**: Até 8 jogadores por sala
- **Sistema de Atributos**: Corpo, Força, Agilidade, Percepção, Intelecto, Vontade
- **Progressão Orgânica**: Crescimento lento e realista
- **Profissões Históricas**: Camponês, Ferreiro, Monge, Samurai, etc.
- **Sistema de Amigos**: Adicionar, convidar, ver online/offline

### 💬 Tempo Real
- **WebSockets**: Comunicação instantânea
- **Chat Integrado**: Conversas durante a jornada
- **Estado Sincronizado**: Todos veem as mesmas mudanças
- **Interações Live**: NPCs respondem em tempo real

## 🚀 Como Jogar

### 1. Configuração Inicial
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente (.env.local)
NEXTAUTH_URL="http://localhost:4000"
NEXTAUTH_SECRET="sua-chave-secreta"
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
OPENAI_API_KEY="sua-chave-openai" # Para IA funcionar

# Iniciar servidor
npm run dev
```

### 2. Primeiro Login
- Acesse `http://localhost:4000`
- Clique "Entrar" → "Continuar com Google"
- Faça login com sua conta Google

### 3. Criar Personagem
- Vá para "🎭 Criar Personagem"
- Escolha nome, idade, província e profissão
- **Importante**: Escreva uma lore detalhada (mínimo 50 caracteres)
- O sistema calcula atributos automaticamente

### 4. Escolher Modo de Jogo

#### 🎯 Modo Solo
- Vá para "🏯 Meus Personagens"
- Clique "🎮 Jogar" em qualquer personagem
- A IA Mestre do Mundo guiará sua jornada pessoal

#### 👥 Modo Multiplayer
- Vá para "🏰 Salas"
- **Criar Sala**: Defina nome, descrição e campanha
- **Entrar em Sala**: Junte-se a aventuras de outros jogadores
- **Chat em Tempo Real**: Converse com outros aventureiros

## 🎲 Sistema de Jogo

### Atributos Principais
- **Corpo**: Saúde física e resistência
- **Força**: Força de vontade e determinação
- **Agilidade**: Velocidade e reflexos
- **Percepção**: Awareness espiritual e sentidos
- **Intelecto**: Conhecimento e raciocínio
- **Vontade**: Força espiritual e resistência mental

### Profissões Disponíveis
- 🧑‍🌾 Camponês
- 🔨 Ferreiro
- 🌲 Lenhador
- 🐟 Pescador
- 💰 Mercador
- 🏃 Mensageiro
- 🧘 Monge Budista
- ⛩️ Sacerdote Xintoísta
- ⚔️ Soldado Raso
- 🌿 Curandeiro
- 🎭 Artista Ambulante

### Campanhas Disponíveis
- **🏯 Jornada Inicial**: Introdução ao mundo feudal
- *Mais campanhas em desenvolvimento*

## 🧠 Como a IA Funciona

### Mestre do Mundo
A IA controla:
- **Narrativa Principal**: Descreve cenas e eventos
- **Encontros Aleatórios**: Decide quando criaturas aparecem
- **Diálogos NPC**: Gera respostas contextuais
- **Adaptação Mundial**: Muda o mundo baseado em escolhas
- **Eventos Dinâmicos**: Cria quests e situações únicas

### Exemplos de IA em Ação

**Narrativa Dinâmica:**
```
Jogador escolhe: "Investigar os sons estranhos na floresta"

IA responde: "Enquanto caminha pela floresta densa, você ouve sussurros antigos no vento.
De repente, uma figura translúcida emerge das árvores - um kodama, espírito guardião da floresta.
Seus olhos brilham com sabedoria ancestral..."
```

**NPC com Personalidade:**
```
Jogador: "Olá, sensei. Busco conhecimento espiritual."

NPC Monge (gerado por IA): "Ah, jovem peregrino. Vejo em seus olhos a chama da curiosidade.
Mas cuidado - nem todo conhecimento é benéfico. O que você busca exatamente?"
```

## 🛠️ Arquitetura Técnica

### Frontend
- **Next.js 15** com App Router
- **TypeScript** para type safety
- **Tailwind CSS** para styling
- **Socket.IO Client** para tempo real

### Backend
- **Next.js API Routes** para REST endpoints
- **Socket.IO Server** para WebSockets
- **SQLite** para dados locais
- **NextAuth.js** para autenticação

### IA Integration
- **OpenAI GPT-4** para geração de conteúdo
- **Prompts Contextuais** baseados no estado do jogo
- **Fallbacks** para quando IA não está disponível

### Multiplayer
- **Salas de Jogo** compartilhadas
- **Estado Sincronizado** entre jogadores
- **Chat Integrado** na interface
- **Limite de 8 jogadores** por sala

## 👥 Sistema de Amigos
- **Adicionar Amigos**: Busca por email e envio de convites
- **Status Online**: Indicadores visuais em tempo real
- **Convites**: Sistema completo para salas multiplayer
- **Pedidos de Amizade**: Aceitar/recusar com notificações

## 📁 Estrutura do Projeto

```
📦 crônicas-japão-feudal/
├── 📂 app/                    # Next.js App Router
│   ├── 📂 api/               # API Routes
│   ├── 📂 auth/              # Páginas de autenticação
│   ├── 📂 character/         # Sistema de personagens
│   ├── 📂 game/              # Interface principal do jogo
│   ├── 📂 rooms/             # Sistema de salas multiplayer
│   └── 📂 characters/        # Lista de personagens
├── 📂 lib/                   # Lógica de negócio
│   ├── 📂 ai/               # Integração com OpenAI
│   ├── 📂 auth/             # Configuração NextAuth
│   ├── 📂 game/             # Tipos e dados do jogo
│   ├── 📂 game-master/      # Engine da IA Mestre
│   └── 📂 websockets/       # Gerenciamento Socket.IO
├── 📂 data/                  # Dados do jogo (campanhas, etc.)
└── 📂 prisma/               # Schema do banco (futuro)
```

## 🎯 Funcionalidades Implementadas

### ✅ Core Features
- [x] Autenticação Google OAuth
- [x] Sistema de criação de personagens
- [x] Atributos calculados dinamicamente
- [x] Persistência de dados local
- [x] Interface de jogo responsiva
- [x] WebSockets para tempo real
- [x] Sistema de salas multiplayer
- [x] Chat integrado
- [x] IA Mestre do Mundo básica

### 🚧 Em Desenvolvimento
- [ ] Banco de dados Prisma completo
- [ ] Mais campanhas e missões
- [ ] Sistema de combate
- [ ] Inventário e itens
- [ ] IA mais avançada
- [ ] Mapa interativo

### 🎨 UI/UX
- [x] Design Japão feudal autêntico
- [x] Animações suaves
- [x] Interface mobile-friendly
- [x] Feedback visual rico
- [x] Tema dark/light

## 🔧 Configuração de Produção

### Variáveis de Ambiente Necessárias
```bash
# Autenticação
NEXTAUTH_URL="https://seudominio.com"
NEXTAUTH_SECRET="chave-secreta-producao"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# OpenAI (para IA funcionar)
OPENAI_API_KEY="sk-..."

# Banco de Dados (futuro)
DATABASE_URL="postgresql://..."
```

### Deploy
```bash
# Build para produção
npm run build

# Iniciar em produção
npm run start
```

## 🎯 Status Atual:

**✅ AUTENTICAÇÃO:** Funcionando perfeitamente (Google OAuth)  
**✅ PERSONAGENS:** Criados e salvos com atributos dinâmicos  
**✅ SISTEMA DE JOGO:** Completo com IA Mestre do Mundo  
**✅ CAMPANHAS:** Jornada Inicial implementada  
**✅ MULTIPLAYER:** Salas compartilhadas com WebSockets  
**✅ SISTEMA DE AMIGOS:** Completo com convites e status online  
**✅ INTERFACE:** Profissional e responsiva  
**✅ BANCO DE DADOS:** SQLite local funcionando  

## 🤝 Contribuição

Este projeto é uma demonstração de como criar RPGs com IA avançada. Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📜 Licença

Este projeto é para fins educacionais e de demonstração.

---

**🎮 Pronto para embarcar nesta jornada feudal? Acesse o jogo e deixe a IA Mestre do Mundo guiar seu destino!**

*Desenvolvido com ❤️ para demonstrar o potencial dos RPGs com IA*