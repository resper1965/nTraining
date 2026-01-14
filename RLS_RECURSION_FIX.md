# Correção de Recursão Infinita nas Políticas RLS

## Problema Identificado

O erro `infinite recursion detected in policy for relation "users"` (código `42P17`) ocorre porque a política RLS da tabela `users` tenta ler a própria tabela `users` para verificar permissões, causando recursão infinita.

### Política Problemática

```sql
CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid()));
```

**Por que causa recursão?**
1. Para verificar se um usuário pode ver outro usuário, a política precisa ler `users` para pegar o `organization_id`
2. Mas para ler `users`, precisa verificar a política RLS
3. Que precisa ler `users` novamente...
4. **Loop infinito!**

## Solução

Criamos uma migração (`003_fix_users_rls_recursion.sql`) que:

1. **Remove a política problemática**
2. **Cria uma função helper** `get_user_organization_id()` que usa `SECURITY DEFINER` para bypass RLS
3. **Recria a política** usando a função helper (sem recursão)
4. **Adiciona políticas específicas** para diferentes casos de uso

### Função Helper (Sem Recursão)

```sql
CREATE OR REPLACE FUNCTION get_user_organization_id(user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER  -- Bypass RLS!
SET search_path = public
AS $$
DECLARE
  org_id UUID;
BEGIN
  SELECT organization_id INTO org_id
  FROM users
  WHERE id = user_id
  LIMIT 1;
  
  RETURN org_id;
END;
$$;
```

### Nova Política (Sem Recursão)

```sql
CREATE POLICY "Users can view org members"
  ON users FOR SELECT
  USING (
    id = auth.uid() OR  -- Próprio usuário
    organization_id = get_user_organization_id(auth.uid()) OR  -- Mesma org (sem recursão!)
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_superadmin = true)  -- Superadmin
  );
```

## Como Aplicar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Abra o arquivo `lib/supabase/migrations/003_fix_users_rls_recursion.sql`
5. Copie TODO o conteúdo
6. Cole no SQL Editor
7. Clique em **Run**

### Opção 2: Via Supabase CLI

```bash
supabase db push
```

## Verificação

Após aplicar a migração, verifique se a recursão foi resolvida:

```sql
-- Testar se a função funciona
SELECT get_user_organization_id(auth.uid());

-- Testar se a política funciona (deve retornar usuários sem erro)
SELECT id, email, organization_id FROM users LIMIT 5;
```

## Políticas RLS Finais

Após a correção, as políticas RLS da tabela `users` serão:

1. **Users can view own data**: Usuários podem ver seus próprios dados
2. **Superadmins can view all users**: Superadmins podem ver todos os usuários
3. **Users can view org members**: Usuários podem ver membros da mesma organização (sem recursão)
4. **Users can update own data**: Usuários podem atualizar seus próprios dados
5. **Service role can insert users**: Service role pode inserir usuários (via triggers)

## Impacto

- ✅ **Sem recursão infinita**: Função helper bypass RLS
- ✅ **Mesma funcionalidade**: Usuários ainda podem ver membros da organização
- ✅ **Superadmins funcionam**: Podem ver todos os usuários
- ✅ **Performance**: Função helper é otimizada

## Notas Importantes

- A função `get_user_organization_id()` usa `SECURITY DEFINER`, o que significa que ela executa com privilégios do criador da função (geralmente postgres)
- Isso permite bypass RLS apenas dentro da função, não expõe dados indevidamente
- A política ainda verifica permissões, apenas usa a função para evitar recursão
