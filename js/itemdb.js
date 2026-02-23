/**
 * Complete Item Database for STVOY (Across the Unknown)
 * Extracted from game pak file: STVoyager/Config/Tags/Items.ini
 * Display names and descriptions extracted from General.locres localization file
 * 
 * Items are organized by category:
 * - BASE_RESOURCES: Core ship resources (Deuterium, Food, etc.)
 * - STACKABLE_ITEMS: Items with meaningful quantities (torpedoes, research points)
 * - UNLOCK_ITEMS: Boolean items (recipes, research, combat allies) - flag=1, qty=1
 * - ITEM_METADATA: Display names and descriptions for all items
 */

/**
 * Item metadata with display names and descriptions
 * Key is the short internal name (without Items.Item. prefix)
 */
export const ITEM_METADATA = {
    // === BASE RESOURCES ===
    'Crew': { displayName: 'Crew', description: 'Total crew members aboard the ship' },
    'Energy': { displayName: 'Energy', description: 'Ship power output from the warp core' },
    'Food': { displayName: 'Food', description: 'Food supplies for the crew' },
    'Deuterium': { displayName: 'Deuterium', description: 'Primary fuel for warp drive and ship systems' },
    'Dilithium': { displayName: 'Dilithium', description: 'Crystal used to regulate matter-antimatter reactions' },
    'Duranium': { displayName: 'Duranium', description: 'Construction material for ship structures' },
    'Tritanium': { displayName: 'Tritanium', description: 'Advanced construction material' },
    'Morale': { displayName: 'Morale', description: 'Current crew morale level' },
    'MoraleMax': { displayName: 'Max Morale', description: 'Maximum possible crew morale' },
    'Happiness': { displayName: 'Happiness', description: 'Crew happiness modifier' },
    'SciencePoints': { displayName: 'Science Points', description: 'Research currency produced by science labs' },
    'BioNeuralGelPack': { displayName: 'Bio-Neural Gel Pack', description: 'Organic computer components for ship systems' },
    'BorgNanites': { displayName: 'Borg Nanites', description: 'Microscopic Borg machines for various applications' },
    'Batteries': { displayName: 'Batteries', description: 'Stored energy reserves' },
    'Cycles': { displayName: 'Cycles', description: 'Time units passed in game' },
    'CrewAssigned': { displayName: 'Crew Assigned', description: 'Crew currently assigned to duties' },
    'LivingSpace': { displayName: 'Living Space', description: 'Available quarters capacity' },
    'WorkTeams': { displayName: 'Work Teams', description: 'Available construction/repair teams' },
    'WorkTeamsAssigned': { displayName: 'Work Teams Assigned', description: 'Teams currently on tasks' },
    'ThreatLevel': { displayName: 'Threat Level', description: 'Current sector danger level' },
    'Hull': { displayName: 'Hull Integrity', description: 'Ship hull structural integrity' },
    
    // === RESEARCH POINTS ===
    'ResearchPoints': { displayName: 'Research Points', description: 'Currency for unlocking technologies in the tech tree' },
    
    // === TORPEDOES & WEAPONS ===
    'Item_Torpedo': { displayName: 'Torpedo', description: 'Standard torpedo munition' },
    'Item_Photon_Torpedoes': { displayName: 'Photon Torpedoes', description: 'Standard Starfleet photon torpedo munitions' },
    'Item_Transphasic_torpedoes': { displayName: 'Transphasic Torpedoes', description: 'Advanced torpedoes capable of penetrating Borg defenses' },
    'Item_Biomolecular_Warheads_Bundle': { displayName: 'Bundle of Bio-Molecular Warheads', description: 'Biological warheads effective against Species 8472' },
    'Item_Nanoprobe_Torpedo_Tech': { displayName: 'Nanoprobe Torpedo Technology', description: 'Fires a special torpedo infused with Borg nanoprobes, dealing splash damage to adjacent systems. Highly effective against Species 8472.' },
    'Item_Bio_Molecular_Disruptor': { displayName: 'Bio-Molecular Disruptor', description: 'Weapon designed to combat bio-organic threats' },
    
    // === PROBES ===
    'Item_Cheap_Probe': { displayName: 'Cheap Probe', description: 'Basic reconnaissance probe' },
    'Item_Standard_Probe': { displayName: 'Standard Probe', description: 'Standard Starfleet probe for system exploration' },
    'Item_Sturdy_Probe': { displayName: 'Sturdy Probe', description: 'Reinforced probe for hazardous environments' },
    'Item_Remote_Controlled_Probe': { displayName: 'Remote-Controlled Probe', description: 'Probe with direct control capability' },
    'Item_Examination_Drone': { displayName: 'Examination Drone', description: 'Drone for detailed system analysis' },
    'Item_Modified_Probe': { displayName: 'Modified Probe', description: 'Customized probe with enhanced capabilities' },
    'Item_Data_of_Probe': { displayName: 'Probe Data', description: 'Data collected from probe missions' },
    
    // === SHUTTLES ===
    'Item_Better_Shuttle': { displayName: 'Better Shuttle', description: 'Enhanced shuttle craft' },
    'Item_Discardable_Shuttle': { displayName: 'Single-Use Shuttle', description: 'Expendable shuttle for one-way missions' },
    
    // === BORG ITEMS ===
    'Item_Biological_Borg_Sample': { displayName: 'Biological Borg Sample', description: 'Sample of Borg biological components for research' },
    'Item_Borg_Bio_Dampeners': { displayName: 'Borg Bio-Dampener', description: 'Device to mask bio-signatures from Borg sensors' },
    'Item_Borg_Combat_Logs': { displayName: 'Borg Combat Logs Analysis', description: 'Tactical data from Borg encounters' },
    'Item_Borg_Corpse': { displayName: 'Borg Corpse', description: 'Deceased Borg drone for study' },
    'Item_Borg_Data_Link_Translation': { displayName: 'Borg Data Link Translation', description: 'Decoded Borg communication protocols' },
    'Item_Borg_Data_Nodes': { displayName: 'Borg Data Node', description: 'Storage device containing Borg information' },
    'Item_Borg_Fetus': { displayName: 'Borg Fetus', description: 'Immature Borg for medical research' },
    'Item_Borg_Frequency_Modulation_And_Subspace_Communication_Signatures': { displayName: 'Borg Subspace Frequency Modulation', description: 'Research on Borg communication methods' },
    'Item_Borg_Implants_and_Neurophysiology': { displayName: 'Borg Implants and Neurophysiology', description: 'Research papers on Borg cybernetics' },
    'Item_Borg_Maturation_Chamber': { displayName: 'Borg Maturation Chamber', description: 'Technology for accelerated Borg development' },
    'Item_Borg_Notes': { displayName: 'Borg Notes filled with Knowledge', description: 'Collected intelligence on Borg operations' },
    'Item_Borg_Pathogen': { displayName: 'Borg Pathogen', description: 'Biological agent effective against the Collective' },
    'Item_Borg_Probe_Parts': { displayName: 'Borg Probe Parts', description: 'Salvaged components from Borg probes' },
    'Item_Borg_Tracking_Device': { displayName: 'Borg Tracking Device', description: 'Device to locate Borg vessels' },
    
    // === TECHNOLOGY ITEMS ===
    'Item_Ablative_armor': { displayName: 'Ablative Armor', description: 'Advanced hull plating that absorbs weapons fire' },
    'Item_Adaptive_Bio_Filters_And_Forcefield_Generators': { displayName: 'Adaptive Bio Filters And Forcefield Generators', description: 'Defense systems against biological threats' },
    'Item_Anti_Radiation_Shields': { displayName: 'Anti-Radiation Shields', description: 'Protection against harmful radiation' },
    'Item_Anti_Radiation_Vaccine': { displayName: 'Anti-Radiation Vaccine', description: 'Medical treatment for radiation exposure' },
    'Item_Anti_Borg_Virus_Sample': { displayName: 'Anti-Borg Virus Sample', description: 'Pathogen sample for anti-Borg research' },
    'Item_Cloaking_Device': { displayName: 'Cloaking Device', description: 'Allows active cloaking in combat for a guaranteed escape' },
    'Item_Multi_Adaptive_Shielding': { displayName: 'Multi-Adaptive Shielding', description: 'Shields that adapt to different weapon types' },
    'Item_Quantum_Slipstream_Drive': { displayName: 'Quantum Slipstream Drive', description: 'Faster-than-warp propulsion technology' },
    'Item_Quantum_Slipstream_Drive_Adjustments': { displayName: 'Quantum Slipstream Drive Adjustments', description: 'Calibration settings for slipstream drive' },
    'Item_Slipstream_Drive_Technology': { displayName: 'Slipstream Drive Tech', description: 'Core slipstream drive components' },
    'Item_Transwarp_Coil': { displayName: 'Transwarp Coil', description: 'Borg transwarp propulsion component' },
    'Item_Regenerative_Fusion_Tech': { displayName: 'Regenerative Fusion', description: 'Self-repairing power generation technology' },
    
    // === MEDICAL ITEMS ===
    'Item_Danaras_Cure': { displayName: 'Danara\'s Cure', description: 'Cure for Vidiian Phage' },
    'Item_Mass_Cure': { displayName: 'Mass Cure', description: 'Large-scale medical treatment' },
    'Item_Nucleogenic_Biobed': { displayName: 'Nucleogenic Biobed', description: 'Advanced medical treatment bed' },
    'Item_Nutriplexer': { displayName: 'Nutriplexer', description: 'Device for optimizing nutrition' },
    'Item_Cortical_Jammer': { displayName: 'Cortical Jammer', description: 'Device to disrupt neural connections' },
    'Item_Vidiian_Surgical_Device': { displayName: 'Vidiian Surgical Device', description: 'Advanced medical instrument' },
    'Item_Vidiian_Disguise': { displayName: 'Vidiian Disguise', description: 'Holographic disguise as Vidiian' },
    'Item_Genetic_Resequencing_Vector_Hypospray': { displayName: 'Genetic Resequencing Vector Hypospray', description: 'Medical device for genetic modification' },
    'Item_Neurolytic': { displayName: 'Neurolytic Pathogen', description: 'Nearly complete neurolytic pathogen' },
    
    // === TRANSPORTER TECHNOLOGY ===
    'Item_Echo_Beaming': { displayName: 'Echo Beaming', description: 'Transporter enhancement technology' },
    'Item_Linked_Beaming': { displayName: 'Linked Beaming', description: 'Coordinated transport capability' },
    'Item_Modified_Transporter_Relay': { displayName: 'Modified Transporter Relay', description: 'Enhanced transporter range' },
    'Item_Transporter_Containment_Field': { displayName: 'Transporter Containment Field', description: 'Research papers on containment technology' },
    'Item_Transporter_Signal_Amplifier': { displayName: 'Transporter Signal Amplifier', description: 'Boosts transporter signal strength' },
    'Item_Investigate_Transporter_Accident': { displayName: 'Investigate Transporter Accident', description: 'Research into transporter malfunction' },
    
    // === HOLOGRAPHIC ITEMS ===
    'Item_Doctor': { displayName: 'The Doctor', description: 'Emergency Medical Hologram research' },
    'Item_Mobile_Emitter': { displayName: 'Mobile Emitter', description: '29th century mobile holographic emitter' },
    'Item_Holographic_Body': { displayName: 'Holographic Body', description: 'Physical form for holographic beings' },
    'Item_Holographic_Ships': { displayName: 'Holographic Ships', description: 'Plans for creating holographic decoys' },
    'Item_Advanced_Holodeck_Simulation': { displayName: 'Advanced Holodeck Simulation', description: 'Enhanced holographic technology' },
    
    // === SCIENTIFIC ITEMS ===
    'Item_Asteroid_Sample': { displayName: 'Asteroid Sample', description: 'Mineral sample for analysis' },
    'Item_Apples_Roots': { displayName: 'Apples & Roots', description: 'Apple-like fruits & weird roots for study' },
    'Item_Orchids': { displayName: 'Orchid Samples', description: 'Plant samples for research' },
    'Item_Analyze_Orchids': { displayName: 'Orchid Research Report', description: 'Analysis of alien orchid specimens' },
    'Item_Benamite_Crystal': { displayName: 'Benamite Crystal', description: 'Rare crystal for quantum slipstream drive' },
    'Item_Benamite_Synthesis': { displayName: 'Benamite Synthesis', description: 'Process for creating benamite crystals' },
    'Item_Polyferranide': { displayName: 'Polyferranide', description: 'Rare compound with unique properties' },
    'Item_Phase_Variance_Analysis': { displayName: 'Phase Variance Analysis Report', description: 'Research on phase variance phenomena' },
    'Item_Spatial_Trajector': { displayName: 'Spatial Trajector Technology', description: 'Long-range transportation device' },
    'Item_Subspace_Bubble': { displayName: 'Subspace-Bubble Generator', description: 'Creates protective subspace fields' },
    'Item_Subspace_Relays': { displayName: 'Subspace Relays', description: 'Communication relay network' },
    'Item_Wormhole_Position': { displayName: 'Wormhole Position', description: 'Coordinates of wormhole location' },
    
    // === CREW/PERSONNEL ===
    'Item_Admiral_Janeway': { displayName: 'Admiral Janeway', description: 'Admiral Janeway\'s Medical Examination data' },
    'Item_Mental_Piloting_Link': { displayName: 'Mental Piloting Link', description: 'Neural interface for ship control' },
    'Item_Transfer_Synaptic_Patterns': { displayName: 'Transfer Synaptic Patterns', description: 'Technology for consciousness transfer' },
    
    // === MISC EQUIPMENT ===
    'Item_Coil_Scanner': { displayName: 'Modified Coil Scanner', description: 'Enhanced scanning equipment' },
    'Item_Field_Generator': { displayName: 'Field Generator', description: 'Multipurpose energy field device' },
    'Item_Multiphasic_Force_Field_Generator': { displayName: 'Multiphasic Force Field Generator', description: 'Advanced defensive barrier technology' },
    'Item_Expander': { displayName: 'Expander', description: 'Device for expanding capabilities' },
    'Item_Plot_Armor': { displayName: 'Plot Armor', description: 'Special protective equipment' },
    'Item_Emergency_Stop': { displayName: 'Emergency Stop', description: 'Emergency braking system' },
    'Item_Tribble_Trap': { displayName: 'Tribble Trap', description: 'Device for containing tribbles' },
    'Item_Tribble_Sterilization': { displayName: 'Tribble Sterilization', description: 'Method to control tribble population' },
    
    // === RESEARCH/DATA ===
    'Item_Proof_Of_Crime': { displayName: 'Proof Of Crime', description: 'Evidence of criminal activity' },
    'Item_Decoded_Letters_Family': { displayName: 'Decoded Family Letters', description: 'Personal communications from home' },
    'Item_John_Kellys_Recordings': { displayName: 'John Kelly\'s Recordings', description: 'Historical recordings from Ares IV' },
    'Item_Dauntless_Analysis': { displayName: 'Dauntless Analysis', description: 'Technical analysis of the USS Dauntless' },
    'Item_Results_of_Hazari_Transmission': { displayName: 'Results of Hazari Transmission', description: 'Decoded Hazari communications' },
    'Item_Signal_Redirection_And_Decoding': { displayName: 'Code Concept for Signal Redirection and Decoding', description: 'Signal processing technology' },
    
    // === SPECIAL TECHNOLOGY ===
    'Item_Antimatter_Warp_Core_Boost_Technology': { displayName: 'Antimatter Warp Core Boost Technology', description: 'Enhancement for warp core output' },
    'Item_Bio_Dampener_Technology': { displayName: 'Bio-Dampener Technology', description: 'Blueprints for bio-dampener construction' },
    'Item_Neural_Interface_For_Signal_Reception_And_Drone_Control': { displayName: 'Neural Interface for Signal Reception and Drone Control', description: 'Technology for controlling drones' },
    'Item_Computational_Control_And_Nanite_Calibration': { displayName: 'Computational Control & Nanite Calibration', description: 'Nanite control systems' },
    'Item_Core_Assembly': { displayName: 'Core Assembly', description: 'Central assembly components' },
    'Item_Core_Integration': { displayName: 'Core Integration & Power Systems', description: 'Power coupling technology' },
    'Item_Modified_Nanoprobes': { displayName: 'Modified Nanoprobes', description: 'Enhanced Borg nanoprobes' },
    'Item_Photon_Torpedo_Modifications': { displayName: 'Photon Torpedo Modifications', description: 'Upgrade specs for torpedoes' },
    'Item_Shuttle_Radiation_Shields': { displayName: 'Shuttle Radiation Shields', description: 'Radiation protection for shuttles' },
    'Item_Shuttle_Shield_Adjustments': { displayName: 'Shuttle Shield Adjustments', description: 'Shield calibration for shuttles' },
    
    // === COMBAT ALLIES ===
    'Combat_Ally_Borg_Probe': { displayName: 'Borg Probe Ally', description: 'Friendly Borg probe vessel' },
    'Combat_Ally_Borg_Sphere': { displayName: 'Borg Sphere Ally', description: 'Friendly Borg sphere vessel' },
    'Combat_Ally_Dreadnought': { displayName: 'Cardassian ATR-4107', description: 'Cardassian Dreadnought missile ally' },
    'Combat_Ally_Hazari': { displayName: 'Hazari Ally', description: 'Hazari bounty hunter ally' },
    'Combat_Ally_Maquis': { displayName: 'Maquis Raider Ally', description: 'Maquis raider support vessel' },
    'Combat_Ally_Talax_S2': { displayName: 'Talaxian Ally S2', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S3': { displayName: 'Talaxian Ally S3', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S4': { displayName: 'Talaxian Ally S4', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S5': { displayName: 'Talaxian Ally S5', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S6': { displayName: 'Stronger Talaxian Ally', description: 'Enhanced Talaxian support ship' },
    'Combat_Ally_Talax_S7': { displayName: 'Mighty Talaxian Ally', description: 'Powerful Talaxian support ship' },
    'Combat_Ally_Talax_S8': { displayName: 'Talaxian Ally S8', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S9': { displayName: 'Talaxian Ally S9', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S10': { displayName: 'Talaxian Ally S10', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S11': { displayName: 'Talaxian Ally S11', description: 'Talaxian support ship' },
    'Combat_Ally_Talax_S12': { displayName: 'Talaxian Ally S12', description: 'Talaxian support ship' },
    'Combat_Ally_TechTier2': { displayName: 'Tech Tier 2 Ally', description: 'Combat ally unlocked at tech tier 2' },
    'Combat_Ally_TechTier4': { displayName: 'Tech Tier 4 Ally', description: 'Combat ally unlocked at tech tier 4' },
    'Combat_Ally_TechTier5': { displayName: 'Tech Tier 5 Ally', description: 'Combat ally unlocked at tech tier 5' },
    'Combat_Ally_Test': { displayName: 'Test Ally', description: 'Debug combat ally' },
    'Combat_Ally_Trabe': { displayName: 'Trabe Ally', description: 'Trabe support vessel' },
    
    // === CRAFT RECIPES ===
    'Craft_Ablative_armor': { displayName: 'Craft: Ablative Armor', description: 'Recipe to craft ablative armor' },
    'Craft_Adaptive_Bio_Filters_And_Forcefield_Generators': { displayName: 'Craft: Adaptive Bio Filters', description: 'Recipe to craft bio filters' },
    'Craft_Advanced_Holodeck_Simulation': { displayName: 'Craft: Advanced Holodeck Simulation', description: 'Recipe to craft holodeck upgrades' },
    'Craft_Antimatter_Warp_Core_Boost_Technology': { displayName: 'Craft: Warp Core Boost', description: 'Recipe to craft warp core boost' },
    'Craft_Benamite_Crystal_Replication': { displayName: 'Craft: Benamite Crystal Replication', description: 'Recipe to replicate benamite crystals' },
    'Craft_Benamite_Synthesis': { displayName: 'Craft: Benamite Synthesis', description: 'Recipe to synthesize benamite' },
    'Craft_Bio_Molecular_Disruptor': { displayName: 'Craft: Bio-Molecular Disruptor', description: 'Recipe to craft bio-molecular disruptor' },
    'Craft_Borg_Pathogen': { displayName: 'Craft: Borg Pathogen', description: 'Recipe to craft anti-Borg pathogen' },
    'Craft_Cheap_Probe': { displayName: 'Craft: Cheap Probe', description: 'Recipe to craft basic probes' },
    'Craft_Computational_Control_And_Nanite_Calibration': { displayName: 'Craft: Nanite Calibration', description: 'Recipe to craft nanite control systems' },
    'Craft_Core_Assembly': { displayName: 'Craft: Core Assembly', description: 'Recipe to craft core assembly' },
    'Craft_Core_Integration': { displayName: 'Craft: Core Integration', description: 'Recipe to craft power integration' },
    'Craft_Cortical_Jammer': { displayName: 'Craft: Cortical Jammer', description: 'Recipe to craft cortical jammers' },
    'Craft_Emergency_Stop': { displayName: 'Craft: Emergency Stop', description: 'Recipe to craft emergency stop' },
    'Craft_Examination_Drone': { displayName: 'Craft: Examination Drone', description: 'Recipe to craft examination drones' },
    'Craft_Genetic_Resequencing_Vector_Hypospray': { displayName: 'Craft: Genetic Resequencing Hypospray', description: 'Recipe to craft genetic hypospray' },
    'Craft_Holographic_Body': { displayName: 'Craft: Holographic Body', description: 'Recipe to craft holographic body' },
    'Craft_Multiphasic_Force_Field_Generator': { displayName: 'Craft: Multiphasic Force Field', description: 'Recipe to craft force field generator' },
    'Craft_Neural_Interface_For_Signal_Reception_And_Drone_Control': { displayName: 'Craft: Neural Interface', description: 'Recipe to craft neural drone control' },
    'Craft_Photon_Torpedo_Modifications': { displayName: 'Craft: Photon Torpedo Modifications', description: 'Recipe to craft torpedo upgrades' },
    'Craft_Photon_Torpedoes': { displayName: 'Craft: Photon Torpedoes', description: 'Recipe to craft photon torpedoes' },
    'Craft_Quantum_Slipstream_Drive_Adjustments': { displayName: 'Craft: Slipstream Adjustments', description: 'Recipe to craft slipstream calibration' },
    'Craft_Quantum_Slipstream_Drive_Craft': { displayName: 'Craft: Quantum Slipstream Drive', description: 'Recipe to craft slipstream drive' },
    'Craft_Remote_Controlled_Probe': { displayName: 'Craft: Remote-Controlled Probe', description: 'Recipe to craft remote probes' },
    'Craft_Shuttle_Radiation_Shields': { displayName: 'Craft: Shuttle Radiation Shields', description: 'Recipe to craft shuttle shields' },
    'Craft_Shuttle_Shield_Adjustments': { displayName: 'Craft: Shuttle Shield Adjustments', description: 'Recipe to craft shuttle shield calibration' },
    'Craft_Sturdy_Probe': { displayName: 'Craft: Sturdy Probe', description: 'Recipe to craft sturdy probes' },
    'Craft_Torpedo': { displayName: 'Craft: Torpedo', description: 'Recipe to craft basic torpedoes' },
    'Craft_Transphasic_torpedoes': { displayName: 'Craft: Transphasic Torpedoes', description: 'Recipe to craft transphasic torpedoes' },
    'Craft_Transporter_Signal_Amplifier': { displayName: 'Craft: Transporter Signal Amplifier', description: 'Recipe to craft signal amplifier' },
    'Craft_Tribble_Trap': { displayName: 'Craft: Tribble Trap', description: 'Recipe to craft tribble traps' },
    'Craft_Vinculum': { displayName: 'Craft: Vinculum', description: 'Recipe to craft Borg vinculum' },
    
    // === PRODUCTION RECIPES ===
    'Produce_BioNeuralGelPack': { displayName: 'Produce: Bio-Neural Gel Pack Lv1', description: 'Produces gel packs from food & duranium' },
    'Produce_BioNeuralGelPackLevel2': { displayName: 'Produce: Bio-Neural Gel Pack Lv2', description: 'Enhanced gel pack production' },
    'Produce_BioNeuralGelPackLevel3': { displayName: 'Produce: Bio-Neural Gel Pack Lv3', description: 'Advanced gel pack production' },
    'Produce_BorgNanites': { displayName: 'Produce: Borg Nanites Lv1', description: 'Basic nanite production' },
    'Produce_BorgNanitesLevel2': { displayName: 'Produce: Borg Nanites Lv2', description: 'Enhanced nanite production' },
    'Produce_BorgNanitesLevel3': { displayName: 'Produce: Borg Nanites Lv3', description: 'Advanced nanite production' },
    'Produce_Deuterium_WasteDeassembler': { displayName: 'Produce: Deuterium (Waste)', description: 'Produces deuterium from waste' },
    'Produce_Deuterium_WasteDeassemblerLevel2': { displayName: 'Produce: Deuterium (Waste) Lv2', description: 'Enhanced deuterium from waste' },
    'Produce_Duranium_WasteDeassembler': { displayName: 'Produce: Duranium (Waste)', description: 'Produces duranium from waste' },
    'Produce_Duranium_WasteDeassemblerLevel2': { displayName: 'Produce: Duranium (Waste) Lv2', description: 'Enhanced duranium from waste' },
    'Produce_Food_HydroponicsBay_Level1': { displayName: 'Produce: Food (Hydroponics) Lv1', description: 'Grows food in hydroponics bay' },
    'Produce_Food_HydroponicsBay_Level2': { displayName: 'Produce: Food (Hydroponics) Lv2', description: 'Enhanced food production' },
    'Produce_Food_HydroponicsBay_Level3': { displayName: 'Produce: Food (Hydroponics) Lv3', description: 'Advanced food production' },
    'Produce_Food_LargeHydroponicsBay_Level1': { displayName: 'Produce: Food (Large Hydroponics) Lv1', description: 'Large-scale food production' },
    'Produce_Food_LargeHydroponicsBay_Level2': { displayName: 'Produce: Food (Large Hydroponics) Lv2', description: 'Enhanced large-scale food production' },
    'Produce_Tritanium_WasteDeassembler': { displayName: 'Produce: Tritanium (Waste)', description: 'Produces tritanium from waste' },
    
    // === BLUEPRINT RECIPES ===
    'Recipe_Anti_Radiation_Shields': { displayName: 'Blueprint: Anti-Radiation Shields', description: 'Blueprints for radiation shields' },
    'Recipe_Better_Shuttle': { displayName: 'Blueprint: Better Shuttle', description: 'Blueprints for improved shuttle' },
    'Recipe_Biomolecular_Warheads_Bundle': { displayName: 'Blueprint: Bio-Molecular Warheads', description: 'Blueprints for bio-molecular warheads' },
    'Recipe_Borg_Notes': { displayName: 'Blueprint: Borg Notes', description: 'Blueprints derived from Borg knowledge' },
    'Recipe_Borg_Tracking_Device': { displayName: 'Blueprint: Borg Tracking Device', description: 'Blueprints for Borg tracker' },
    'Recipe_Coil_Scanner': { displayName: 'Blueprint: Modified Coil Scanner', description: 'Blueprints for enhanced scanner' },
    'Recipe_Discardable_Shuttle': { displayName: 'Blueprint: Single-Use Shuttle', description: 'Blueprints for expendable shuttle' },
    'Recipe_Expander': { displayName: 'Blueprint: Expander', description: 'Blueprints for expander device' },
    'Recipe_Holographic_Ships': { displayName: 'Blueprint: Holographic Ships', description: 'Plans for holographic ship decoys' },
    'Recipe_Modified_Nanoprobes': { displayName: 'Blueprint: Modified Nanoprobes', description: 'Blueprints for enhanced nanoprobes' },
    'Recipe_Modified_Transporter_Relay': { displayName: 'Blueprint: Modified Transporter Relay', description: 'Blueprints for transporter relay' },
    'Recipe_Plot_Armor': { displayName: 'Blueprint: Plot Armor', description: 'Blueprints for special armor' },
    'Recipe_Subspace_Bubble': { displayName: 'Blueprint: Subspace-Bubble Generator', description: 'Blueprints for subspace bubble' },
    'Recipe_Subspace_Relays': { displayName: 'Blueprint: Subspace Relays', description: 'Blueprints for relay network' },
    'Recipe_Vidiian_Disguise': { displayName: 'Blueprint: Vidiian Disguise', description: 'Blueprints for Vidiian disguise' },
    
    // === RESEARCH ITEMS ===
    'Research_Ablative_Armor': { displayName: 'Research: Ablative Armor', description: 'Ablative Armor Research Papers' },
    'Research_Adaptive_Bio_Filters_And_Forcefield_Generators': { displayName: 'Research: Bio Filters', description: 'Research on adaptive bio filters' },
    'Research_Admiral_Janeway': { displayName: 'Research: Admiral Janeway', description: 'Admiral Janeway\'s Medical Report' },
    'Research_Analyze_Orchids': { displayName: 'Research: Orchids', description: 'Orchid sample analysis' },
    'Research_Apples_Roots': { displayName: 'Research: Apples & Roots', description: 'Alien plant research' },
    'Research_Ares_IV_Module': { displayName: 'Research: Ares IV Module', description: 'Analysis of Ares IV components' },
    'Research_Asteroid_Sample': { displayName: 'Research: Asteroid Sample', description: 'Asteroid Sample Report' },
    'Research_Bio_Dampener_Technology': { displayName: 'Research: Bio-Dampener', description: 'Bio-Dampener Technology Blueprints' },
    'Research_Bio_Molecular_Disruptor': { displayName: 'Research: Bio-Molecular Disruptor', description: 'Bio-Molecular Disruptor Blueprints' },
    'Research_Borg_Bio_Dampeners': { displayName: 'Research: Borg Bio-Dampeners', description: 'Borg bio-dampener research' },
    'Research_Borg_Combat_Logs': { displayName: 'Research: Borg Combat Logs', description: 'Analysis of Borg combat tactics' },
    'Research_Borg_Corpse': { displayName: 'Research: Borg Corpse', description: 'Borg physiology research' },
    'Research_Borg_Data_Link': { displayName: 'Research: Borg Data Link', description: 'Borg Data Link Translation' },
    'Research_Borg_Data_Nodes': { displayName: 'Research: Borg Data Nodes', description: 'Borg Data Node Remnants analysis' },
    'Research_Borg_Fetus': { displayName: 'Research: Borg Fetus', description: 'Borg development research' },
    'Research_Borg_Frequency_Modulation_And_Subspace_Communication_Signatures': { displayName: 'Research: Borg Frequencies', description: 'Borg Subspace Frequency Modulation Research Papers' },
    'Research_Borg_Implants_and_Neurophysiology': { displayName: 'Research: Borg Implants', description: 'Collected Data on Borg Implants and Neurophysiology' },
    'Research_Cortical_Jammer': { displayName: 'Research: Cortical Jammer', description: 'Cortical jammer development' },
    'Research_Danaras_Cure_With_Antibody': { displayName: 'Research: Danara\'s Cure (with Antibody)', description: 'Phage cure with antibody' },
    'Research_Danaras_Cure_Without_Antibody': { displayName: 'Research: Danara\'s Cure (without Antibody)', description: 'Phage cure without antibody' },
    'Research_Dauntless_Analysis': { displayName: 'Research: Dauntless', description: 'USS Dauntless technical analysis' },
    'Research_Decoded_Letters_Family': { displayName: 'Research: Family Letters', description: 'Decoded communications research' },
    'Research_Doctor': { displayName: 'Research: The Doctor', description: 'EMH program research' },
    'Research_Echo_Beaming': { displayName: 'Research: Echo Beaming', description: 'Echo transporter research' },
    'Research_Hazari_Transmission': { displayName: 'Research: Hazari Transmission', description: 'Hazari communications analysis' },
    'Research_Holographic_Ships': { displayName: 'Research: Holographic Ships', description: 'Holographic decoy research' },
    'Research_Investigate_Transporter_Accident': { displayName: 'Research: Transporter Accident', description: 'Transporter malfunction analysis' },
    'Research_Linked_Beaming': { displayName: 'Research: Linked Beaming', description: 'Coordinated transport research' },
    'Research_Mass_Cure': { displayName: 'Research: Mass Cure', description: 'Large-scale treatment research' },
    'Research_Mental_Piloting_Link': { displayName: 'Research: Mental Piloting Link', description: 'Neural piloting interface research' },
    'Research_Mobile_Emitter': { displayName: 'Research: Mobile Emitter', description: 'Mobile holographic emitter research' },
    'Research_Modified_Probe': { displayName: 'Research: Modified Probe', description: 'Probe modification research' },
    'Research_Multi_Adaptive_Shielding': { displayName: 'Research: Multi-Adaptive Shielding', description: 'Adaptive shield research' },
    'Research_Nanoprobe_Torpedo_Tech': { displayName: 'Research: Nanoprobe Torpedo', description: 'Nanoprobe torpedo technology research' },
    'Research_Neurolytic': { displayName: 'Research: Neurolytic Pathogen', description: 'Neurolytic pathogen development' },
    'Research_Night_Alien_EMP': { displayName: 'Research: Night Alien EMP', description: 'Blueprints for Night Alien EMP' },
    'Research_Nutriplexer': { displayName: 'Research: Nutriplexer', description: 'Nutriplexer Research Papers' },
    'Research_Partially_destroyed_Borg_Combat_Logs': { displayName: 'Research: Partial Borg Combat Logs', description: 'Damaged Borg combat data' },
    'Research_Phase_Variance_Analysis': { displayName: 'Research: Phase Variance', description: 'Phase variance phenomena research' },
    'Research_Quantum_Slipstream_Drive_Blueprint': { displayName: 'Research: Slipstream Blueprint', description: 'Quantum Slipstream Drive Blueprints' },
    'Research_Quantum_Slipstream_Theory': { displayName: 'Research: Slipstream Theory', description: 'Quantum Slipstream Theory research' },
    'Research_Signal_Redirection_And_Decoding': { displayName: 'Research: Signal Decoding', description: 'Signal processing research' },
    'Research_Standard_Probe': { displayName: 'Research: Standard Probe', description: 'Standard probe development' },
    'Research_Test': { displayName: 'Research: Test', description: 'Debug research item' },
    'Research_Transfer_Synaptic_Patterns': { displayName: 'Research: Synaptic Patterns', description: 'Consciousness transfer research' },
    'Research_Transphasic_Torpedoes': { displayName: 'Research: Transphasic Torpedoes', description: 'Transphasic Torpedoes Research Papers' },
    'Research_Transporter_Containment_Field': { displayName: 'Research: Transporter Containment', description: 'Containment Field Research Papers' },
    'Research_Transporter_Signal_Amplifier': { displayName: 'Research: Signal Amplifier', description: 'Transporter signal amplifier research' },
    'Research_Tribble_Sterilization': { displayName: 'Research: Tribble Sterilization', description: 'Tribble population control research' },
    'Research_Wormhole_Position': { displayName: 'Research: Wormhole Position', description: 'Wormhole location analysis' },
    
    // === SPECIAL/SYSTEM ===
    'Collectabe_Data_Package': { displayName: 'Data Package', description: 'Collectible data package from missions' },
    'Internal.PlayerNeverHasThis': { displayName: '[System]', description: 'Internal system marker' },
    'Test_A': { displayName: 'Test A', description: 'Debug item A' },
    'Test_B': { displayName: 'Test B', description: 'Debug item B' },
    'Test_Craft': { displayName: 'Test Craft', description: 'Debug craft item' },
};

// Base resources - always editable quantities
export const BASE_RESOURCES = [
    'Crew',
    'Energy', 
    'Food',
    'Deuterium',
    'Dilithium',
    'Duranium',
    'Tritanium',
    'Morale',
    'MoraleMax',
    'Happiness',
    'SciencePoints',
    'BioNeuralGelPack',
    'BorgNanites',
    'Batteries',
    'Cycles',
    'CrewAssigned',
    'LivingSpace',
    'WorkTeams',
    'WorkTeamsAssigned',
    'ThreatLevel',
];

// Known stackable items - these have meaningful quantities > 1
// Everything else is a boolean unlock (quantity = 1 means unlocked, 0 or not present = locked)
export const STACKABLE_ITEMS = [
    'Items.Item.ResearchPoints',
    'Items.Item.Item_Torpedo',
    'Items.Item.Item_Biological_Borg_Sample',
    'Items.Item.Item_Photon_Torpedoes',
    'Items.Item.Item_Transphasic_torpedoes',
    'Items.Item.Item_Biomolecular_Warheads_Bundle',
    'Items.Item.Item_Benamite_Crystal',
    'Items.Item.Item_Cheap_Probe',
    'Items.Item.Item_Standard_Probe',
    'Items.Item.Item_Sturdy_Probe',
    'Items.Item.Item_Remote_Controlled_Probe',
    'Items.Item.Item_Examination_Drone',
    'Items.Item.Item_Modified_Probe',
    'Items.Item.Item_Data_of_Probe',
    'Items.Item.Item_Discardable_Shuttle',
    'Items.Item.Collectabe_Data_Package',
];

// Short names of stackable items (without Items.Item. prefix) for easy lookup
export const STACKABLE_SHORT_NAMES = new Set([
    'ResearchPoints',
    'Item_Torpedo',
    'Item_Biological_Borg_Sample',
    'Item_Photon_Torpedoes',
    'Item_Transphasic_torpedoes',
    'Item_Biomolecular_Warheads_Bundle',
    'Item_Benamite_Crystal',
    'Item_Cheap_Probe',
    'Item_Standard_Probe',
    'Item_Sturdy_Probe',
    'Item_Remote_Controlled_Probe',
    'Item_Examination_Drone',
    'Item_Modified_Probe',
    'Item_Data_of_Probe',
    'Item_Discardable_Shuttle',
    'Collectabe_Data_Package',
]);

// All items from the game (prefixed with Items.Item.)
// Categories based on naming convention in Items.ini
export const ALL_ITEMS = {
    // Combat Allies - unlock boolean
    combatAllies: [
        'Combat_Ally_Borg_Probe',
        'Combat_Ally_Borg_Sphere',
        'Combat_Ally_Dreadnought',
        'Combat_Ally_Hazari',
        'Combat_Ally_Maquis',
        'Combat_Ally_Talax_S2',
        'Combat_Ally_Talax_S3',
        'Combat_Ally_Talax_S4',
        'Combat_Ally_Talax_S5',
        'Combat_Ally_Talax_S6',
        'Combat_Ally_Talax_S7',
        'Combat_Ally_Talax_S8',
        'Combat_Ally_Talax_S9',
        'Combat_Ally_Talax_S10',
        'Combat_Ally_Talax_S11',
        'Combat_Ally_Talax_S12',
        'Combat_Ally_TechTier2',
        'Combat_Ally_TechTier4',
        'Combat_Ally_TechTier5',
        'Combat_Ally_Test',
        'Combat_Ally_Trabe',
    ],
    
    // Craftable items - unlock/recipe boolean
    craftables: [
        'Craft_Ablative_armor',
        'Craft_Adaptive_Bio_Filters_And_Forcefield_Generators',
        'Craft_Advanced_Holodeck_Simulation',
        'Craft_Antimatter_Warp_Core_Boost_Technology',
        'Craft_Benamite_Crystal_Replication',
        'Craft_Benamite_Synthesis',
        'Craft_Bio_Molecular_Disruptor',
        'Craft_Borg_Pathogen',
        'Craft_Cheap_Probe',
        'Craft_Computational_Control_And_Nanite_Calibration',
        'Craft_Core_Assembly',
        'Craft_Core_Integration',
        'Craft_Cortical_Jammer',
        'Craft_Emergency_Stop',
        'Craft_Examination_Drone',
        'Craft_Genetic_Resequencing_Vector_Hypospray',
        'Craft_Holographic_Body',
        'Craft_Multiphasic_Force_Field_Generator',
        'Craft_Neural_Interface_For_Signal_Reception_And_Drone_Control',
        'Craft_Photon_Torpedo_Modifications',
        'Craft_Photon_Torpedoes',
        'Craft_Quantum_Slipstream_Drive_Adjustments',
        'Craft_Quantum_Slipstream_Drive_Craft',
        'Craft_Remote_Controlled_Probe',
        'Craft_Shuttle_Radiation_Shields',
        'Craft_Shuttle_Shield_Adjustments',
        'Craft_Sturdy_Probe',
        'Craft_Torpedo',
        'Craft_Transphasic_torpedoes',
        'Craft_Transporter_Signal_Amplifier',
        'Craft_Tribble_Trap',
        'Craft_Vinculum',
    ],
    
    // Physical items - some stackable, some boolean
    items: [
        'Item_Ablative_armor',
        'Item_Adaptive_Bio_Filters_And_Forcefield_Generators',
        'Item_Admiral_Janeway',
        'Item_Advanced_Holodeck_Simulation',
        'Item_Analyze_Orchids',
        'Item_Anti_Borg_Virus_Sample',
        'Item_Anti_Radiation_Shields',
        'Item_Anti_Radiation_Vaccine',
        'Item_Antimatter_Warp_Core_Boost_Technology',
        'Item_Apples_Roots',
        'Item_Asteroid_Sample',
        'Item_Benamite_Crystal',
        'Item_Benamite_Synthesis',
        'Item_Better_Shuttle',
        'Item_Bio_Dampener_Technology',
        'Item_Bio_Molecular_Disruptor',
        'Item_Biological_Borg_Sample',
        'Item_Biomolecular_Warheads_Bundle',
        'Item_Borg_Bio_Dampeners',
        'Item_Borg_Combat_Logs',
        'Item_Borg_Corpse',
        'Item_Borg_Data_Link_Translation',
        'Item_Borg_Data_Nodes',
        'Item_Borg_Fetus',
        'Item_Borg_Frequency_Modulation_And_Subspace_Communication_Signatures',
        'Item_Borg_Implants_and_Neurophysiology',
        'Item_Borg_Maturation_Chamber',
        'Item_Borg_Notes',
        'Item_Borg_Pathogen',
        'Item_Borg_Probe_Parts',
        'Item_Borg_Tracking_Device',
        'Item_Cheap_Probe',
        'Item_Cloaking_Device',
        'Item_Coil_Scanner',
        'Item_Computational_Control_And_Nanite_Calibration',
        'Item_Core_Assembly',
        'Item_Core_Integration',
        'Item_Cortical_Jammer',
        'Item_Danaras_Cure',
        'Item_Data_of_Probe',
        'Item_Dauntless_Analysis',
        'Item_Decoded_Letters_Family',
        'Item_Discardable_Shuttle',
        'Item_Doctor',
        'Item_Echo_Beaming',
        'Item_Emergency_Stop',
        'Item_Examination_Drone',
        'Item_Expander',
        'Item_Field_Generator',
        'Item_Genetic_Resequencing_Vector_Hypospray',
        'Item_Holographic_Body',
        'Item_Holographic_Ships',
        'Item_Investigate_Transporter_Accident',
        'Item_John_Kellys_Recordings',
        'Item_Linked_Beaming',
        'Item_Mass_Cure',
        'Item_Mental_Piloting_Link',
        'Item_Mobile_Emitter',
        'Item_Modified_Nanoprobes',
        'Item_Modified_Probe',
        'Item_Modified_Transporter_Relay',
        'Item_Multi_Adaptive_Shielding',
        'Item_Multiphasic_Force_Field_Generator',
        'Item_Nanoprobe_Torpedo_Tech',
        'Item_Neural_Interface_For_Signal_Reception_And_Drone_Control',
        'Item_Neurolytic',
        'Item_Nucleogenic_Biobed',
        'Item_Nutriplexer',
        'Item_Orchids',
        'Item_Phase_Variance_Analysis',
        'Item_Photon_Torpedo_Modifications',
        'Item_Photon_Torpedoes',
        'Item_Plot_Armor',
        'Item_Polyferranide',
        'Item_Proof_Of_Crime',
        'Item_Quantum_Slipstream_Drive',
        'Item_Quantum_Slipstream_Drive_Adjustments',
        'Item_Regenerative_Fusion_Tech',
        'Item_Remote_Controlled_Probe',
        'Item_Results_of_Hazari_Transmission',
        'Item_Shuttle_Radiation_Shields',
        'Item_Shuttle_Shield_Adjustments',
        'Item_Signal_Redirection_And_Decoding',
        'Item_Slipstream_Drive_Technology',
        'Item_Spatial_Trajector',
        'Item_Standard_Probe',
        'Item_Sturdy_Probe',
        'Item_Subspace_Bubble',
        'Item_Subspace_Relays',
        'Item_Torpedo',
        'Item_Transfer_Synaptic_Patterns',
        'Item_Transphasic_torpedoes',
        'Item_Transporter_Containment_Field',
        'Item_Transporter_Signal_Amplifier',
        'Item_Transwarp_Coil',
        'Item_Tribble_Sterilization',
        'Item_Tribble_Trap',
        'Item_Vidiian_Disguise',
        'Item_Vidiian_Surgical_Device',
        'Item_Wormhole_Position',
    ],
    
    // Production recipes - unlock boolean
    production: [
        'Produce_BioNeuralGelPack',
        'Produce_BioNeuralGelPackLevel2',
        'Produce_BioNeuralGelPackLevel3',
        'Produce_BorgNanites',
        'Produce_BorgNanitesLevel2',
        'Produce_BorgNanitesLevel3',
        'Produce_Deuterium_WasteDeassembler',
        'Produce_Deuterium_WasteDeassemblerLevel2',
        'Produce_Duranium_WasteDeassembler',
        'Produce_Duranium_WasteDeassemblerLevel2',
        'Produce_Food_HydroponicsBay_Level1',
        'Produce_Food_HydroponicsBay_Level2',
        'Produce_Food_HydroponicsBay_Level3',
        'Produce_Food_LargeHydroponicsBay_Level1',
        'Produce_Food_LargeHydroponicsBay_Level2',
        'Produce_Tritanium_WasteDeassembler',
    ],
    
    // Recipes - unlock boolean
    recipes: [
        'Recipe_Anti_Radiation_Shields',
        'Recipe_Better_Shuttle',
        'Recipe_Biomolecular_Warheads_Bundle',
        'Recipe_Borg_Notes',
        'Recipe_Borg_Tracking_Device',
        'Recipe_Coil_Scanner',
        'Recipe_Discardable_Shuttle',
        'Recipe_Expander',
        'Recipe_Holographic_Ships',
        'Recipe_Modified_Nanoprobes',
        'Recipe_Modified_Transporter_Relay',
        'Recipe_Plot_Armor',
        'Recipe_Subspace_Bubble',
        'Recipe_Subspace_Relays',
        'Recipe_Vidiian_Disguise',
    ],
    
    // Research items - unlock boolean
    research: [
        'Research_Ablative_Armor',
        'Research_Adaptive_Bio_Filters_And_Forcefield_Generators',
        'Research_Admiral_Janeway',
        'Research_Analyze_Orchids',
        'Research_Apples_Roots',
        'Research_Ares_IV_Module',
        'Research_Asteroid_Sample',
        'Research_Bio_Dampener_Technology',
        'Research_Bio_Molecular_Disruptor',
        'Research_Borg_Bio_Dampeners',
        'Research_Borg_Combat_Logs',
        'Research_Borg_Corpse',
        'Research_Borg_Data_Link',
        'Research_Borg_Data_Nodes',
        'Research_Borg_Fetus',
        'Research_Borg_Frequency_Modulation_And_Subspace_Communication_Signatures',
        'Research_Borg_Implants_and_Neurophysiology',
        'Research_Cortical_Jammer',
        'Research_Danaras_Cure_With_Antibody',
        'Research_Danaras_Cure_Without_Antibody',
        'Research_Dauntless_Analysis',
        'Research_Decoded_Letters_Family',
        'Research_Doctor',
        'Research_Echo_Beaming',
        'Research_Hazari_Transmission',
        'Research_Holographic_Ships',
        'Research_Investigate_Transporter_Accident',
        'Research_Linked_Beaming',
        'Research_Mass_Cure',
        'Research_Mental_Piloting_Link',
        'Research_Mobile_Emitter',
        'Research_Modified_Probe',
        'Research_Multi_Adaptive_Shielding',
        'Research_Nanoprobe_Torpedo_Tech',
        'Research_Neurolytic',
        'Research_Night_Alien_EMP',
        'Research_Nutriplexer',
        'Research_Partially_destroyed_Borg_Combat_Logs',
        'Research_Phase_Variance_Analysis',
        'Research_Quantum_Slipstream_Drive_Blueprint',
        'Research_Quantum_Slipstream_Theory',
        'Research_Signal_Redirection_And_Decoding',
        'Research_Standard_Probe',
        'Research_Test',
        'Research_Transfer_Synaptic_Patterns',
        'Research_Transphasic_Torpedoes',
        'Research_Transporter_Containment_Field',
        'Research_Transporter_Signal_Amplifier',
        'Research_Tribble_Sterilization',
        'Research_Wormhole_Position',
    ],
    
    // Special items
    special: [
        'ResearchPoints',  // Stackable - main research currency
        'Collectabe_Data_Package',  // Quest item
        'Internal.PlayerNeverHasThis',  // System marker
        'Test_A',
        'Test_B',
        'Test_Craft',
    ],
};

/**
 * Get full item name with prefix
 * @param {string} shortName - Item name without prefix
 * @returns {string} Full item name with Items.Item. prefix
 */
export function getFullItemName(shortName) {
    return `Items.Item.${shortName}`;
}

/**
 * Get display name from full item name
 * @param {string} fullName - Full resource name
 * @returns {string} Cleaned display name
 */
export function getDisplayName(fullName) {
    // Remove Items.Item. prefix
    let shortName = fullName.replace(/^Items\.Item\./, '');
    
    // Check if we have metadata for this item
    if (ITEM_METADATA[shortName]) {
        return ITEM_METADATA[shortName].displayName;
    }
    
    // Check for base resources (no prefix)
    if (ITEM_METADATA[fullName]) {
        return ITEM_METADATA[fullName].displayName;
    }
    
    // Fallback: clean up the name
    let name = shortName;
    // Replace underscores with spaces
    name = name.replace(/_/g, ' ');
    // Handle special prefixes for clarity
    if (name.startsWith('Item ')) {
        name = name.substring(5);
    }
    return name;
}

/**
 * Get description for an item
 * @param {string} fullName - Full resource name
 * @returns {string|null} Item description or null
 */
export function getDescription(fullName) {
    // Remove Items.Item. prefix
    let shortName = fullName.replace(/^Items\.Item\./, '');
    
    // Check if we have metadata for this item
    if (ITEM_METADATA[shortName]) {
        return ITEM_METADATA[shortName].description;
    }
    
    // Check for base resources (no prefix)
    if (ITEM_METADATA[fullName]) {
        return ITEM_METADATA[fullName].description;
    }
    
    return null;
}

/**
 * Get item metadata (display name and description)
 * @param {string} fullName - Full resource name
 * @returns {Object} Object with displayName and description
 */
export function getItemMetadata(fullName) {
    const displayName = getDisplayName(fullName);
    const description = getDescription(fullName);
    return { displayName, description };
}

/**
 * Check if an item name (short or full) represents a stackable item
 * @param {string} name - Item name (with or without Items.Item. prefix)
 * @returns {boolean}
 */
export function isStackableName(name) {
    // Remove prefix if present
    const shortName = name.replace(/^Items\.Item\./, '');
    return STACKABLE_SHORT_NAMES.has(shortName);
}

/**
 * Determine if an item is stackable (quantity-based) vs boolean (unlock)
 * @param {Object|string} resourceOrName - Resource object or item name
 * @returns {boolean}
 */
export function isStackableItem(resourceOrName) {
    // If it's a string, check directly
    if (typeof resourceOrName === 'string') {
        return isStackableName(resourceOrName);
    }
    
    const resource = resourceOrName;
    
    // Base resources are always quantity-based
    if (BASE_RESOURCES.includes(resource.name)) {
        return true;
    }
    
    // Check against known stackable items
    if (STACKABLE_ITEMS.includes(resource.name)) {
        return true;
    }
    
    // Check short name
    const shortName = resource.name.replace(/^Items\.Item\./, '');
    if (STACKABLE_SHORT_NAMES.has(shortName)) {
        return true;
    }
    
    // Items with quantity > 1 are likely stackable
    if (resource.flag === 1 && resource.quantity > 1) {
        return true;
    }
    
    return false;
}

/**
 * Get all items as a flat array with full names
 * @returns {string[]}
 */
export function getAllItemNames() {
    const items = [];
    for (const category of Object.values(ALL_ITEMS)) {
        for (const item of category) {
            items.push(getFullItemName(item));
        }
    }
    return items;
}

/**
 * Get items that can be added to a save (excludes internal/test items)
 * @returns {Object} Categorized items for UI display
 */
export function getAddableItems() {
    return {
        'Stackable Items': ALL_ITEMS.special.filter(i => i === 'ResearchPoints')
            .concat(ALL_ITEMS.items.filter(i => 
                i.includes('Torpedo') || 
                i.includes('Probe') || 
                i.includes('Sample') ||
                i.includes('Warhead')
            ))
            .map(getFullItemName),
        'Combat Allies': ALL_ITEMS.combatAllies.map(getFullItemName),
        'Items': ALL_ITEMS.items.map(getFullItemName),
        'Recipes': ALL_ITEMS.recipes.map(getFullItemName),
        'Research': ALL_ITEMS.research.map(getFullItemName),
        'Production': ALL_ITEMS.production.map(getFullItemName),
        'Craftables': ALL_ITEMS.craftables.map(getFullItemName),
    };
}
