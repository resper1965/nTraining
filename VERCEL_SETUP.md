# Configuração do Vercel - nTraining

## Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no seu projeto Vercel:

### Variáveis Obrigatórias

1. **NEXT_PUBLIC_SUPABASE_URL**
   - URL do seu projeto Supabase
   - Formato: `https://xxxxx.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Chave anônima do Supabase (pública, segura para uso no cliente)
   - Encontrada em: Supabase Dashboard → Settings → API → anon/public key

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Chave de service role (PRIVADA, apenas server-side)
   - Encontrada em: Supabase Dashboard → Settings → API → service_role key
   - ⚠️ **NUNCA** exponha esta chave no cliente

## Como Configurar no Vercel

### Opção 1: Via Dashboard (Recomendado)

1. Acesse: https://vercel.com/nessbr-projects/ntraining-platform/settings/environment-variables
   - (Substitua `ntraining-platform` pelo nome do seu projeto se diferente)

2. Para cada variável:
   - Clique em "Add New"
   - Digite o nome da variável
   - Cole o valor
   - Selecione os ambientes (Production, Preview, Development)
   - Clique em "Save"

3. Após adicionar todas as variáveis, faça um redeploy:
   - Vá para a aba "Deployments"
   - Clique nos três pontos do último deployment
   - Selecione "Redeploy"

### Opção 2: Via CLI do Vercel

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Login
vercel login

# Link do projeto (se ainda não estiver linkado)
vercel link

# Adicionar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Fazer deploy
vercel --prod
```

## Verificação

Após configurar as variáveis e fazer o redeploy, verifique se estão sendo carregadas corretamente:

1. Acesse o deployment no Vercel
2. Vá em "Settings" → "Environment Variables"
3. Verifique se todas as 3 variáveis estão listadas
4. Teste a aplicação para garantir que o Supabase está conectado

## Troubleshooting

### Variáveis não estão sendo carregadas
- Certifique-se de que fez um redeploy após adicionar as variáveis
- Verifique se os nomes das variáveis estão exatamente como especificado (case-sensitive)
- Verifique se selecionou os ambientes corretos (Production, Preview, Development)

### Erro de conexão com Supabase
- Verifique se a URL do Supabase está correta
- Confirme que as chaves estão corretas (anon key e service role key são diferentes)
- Verifique os logs do Vercel para mais detalhes do erro

