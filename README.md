# Reforça Aí — App Mobile (React Native)

App mobile para o projeto social **Reforça Aí**, que permite que **administradores**
registrem e atualizem a frequência dos alunos, e que **usuários** (alunos/responsáveis)
consultem essas informações.

## ⚠️ O que estava travando no Expo Snack (e foi corrigido)

1. **Firebase v9/v10 (modular)** — o bundler do Snack (Snackager) não resolve bem o
   campo `"exports"` do `package.json` dessas versões, então `import { getFirestore }
   from 'firebase/firestore'` trava com erro de dependência. **Correção:** o projeto
   agora usa **Firebase v8.10.1** (API clássica/"compat", `firebase.firestore()`),
   que não usa `exports` e funciona sem problemas no Snack. Isso é uma limitação
   conhecida do Snack, não do seu código (veja
   https://github.com/expo/snack/issues/268).
2. **@react-navigation + react-native-screens/safe-area-context** — essas
   dependências nativas frequentemente ficam com versão incompatível com o SDK
   que o Snack está usando no momento, travando o app ao abrir. **Correção:** troquei
   por uma navegação simples feita com `useState` em `App.js`, que imita a mesma
   API (`navigation.navigate`, `navigation.goBack`, `navigation.reset`,
   `route.params`) — então nenhuma tela precisou ser reescrita, e não há mais
   nenhuma dependência nativa extra para dar conflito.
3. **`ImagePicker.MediaTypeOptions.Images`** — foi descontinuada nas versões
   recentes do `expo-image-picker`. **Correção:** troquei para a sintaxe atual,
   `mediaTypes: ['images']`.

## Telas

1. **PerfilAcessoScreen** — tela inicial com escolha Admin × Usuário. Define o `role`
   no `RoleContext`, que controla o que aparece nas próximas telas (sem senha, apenas
   escolha de perfil, conforme pedido).
2. **ListaAlunosScreen** — lista os alunos em tempo real via `onSnapshot` do Firestore,
   usando `.map()`/`FlatList`. Tem busca, filtro por turma e, se `isAdmin`, mostra os
   ícones de editar/excluir em cada item e o botão flutuante "Novo registro".
3. **DetalheAlunoScreen** — abre ao tocar num aluno da lista e mostra todos os campos
   (e-mail, telefone, responsável, projeto, histórico de frequência). Se admin, mostra
   botões Editar/Excluir.
4. **CadastroAlunoScreen** — formulário controlado (`TextInput` + `useState`) que
   cria ou edita um aluno, incluindo escolha e upload de foto para o Cloudinary.

## Banco de dados (Firestore)

Coleção **`alunos_projeto`**, com os campos:

| Campo | Tipo | Descrição |
|---|---|---|
| nome | string | Nome completo do aluno |
| serie | string | Série do aluno (ex: "6º ano") |
| responsavel | string | Nome do responsável |
| frequencia | number | % de frequência do aluno |
| fotoURL | string | URL da foto hospedada no Cloudinary |
| criadoEm / atualizadoEm | timestamp | Controle interno |

CRUD completo em `src/services/alunosService.js`: `criarAluno`, `escutarAlunos`,
`escutarAluno`, `atualizarAluno`, `excluirAluno`.

## Configuração já aplicada

### Firebase
O projeto já está conectado ao Firebase **nuvem2-juliano** (`src/config/firebaseConfig.js`
já contém as credenciais reais). Só falta você:
1. No Console do Firebase → Firestore Database → criar o banco de dados (modo teste
   serve para o exercício), caso ainda não exista.
2. A coleção **`alunos_projeto`** não precisa ser criada manualmente — ela é gerada
   sozinha assim que você cadastrar o primeiro aluno pelo app (tela "Novo registro").

### Cloudinary
Edite `src/services/cloudinary.js` com o `CLOUD_NAME` da sua conta e crie um
**Upload preset "Unsigned"** em Settings → Upload no painel do Cloudinary,
colocando o nome dele em `UPLOAD_PRESET`.

## Como rodar no Expo Snack (passo a passo)

1. Crie um novo Snack em https://snack.expo.dev
2. Copie o conteúdo de `App.js` e de cada arquivo dentro de `src/` para os
   respectivos arquivos no Snack (crie os arquivos/pastas com o mesmo caminho:
   `src/config/...`, `src/context/...`, `src/screens/...`, `src/services/...`,
   `src/theme/...`).
3. **Não copie o `package.json` inteiro por cima do que já existe no Snack.**
   Em vez disso, use o painel de dependências do Snack (ícone de pacote na
   lateral) e adicione, um de cada vez, pela busca:
   - `firebase` → quando aparecer a lista de versões, escolha a **8.10.1**
     (não use a versão mais recente, ela não resolve no Snack — veja explicação
     acima).
   - `expo-image-picker` → deixe o Snack escolher a versão automaticamente,
     ele já resolve a compatível com o SDK do seu projeto.
4. Configure Firebase e Cloudinary como descrito acima.
5. Teste preferencialmente no **app Expo Go do celular** (escaneando o QR
   code), não só no preview web do Snack — recursos como escolher foto da
   galeria (`expo-image-picker`) e alguns `Alert` não funcionam direito no
   preview do navegador.
6. Clique em **Save** para gerar o link de entrega.

## Feedback visual implementado

- `ActivityIndicator` + texto enquanto busca dados no Firestore (lista e detalhe).
- `ActivityIndicator` no botão "Salvar" durante o Create/Update.
- Indicador "Enviando foto..." durante o upload no Cloudinary.
- `Alert.alert` de confirmação antes de excluir e de sucesso/erro em toda operação
  (criar, editar, excluir).
- Estado vazio ("Nenhum aluno encontrado") quando a busca/filtro não retorna nada.

## Identidade visual

Paleta em `src/theme/colors.js`, seguindo a marca já usada no mockup do Reforça Aí:
navy (`#12173F`) para telas de abertura, roxo (`#6C63FF`) como cor primária de
cabeçalhos e botões, verde (`#22C55E`) para frequência/sucesso, laranja (`#F5A623`)
para pendências e azul (`#3B82F6`) para ações em andamento/edição.
