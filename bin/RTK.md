# RTK - Rust Token Killer (Codex CLI)

**Usage**: Token-optimized CLI proxy for shell commands.

## Rule

Always prefix shell commands with `.\bin\rtk.exe` from the project root.

Examples:

```bash
.\bin\rtk.exe git status
.\bin\rtk.exe cargo test
.\bin\rtk.exe npm run build
.\bin\rtk.exe pytest -q
```

## Meta Commands

```bash
.\bin\rtk.exe gain            # Token savings analytics
.\bin\rtk.exe gain --history  # Recent command savings history
.\bin\rtk.exe proxy <cmd>     # Run raw command without filtering
```

## Verification

```bash
.\bin\rtk.exe --version
.\bin\rtk.exe gain
Get-Item .\bin\rtk.exe
```
