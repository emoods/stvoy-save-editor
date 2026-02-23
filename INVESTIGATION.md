# PAK Extraction & Investigation Notes

This document describes how to extract game configuration files from the encrypted PAK files. The extracted data was used to build this save editor.

## AES Decryption Key

Unreal Engine games encrypt their PAK files with an AES-256 key embedded in the game binary. To extract it:

### Using aesdumpster-rs (Rust)

We used [aesdumpster-rs](https://github.com/yuhkix/aesdumpster-rs), a Rust tool that scans Unreal Engine executables for AES keys using pattern matching and entropy analysis.

```bash
# Clone and build
git clone https://github.com/yuhkix/aesdumpster-rs
cd aesdumpster-rs
cargo build --release

# Run against game binary
./target/release/aesdumpster /path/to/STVoyager-Win64-Shipping.exe
```

The tool will output potential AES keys in hex format (e.g., `0x67E6...`). 

**Note**: The tool may find multiple candidate keys. You'll need to try each one with repak until you find the one that successfully extracts the PAK file. The correct key is not always the first one reported.

### Alternative Tools

- [AESDumpster](https://github.com/GHFear/AESDumpster) - Original C++ version (Windows)
- [AES Key Finder](https://github.com/GHFear/AES-Key-Finder-UE4-UE5) - GUI tool for Windows

## PAK File Extraction

The game stores its configuration data in encrypted PAK files. We used [repak](https://github.com/trumank/repak) to extract them.

### Install repak

```bash
cargo install repak-cli
```

Or build from source:

```bash
git clone https://github.com/trumank/repak.git
cd repak
cargo build --release
```

### Extract PAK files

The PAK file is located in your game installation:
- **Steam**: `steamapps/common/Star Trek Voyager - Across the Unknown/STVoyager/Content/Paks/STVoyager-Windows.pak`

```bash
repak \
  --aes-key <TRY_EACH_KEY> \
  unpack /path/to/STVoyager-Windows.pak pak_extracted
```

If the key is wrong, repak will fail with a decryption error. Try each key from aesdumpster until one works.

## What We Extracted

The main useful file:

```
pak_extracted/
└── STVoyager/
    └── Config/
        └── Tags/
            └── STVAbilityTags.ini   # COMPLETE TECH TREE TAGS
```

### STVAbilityTags.ini

Contains all tech tree skill tags used in save files:

- **Tech.Engineering.*** - Engineering skills (hull, engines, etc.)
- **Tech.Science.*** - Science skills (sensors, labs, etc.)
- **Tech.Combat.*** - Combat skills (weapons, shields, etc.)
- **Tech.Crew.*** - Crew skills (morale, facilities, etc.)
- **Tech.Borg.*** - Borg-specific technologies

### Tier Limitation

The tier-to-skill mapping (which skills require which tier) is stored in binary DataTable assets (`.uasset` files) that cannot be easily parsed. 

**Workaround**: The editor displays skills grouped by Room/Facility instead of by Tier.

## Legal Note

These tools and techniques are used for **interoperability** purposes (building a save editor). Under DMCA 1201(f) and EU Software Directive, reverse engineering for interoperability is permitted. We do not distribute any copyrighted game content - the save editor only works with the user's own save files.

## References

- [aesdumpster-rs](https://github.com/yuhkix/aesdumpster-rs) - Rust AES key extractor (what we used)
- [repak](https://github.com/trumank/repak) - PAK file extraction tool
- [AESDumpster](https://github.com/GHFear/AESDumpster) - Original C++ version
