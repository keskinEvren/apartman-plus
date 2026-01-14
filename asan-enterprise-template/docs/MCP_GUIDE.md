# MCP Servers - Agent Guide

> **For AI Agents**: This guide explains how to use MCP (Model Context Protocol) servers in ASANMOD template

---

## 🎯 Available MCP Servers

### 1. ASANMOD MCP (`@asanmod/asanmod-mcp`)

**Purpose**: Central validation and audit for ASANMOD operations

**When to use**:
- Validating ASANMOD compliance
- Running quality checks
- Audit logging
- Version verification

**Configuration** (`.mcp/config.json`):
```json
{
  "mcpServers": {
    "asanmod": {
      "command": "node",
      "args": ["mcp-servers/asanmod-mcp/dist/index.js"]
    }
  }
}
```

---

### 2. Context MCP (`@asanmod/context-mcp`) ⭐ **Recommended**

**Purpose**: Manage conversation context and optimize token usage

**When to use**:
- Long conversations (>10 messages)
- Multi-step tasks spanning sessions
- Context preservation needed
- Token optimization important

**Benefits**:
- 30-50% token reduction
- Better context tracking across sessions
- Automatic context summarization
- Session resumption support

**Configuration**:
```json
{
  "mcpServers": {
    "context": {
      "command": "node",
      "args": ["mcp-servers/context-mcp/dist/index.js"]
    }
  }
}
```

**Usage Example**:
```typescript
// Agent automatically uses context-mcp
// No code changes needed - works via MCP protocol
```

---

### 3. Security Check MCP (`@asanmod/security-check-mcp`)

**Purpose**: Automated security scanning and validation

**When to use**:
- Before commits
- Before deployments
- Security audits
- Dependency checking

**Checks Performed**:
- Hardcoded secrets detection
- Vulnerable dependencies
- Security best practices
- Environment variable leaks

**Configuration**:
```json
{
  "mcpServers": {
    "security": {
      "command": "node",
      "args": ["mcp-servers/security-check-mcp/dist/index.js"]
    }
  }
}
```

---

### 4. Git MCP (`git-mcp`)

**Purpose**: Git operations with ASANMOD format enforcement

**When to use**:
- Commits (ensures ASANMOD format)
- Branch management
- Merge operations

**Features**:
- Auto-formats commit messages
- Validates commit format before push
- Branch naming conventions

---

### 5. SSH MCP (`ssh-mcp`)

**Purpose**: Secure server operations

**When to use**:
- Production deployments
- Server management
- Remote command execution

---

## 🚀 Quick Setup

### For Agents:

1. **Check if MCPs are available**:
   ```bash
   ls mcp-servers/
   ```

2. **Verify configuration**:
   ```bash
   cat .mcp/config.json
   ```

3. **Start using** - MCPs auto-activate when configured

---

## 💡 Best Practices

### When to Use Which MCP:

| Task | MCP to Use |
|------|------------|
| Long multi-step implementation | `context-mcp` ⭐ |
| Committing code | `git-mcp` |
| Security scan before deploy | `security-check-mcp` |
| ASANMOD compliance check | `asanmod-mcp` |
| Production deployment | `ssh-mcp` |

### Recommended Combination:

**For Most Projects**:
```json
{
  "mcpServers": {
    "context": {...},    // Context management
    "git": {...},        // Git operations
    "security": {...}    // Security checks
  }
}
```

**For Production**:
```json
{
  "mcpServers": {
    "asanmod": {...},    // Compliance
    "security": {...},   // Security
    "ssh": {...}         // Deployment
  }
}
```

---

## 🔧 Troubleshooting

### MCP Not Working?

1. **Check if built**:
   ```bash
   cd mcp-servers/<mcp-name>
   npm run build
   ```

2. **Check logs**:
   ```bash
   tail -f ~/.mcp/logs/<mcp-name>.log
   ```

3. **Verify config**:
   ```bash
   cat .mcp/config.json
   # Ensure path is correct
   ```

---

## 📚 Further Reading

- [MCP Setup Guide](./MCP_SETUP.md) - Detailed setup instructions
- [ASANMOD Quick Ref](./AGENT_QUICK_REF.md) - All commands and tools
- [Architecture](./ARCH.md) - System design

---

**For Agents**: Start with `context-mcp` - it provides the most immediate benefit for conversation quality and token optimization.
