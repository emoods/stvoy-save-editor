# AI Agent Instructions

Instructions for AI coding assistants working on this project.

## Project Overview

This is a web-based save game editor for **Star Trek: Voyager - Across the Unknown**. 

- **Tech Stack**: Vue 3 browser build (no compilation), pure JavaScript
- **Hosting**: GitHub Pages at https://emoods.github.io/stvoy-save-editor/

## Key Files

- `index.html` - Main Vue 3 template
- `style.css` - LCARS Star Trek theme
- `js/app.js` - Vue app entry point
- `js/vue/` - Vue composables (useFileHandler, useResources, useTechTree)
- `js/*.js` - Core parsing/encoding logic
- `test/` - Unit tests (run with `node test/test_*.js`)
- `INVESTIGATION.md` - Documents PAK extraction process for future reference

## CRITICAL SECURITY RULES

### NEVER commit encryption keys

**DO NOT** commit any AES keys, decryption keys, or similar secrets to this repository.

- The PAK extraction process requires an AES key extracted from the game binary
- This key changes with game updates
- Users must extract their own key using the tools documented in `INVESTIGATION.md`
- If you encounter a key in local files (e.g., `investigate/aes.txt`), **NEVER** include it in commits

### Examples of what NOT to commit

- Full 64-character hex keys (e.g., `0x` followed by 64 hex digits)
- Any key found in `investigate/aes.txt` or similar local files
- Commands with actual keys like `--aes-key 0xABCD...WXYZ`

### Safe to commit

```
--aes-key <YOUR_KEY_HERE>  # OK - placeholder
0x67E6...  # OK - truncated example
```

## Save File Format

- **Outer layer**: Base64 encoded ASCII
- **Inner layer**: Bit-packed binary with CRC32 validation (init: `0x61635263`)
- **Chunks**: `parw` → `daeh`, `emag` → `trts` → `cser` (resources), `tsnc` (hull), `tlba` (tech tree)

## Running Tests

```bash
node test/test_encoding.js   # 14 encoding tests
node test/test_techtree.js   # 10 tech tree tests
```

## Legal

Save game editing for single-player interoperability is permitted under DMCA §1201(f) and EU Software Directive. We do not distribute copyrighted game content.
