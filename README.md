# EletroShop

Aplicativo mobile de gerenciamento de produtos desenvolvido colaborativamente com React Native, Expo 57 e Expo Router.

## Funcionalidades integradas

- página inicial da EletroShop;
- cadastro de produtos;
- listagem carregada da API;
- filtros por categoria e disponibilidade;
- atualização manual da lista;
- cache local usado quando a API está indisponível;
- visualização dos detalhes de um produto;
- suporte aos modos claro e escuro.

## Equipe 1 — Cadastro de produtos

A Equipe 1 é responsável pela rota `/create-product` e pela tela `CreateProductScreen`.

O formulário permite informar:

- nome;
- descrição;
- categoria;
- preço;
- quantidade em estoque.

O identificador e a disponibilidade não são informados pelo usuário. Esses campos devem ser gerados pela API.

## Como o `useState` é utilizado

Cada campo possui um estado controlado:

```ts
const [name, setName] = useState('');
const [description, setDescription] = useState('');
const [category, setCategory] = useState('');
const [price, setPrice] = useState('');
const [quantity, setQuantity] = useState('0');
```

Durante a digitação, `onChangeText` recebe o novo texto e chama a função de atualização correspondente:

```tsx
<TextInput value={name} onChangeText={setName} />
```

O valor permanece como texto enquanto o usuário digita. No cadastro, preço e quantidade são validados e convertidos para `number` antes do envio à API.

O módulo também usa estados para:

- erros de validação;
- bloqueio do botão durante o envio;
- indicador de carregamento.

## Validações

- nome e preço são obrigatórios;
- preço deve ser igual ou maior que zero e ter no máximo duas casas decimais;
- quantidade deve ser um número inteiro igual ou maior que zero;
- valores como `20abc`, `2.5` para quantidade e números negativos são recusados.

## Contrato do produto

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  available: boolean;
}
```

O cadastro envia apenas:

```ts
type CreateProductInput = Omit<Product, 'id' | 'available'>;
```

## Configuração da API

Copie o arquivo de exemplo:

```powershell
Copy-Item .env.example .env
```

Configure o endereço:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Em um celular físico, use o endereço IPv4 do computador na mesma rede:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000
```

Endpoint utilizado:

```http
POST /products
Content-Type: application/json
```

Exemplo de requisição:

```json
{
  "name": "Notebook Gamer",
  "description": "Notebook com 16 GB de memória RAM",
  "category": "Computadores",
  "price": 4599.9,
  "quantity": 5
}
```

Resposta esperada:

```json
{
  "id": "produto-1",
  "name": "Notebook Gamer",
  "description": "Notebook com 16 GB de memória RAM",
  "category": "Computadores",
  "price": 4599.9,
  "quantity": 5,
  "available": true
}
```

## Execução

```powershell
npm install
npx expo start
```

Use `w` para web, `a` para o emulador Android ou leia o QR Code com o Expo Go.

## Equipe 2 — Listagem de produtos

A rota `/products` utiliza `ProductListScreen`, `ProductItem`, `FlatList` e o hook `useProducts`.

No carregamento inicial, o hook:

1. procura a última lista salva no AsyncStorage;
2. apresenta essa lista temporariamente, quando disponível;
3. consulta `GET /products`;
4. atualiza a tela com os dados da API;
5. salva a nova lista localmente.

Quando a API falha e existe uma cópia local, a aplicação mantém os produtos na tela e informa que os dados podem estar desatualizados.

A listagem permite:

- filtrar por categoria;
- mostrar somente produtos disponíveis;
- atualizar arrastando a lista;
- tentar novamente depois de um erro;
- cadastrar um novo produto;
- selecionar um item para visualizar seus detalhes.

## Navegação após o cadastro

Depois da confirmação, a aplicação abre `/products`. A listagem é carregada novamente e passa a apresentar os dados atualizados da API.

## Pendência externa

O funcionamento completo depende da API mantida em outro repositório. O aplicativo trata:

- respostas HTTP sem sucesso;
- mensagens de erro devolvidas em JSON;
- resposta de produto em formato inválido;
- falha de conexão;
- tempo de resposta superior a dez segundos.
