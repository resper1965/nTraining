# Scripts de Importação nTraining

## Import Course Script

Script para importar cursos estruturados em JSON para o banco de dados Supabase.

### Pré-requisitos

1. **Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

⚠️ **IMPORTANTE**: Use a **Service Role Key** (não a anon key) para ter permissões de admin.

2. **Instalar tsx** (se não tiver)

```bash
npm install -g tsx
# ou use npx tsx
```

### Uso

#### Importar o curso n.SecOps

```bash
npx tsx scripts/import-course.ts --file data/n-secops-course.json
```

#### Importar curso customizado

```bash
npx tsx scripts/import-course.ts --file caminho/para/seu-curso.json
```

### Formato do JSON

O arquivo JSON deve seguir esta estrutura:

```json
{
  "course": {
    "title": "Nome do Curso",
    "slug": "nome-do-curso",
    "description": "Descrição completa...",
    "objectives": "Objetivos de aprendizado...",
    "duration_hours": 24,
    "level": "iniciante|intermediario|avancado",
    "area": "Área de conhecimento",
    "status": "draft|published",
    "is_public": true,
    "is_certifiable": true
  },
  "modules": [
    {
      "title": "Módulo 1: Título",
      "description": "Descrição do módulo",
      "order_index": 1,
      "lessons": [
        {
          "title": "Aula 1",
          "content_type": "text|video|file|embed",
          "content_text": "Conteúdo em markdown...",
          "content_url": "https://...",
          "duration_minutes": 30,
          "order_index": 1,
          "is_required": true
        }
      ]
    }
  ],
  "quizzes": [
    {
      "title": "Avaliação Final",
      "description": "Descrição do quiz",
      "passing_score": 75,
      "max_attempts": 3,
      "questions": [
        {
          "question_text": "Pergunta?",
          "question_type": "multiple_choice|true_false|short_answer",
          "points": 1,
          "explanation": "Explicação da resposta correta",
          "order_index": 1,
          "options": [
            {
              "option_text": "Opção A",
              "is_correct": true,
              "order_index": 1
            }
          ]
        }
      ]
    }
  ]
}
```

### O que o script faz

1. ✅ Cria o curso no banco de dados
2. ✅ Cria todos os módulos associados
3. ✅ Cria todas as aulas de cada módulo
4. ✅ Cria quizzes e suas questões (se houver)
5. ✅ Concede acesso à organização "ness Security" automaticamente
6. ✅ Retorna o ID e slug do curso criado

### Troubleshooting

#### Erro: "Variáveis de ambiente não configuradas"

**Solução**: Certifique-se de ter o arquivo `.env.local` com as variáveis corretas.

#### Erro ao criar curso: "duplicate key value"

**Solução**: O slug do curso já existe. Altere o slug no JSON ou delete o curso existente.

#### Erro: "Failed to create organization access"

**Solução**: A organização ness Security (ID: 00000000-0000-0000-0000-000000000001) não existe. Execute o seed.sql primeiro:

```sql
-- No Supabase SQL Editor, execute:
-- lib/supabase/seed.sql
```

### Seed Inicial

Para popular o banco com dados básicos (organizações, cursos de exemplo):

1. Acesse o Supabase Dashboard
2. Vá em SQL Editor
3. Cole o conteúdo de `lib/supabase/seed.sql`
4. Execute

### Cursos Disponíveis

- **n-secops-course.json**: Curso completo de Network Security Operations (24h, nível intermediário)
  - 3 módulos: Fundamentos de SecOps, Monitoramento e Detecção, Resposta a Incidentes
  - 7 aulas detalhadas
  - 1 quiz final com 8 questões

### Criar seu próprio curso

1. Copie `data/n-secops-course.json` como template
2. Edite o conteúdo conforme necessário
3. Importe usando o script

### Próximos Passos Após Importação

1. **Verificar no Admin Panel**: `/admin/courses`
2. **Testar visualização**: `/courses/n-secops`
3. **Dar acesso a usuários**: Em `/admin/tenants`, configure organization_course_access
4. **Atribuir para usuários**: Em `/admin/assignments`, crie atribuições obrigatórias se necessário

### Suporte

Em caso de problemas:
1. Verifique os logs do script
2. Verifique os logs do Supabase (Dashboard > Logs)
3. Certifique-se que as tabelas existem (migrations aplicados)
