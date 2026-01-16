# 🔧 Configuração MCP no Cursor

## 📋 Integração: AI Context

Esta integração permite usar o `@ai-coders/context` para melhorar o contexto durante o desenvolvimento.

## ⚙️ Como Configurar

### Passo 1: Localizar o arquivo de configuração do Cursor

A configuração MCP do Cursor fica no arquivo de configuração do usuário. O caminho varia por sistema operacional:

**Linux/WSL:**
```
~/.config/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
```

**macOS:**
```
~/Library/Application Support/Cursor/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json
```

**Windows:**
```
%APPDATA%\Cursor\User\globalStorage\rooveterinaryinc.roo-cline\settings\cline_mcp_settings.json
```

### Passo 2: Adicionar a configuração

Abra o arquivo `cline_mcp_settings.json` e adicione ou atualize a seção `mcpServers`:

```json
{
  "mcpServers": {
    "ai-context": {
      "command": "npx",
      "args": ["@ai-coders/context", "mcp"]
    }
  }
}
```

### Passo 3: Reiniciar o Cursor

Após salvar o arquivo, reinicie o Cursor para que as mudanças tenham efeito.

## 🔍 Verificar se está funcionando

Após reiniciar, você pode verificar se o MCP está funcionando:

1. Abra o Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Procure por "MCP" ou "Model Context Protocol"
3. Você deve ver opções relacionadas ao MCP

## 📝 Nota

Se o arquivo `cline_mcp_settings.json` não existir, você pode criá-lo manualmente com o conteúdo acima.

## 🔗 Referências

- [Cursor MCP Documentation](https://docs.cursor.com)
- [@ai-coders/context](https://www.npmjs.com/package/@ai-coders/context)
