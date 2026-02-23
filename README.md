# stvoy-save-editor

Save game editor for [**Star Trek Voyager: Across the Unknown**](https://store.steampowered.com/app/2643390/Star_Trek_Voyager__Across_the_Unknown/) by [Gamexcite / Daedalic Entertainment](https://www.stvatu.com). Read and modify resources, hull integrity, tech tree, and more.

No save editor existed for this game — the save format is a proprietary bit-packed binary (C3Serialize/FunIO), not standard Unreal Engine GVAS. This toolkit reverse-engineers that format so you can tweak your saves.

## Web Editor

**Try it online:** [https://emoods.github.io/stvoy-save-editor/](https://emoods.github.io/stvoy-save-editor/)

Upload your save file, edit resources, hull integrity, and tech tree in your browser, and download the modified file. No installation required.

## Important Disclaimer

**This is a personal side project. I cannot provide support or fix bugs.**

- This tool is provided "as-is" with no warranty
- I do not have time to respond to issues or feature requests
- If you encounter bugs, **feel free to fork the repository** and fix them yourself
- Pull requests are welcome but may not be reviewed promptly
- Use at your own risk — always backup your saves before editing

This project is not affiliated with or endorsed by Stellar Cartography, Strange New Games, Gamexcite, Daedalic Entertainment, or any rights holders of Star Trek or Star Trek Voyager: Across the Unknown.

---

## Finding Your Saves

Save files are located at:

```
C:\Users\<YourName>\AppData\Local\STVoyager\Saved\SaveGames\<SteamID>\
```

Files are named `00_GX_STV_SaveGame_NNNN.sav`.

## What You Can Edit

### Resources

Base resources like Crew, Energy, Food, Deuterium, Dilithium, Duranium, Tritanium, Morale, SciencePoints, BioNeuralGelPack, BorgNanites, Batteries, and more.

Items and recipes like torpedoes, research points, etc.

### Hull Integrity

Current hull can be set to any value. Note that **max hull capacity is computed from your installed ship modules** and is not stored in the save file, so you can't increase it directly — but you can repair to full.

### Tech Tree

Unlock or remove technologies from all categories: Engineering, Science, Combat, Crew, and Borg.

## How It Works

Save files are Base64-encoded. Under that is a 16-byte header (file size, CRC32 hash, version, debug flag) followed by a bit-packed binary stream using C3Serialize/FunIO encoding. Values are stored as variable-length packed integers (smaller numbers use fewer bits), so modifying a value may shift everything after it. The editor handles all of this automatically — including bit-stream reconstruction and hash recomputation.

## Backup & Safety

The web editor will warn you to backup your save before downloading a modified file. **Keep your own backups** — copy your entire `SaveGames` folder before experimenting.

## Limitations

- **Max hull can't be changed** — it's computed from installed ship modules, not stored in the save
- Chunk structure for crew (`hero`, `dpsr`), quests (`ques`), events (`evnt`), etc. is mapped but not yet editable

## Credits

Based on the original reverse engineering work by **Ian Neubert** ([@ianneub](https://github.com/ianneub)) - [original repo](https://github.com/ianneub/stvoy-save-editor)

## License

MIT
