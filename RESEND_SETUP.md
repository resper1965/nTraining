# Configuração do Resend

## Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```env
RESEND_API_KEY=re_fGxX291Y_2oKx9MF8rWJDPimyb1F573dt
RESEND_FROM_EMAIL=n.training <noreply@ntraining.com>
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
```

## Configuração no Vercel

1. Acesse o painel do Vercel
2. Vá em Settings > Environment Variables
3. Adicione:
   - `RESEND_API_KEY`: `re_fGxX291Y_2oKx9MF8rWJDPimyb1F573dt`
   - `RESEND_FROM_EMAIL`: `n.training <noreply@ntraining.com>`
   - `NEXT_PUBLIC_APP_URL`: URL da sua aplicação (ex: `https://ntraining.vercel.app`)

## Verificação de Domínio no Resend

1. Acesse https://resend.com/domains
2. Adicione seu domínio
3. Configure os registros DNS conforme instruções
4. Após verificação, atualize `RESEND_FROM_EMAIL` com seu domínio verificado

## Teste

Após configurar, teste o envio de emails:
- Criar um novo usuário (deve receber email de boas-vindas)
- Atribuir um curso (deve receber email de curso atribuído)
- Completar um curso (deve receber email de conclusão)

