/**
 * Tech tree database for STV Save Editor.
 * Complete tech tree extracted from STVAbilityTags.ini in game files.
 * 
 * Tech paths follow the pattern: Tech.Category.Room.Skill
 * Categories: Engineering, Science, Crew, Combat, Borg, MissionPrerequisites
 * Also includes Ability.* entries
 * 
 * Each category has tiers (0-5) that must be unlocked to access higher skills.
 * Skills are organized by Room/Facility within each category.
 */

/**
 * All known tech tree entries, organized by category and room.
 * Structure: { category: { room: [skills] } }
 */
export const TECH_TREE = {
    engineering: {
        _tiers: [
            'Tech.Engineering.Tiers.0',
            'Tech.Engineering.Tiers.1',
            'Tech.Engineering.Tiers.2',
            'Tech.Engineering.Tiers.3',
            'Tech.Engineering.Tiers.4',
            'Tech.Engineering.Tiers.5',
        ],
        Main: [
            'Tech.Engineering.Main',
            'Tech.Engineering.Main.EquinoxAntimetterInjector',
            'Tech.Engineering.Main.Plating',
            'Tech.Engineering.Main.PowerLvl2',
            'Tech.Engineering.Main.PowerLvl3',
            'Tech.Engineering.Main.PowerLvl4',
            'Tech.Engineering.Main.PowerLvl5',
            'Tech.Engineering.Main.PowerLvl6',
            'Tech.Engineering.Main.ThoriumInfusedCore',
            'Tech.Engineering.Main.WarpCoreEfficiency1',
            'Tech.Engineering.Main.WarpCoreEfficiency2',
            'Tech.Engineering.Main.WarpCoreEfficiency3',
            'Tech.Engineering.Main.WarpFieldDiagnostics',
        ],
        Hull: [
            'Tech.Engineering.Hull',
            'Tech.Engineering.Hull.AblativeArmor',
            'Tech.Engineering.Hull.ConstructionModule',
            'Tech.Engineering.Hull.HullRepairEfficiency1',
            'Tech.Engineering.Hull.HullRepairEfficiency2',
            'Tech.Engineering.Hull.OptimizedHullRepair',
            'Tech.Engineering.Hull.ReactiveArmor',
            'Tech.Engineering.Hull.Reinforcement',
            'Tech.Engineering.Hull.Reinforcement.BorgArmor',
            'Tech.Engineering.Hull.Reinforcement.HardenedDuraniumArmor',
            'Tech.Engineering.Hull.Reinforcement.ImpenetrableHullPlating',
            'Tech.Engineering.Hull.Reinforcement.StructuralIntegrity',
            'Tech.Engineering.Hull.Repair',
            'Tech.Engineering.Hull.Repair.Level2',
        ],
        Offices: [
            'Tech.Engineering.Offices',
            'Tech.Engineering.Offices.AdvancedIndustrialReplicator',
            'Tech.Engineering.Offices.InterphasicCoilSpanner',
            'Tech.Engineering.Offices.Level2',
            'Tech.Engineering.Offices.Level3',
            'Tech.Engineering.Offices.MaterialRecovery',
            'Tech.Engineering.Offices.PlasmaTorch',
            'Tech.Engineering.Offices.StreamlinedConstruction',
        ],
        Engines: [
            'Tech.Engineering.Engines',
            'Tech.Engineering.Engines.Impulse',
            'Tech.Engineering.Engines.Impulse.EnhancedThrusters',
            'Tech.Engineering.Engines.Impulse.EnhancedThrusters.2',
            'Tech.Engineering.Engines.Impulse.GotanaRetzModulator',
            'Tech.Engineering.Engines.Impulse.MindPilotingLink',
            'Tech.Engineering.Engines.Impulse.ModifiedTrajectorMatrix',
            'Tech.Engineering.Engines.Warp',
            'Tech.Engineering.Engines.Warp.LimitedTranswarp',
            'Tech.Engineering.Engines.Warp.OmegaPower',
        ],
        Shuttlebay: [
            'Tech.Engineering.Shuttlebay',
            'Tech.Engineering.Shuttlebay.Aerowing',
            'Tech.Engineering.Shuttlebay.Aerowing.DiplomatsEar',
            'Tech.Engineering.Shuttlebay.Aerowing.ExpandedCargoHolds',
            'Tech.Engineering.Shuttlebay.Aerowing.MicroSlipstreamDrive',
            'Tech.Engineering.Shuttlebay.Aerowing.TradeNetworkExpansion',
            'Tech.Engineering.Shuttlebay.Aerowing.TradeProtocols',
            'Tech.Engineering.Shuttlebay.BlastShutters',
            'Tech.Engineering.Shuttlebay.DeltaFlyer',
            'Tech.Engineering.Shuttlebay.Dreadnought',
            'Tech.Engineering.Shuttlebay.EfficientDesign',
            'Tech.Engineering.Shuttlebay.Hyperspanner',
            'Tech.Engineering.Shuttlebay.Level2',
            'Tech.Engineering.Shuttlebay.Level3',
            'Tech.Engineering.Shuttlebay.TetraburniumHull',
        ],
        Workshop: [
            'Tech.Engineering.Workshop',
            'Tech.Engineering.Workshop.DreadnoughtWeaponry',
            'Tech.Engineering.Workshop.Efficiency',
            'Tech.Engineering.Workshop.Level2',
            'Tech.Engineering.Workshop.ViidianWeldingDevice',
        ],
        Storage: [
            'Tech.Engineering.Storage.CargoBay',
            'Tech.Engineering.Storage.CargoBay.Level2',
            'Tech.Engineering.Storage.Compartment',
            'Tech.Engineering.Storage.Compartment.Level2',
            'Tech.Engineering.Storage.Dynamic',
        ],
        BussardCollectors: [
            'Tech.Engineering.BussardCollectors',
            'Tech.Engineering.BussardCollectors.Level1',
            'Tech.Engineering.BussardCollectors.Level2',
            'Tech.Engineering.BussardCollectors.Level3',
        ],
        LifeSupport: [
            'Tech.Engineering.LifeSupport.Auxiliary',
            'Tech.Engineering.LifeSupport.EnvironmentalControl',
        ],
    },

    science: {
        _tiers: [
            'Tech.Science.Tier.0',
            'Tech.Science.Tier.1',
            'Tech.Science.Tier.2',
            'Tech.Science.Tier.3',
            'Tech.Science.Tier.4',
            'Tech.Science.Tier.5',
        ],
        StellarCartography: [
            'Tech.Science.StellarCartography',
            'Tech.Science.StellarCartography.ActiveScanNavigation',
            'Tech.Science.StellarCartography.AstrometricsLab',
            'Tech.Science.StellarCartography.NebulaScanning',
            'Tech.Science.StellarCartography.ResourceAnalysisSensors',
            'Tech.Science.StellarCartography.StellarCartography',
            'Tech.Science.StellarCartography.ThreatAssessmentSensors',
        ],
        ScienceLab: [
            'Tech.Science.ScienceLab',
            'Tech.Science.ScienceLab.AdvancedNeutronMicroscope',
            'Tech.Science.ScienceLab.Eureka',
            'Tech.Science.ScienceLab.HistoryofHumankind',
            'Tech.Science.ScienceLab.ScienceLabLevel1',
            'Tech.Science.ScienceLab.ScienceLabLevel2',
            'Tech.Science.ScienceLab.ScienceLabLevel3',
            'Tech.Science.ScienceLab.ScientificMilestone',
        ],
        BioLaboratory: [
            'Tech.Science.BioLaboratory',
            'Tech.Science.BioLaboratory.AdvancedBioProcessing1',
            'Tech.Science.BioLaboratory.AdvancedBioProcessing2',
            'Tech.Science.BioLaboratory.BorgNanites',
            'Tech.Science.BioLaboratory.Level1',
            'Tech.Science.BioLaboratory.Level2',
            'Tech.Science.BioLaboratory.Level3',
            'Tech.Science.BioLaboratory.OptimizedSynthesis',
        ],
        Hydroponics: [
            'Tech.Science.Hydroponics',
            'Tech.Science.Hydroponics.AdvancedLightingModule',
            'Tech.Science.Hydroponics.HydroponicsBayLevel1',
            'Tech.Science.Hydroponics.HydroponicsBayLevel2',
            'Tech.Science.Hydroponics.HydroponicsGardenLevel1',
            'Tech.Science.Hydroponics.HydroponicsGardenLevel2',
            'Tech.Science.Hydroponics.HydroponicsGardenLevel3',
        ],
        NavigationalDeflector: [
            'Tech.Science.NavigationalDeflector',
            'Tech.Science.NavigationalDeflector.AntiGravitonBeam',
            'Tech.Science.NavigationalDeflector.Level1',
            'Tech.Science.NavigationalDeflector.Level2',
            'Tech.Science.NavigationalDeflector.Level3',
            'Tech.Science.NavigationalDeflector.MetaphasicShielding',
            'Tech.Science.NavigationalDeflector.NavigationalDeflector',
            'Tech.Science.NavigationalDeflector.TachyonBeam',
        ],
        TransporterRoom: [
            'Tech.Science.TransporterRoom',
            'Tech.Science.TransporterRoom.CorticalStimulator',
            'Tech.Science.TransporterRoom.FieldStudies',
            'Tech.Science.TransporterRoom.FieldTraining',
            'Tech.Science.TransporterRoom.LinkedBeaming',
            'Tech.Science.TransporterRoom.RegenerativeFusion',
            'Tech.Science.TransporterRoom.TransporterRoom',
            'Tech.Science.TransporterRoom.TransporterRoomLevel2',
            'Tech.Science.TransporterRoom.TransporterRoomLevel3',
        ],
        BatteryCompartment: [
            'Tech.Science.BatteryCompartment',
            'Tech.Science.BatteryCompartment.HyperconductiveEnergyCells',
            'Tech.Science.BatteryCompartment.LargeBatteryCompartmentLevel1',
            'Tech.Science.BatteryCompartment.LargeBatteryCompartmentLevel2',
            'Tech.Science.BatteryCompartment.PlasmaRegulators',
            'Tech.Science.BatteryCompartment.PowerEfficiency',
            'Tech.Science.BatteryCompartment.PowerModulePrototype',
            'Tech.Science.BatteryCompartment.SmallBatteryCompartmentLevel1',
            'Tech.Science.BatteryCompartment.SmallBatteryCompartmentLevel2',
        ],
        SensorArray: [
            'Tech.Science.SensorArray',
            'Tech.Science.SensorArray.Level1',
            'Tech.Science.SensorArray.Level2',
            'Tech.Science.SensorArray.Level3',
        ],
        BussardCollectors: [
            'Tech.Science.BussardCollectors',
            'Tech.Science.BussardCollectors.BussardCollectors',
            'Tech.Science.BussardCollectors.Level2',
            'Tech.Science.BussardCollectors.Level3',
            'Tech.Science.BussardCollectors.MagneticFieldGenerator',
        ],
        CloakingDevice: [
            'Tech.Science.CloakingDevice',
            'Tech.Science.CloakingDevice.CloakingAccelerator',
            'Tech.Science.CloakingDevice.CloakingDevice',
            'Tech.Science.CloakingDevice.OptimizedCloakingMatrix',
        ],
        EnergyDissipater: [
            'Tech.Science.EnergyDissipater',
            'Tech.Science.EnergyDissipater.EnergyDissipater',
            'Tech.Science.EnergyDissipater.EnergyDissipaterLevel2',
            'Tech.Science.EnergyDissipater.Level3',
        ],
        TractorBeam: [
            'Tech.Science.TractorBeam',
            'Tech.Science.TractorBeam.Level1',
            'Tech.Science.TractorBeam.Level2',
            'Tech.Science.TractorBeam.Level3',
        ],
        WasteDeAssembler: [
            'Tech.Science.WasteDeAssembler',
            'Tech.Science.WasteDeAssembler.RadiationRecycling',
            'Tech.Science.WasteDeAssembler.WasteDeAssemblerLevel1',
            'Tech.Science.WasteDeAssembler.WasteDeAssemblerLevel2',
        ],
        MetaphasicShieldRoom: [
            'Tech.Science.MetaphasicShieldRoom',
            'Tech.Science.MetaphasicShieldRoom.Level2',
        ],
        Other: [
            'Tech.Science.Other',
            'Tech.Science.Other.CommunicationJammer',
            'Tech.Science.Other.HolographicShipProjector',
            'Tech.Science.Other.TelsianMiningLaser',
        ],
    },

    combat: {
        _tiers: [
            'Tech.Combat.Tier.0',
            'Tech.Combat.Tier.1',
            'Tech.Combat.Tier.2',
            'Tech.Combat.Tier.3',
            'Tech.Combat.Tier.4',
            'Tech.Combat.Tier.5',
        ],
        PhaserArray: [
            'Tech.Combat.PhaserArray',
            'Tech.Combat.PhaserArray.HirogenHuntingLaser',
            'Tech.Combat.PhaserArray.ImprovedPhaserFireRate',
            'Tech.Combat.PhaserArray.PhaserControlRoom',
            'Tech.Combat.PhaserArray.PhaserControlRoomLevel2',
            'Tech.Combat.PhaserArray.PhaserControlRoomLevel3',
            'Tech.Combat.PhaserArray.PhaserFrequencyModulation',
            'Tech.Combat.PhaserArray.VaadwaurTargetingTechnology',
        ],
        TorpedoLaunchBay: [
            'Tech.Combat.TorpedoLaunchBay',
            'Tech.Combat.TorpedoLaunchBay.BiomolecularTorpedoes',
            'Tech.Combat.TorpedoLaunchBay.BrillCheeseTorpedo',
            'Tech.Combat.TorpedoLaunchBay.DreadnoughtAI',
            'Tech.Combat.TorpedoLaunchBay.DreadnoughtMiniTorpedoes',
            'Tech.Combat.TorpedoLaunchBay.EMPTorpedo',
            'Tech.Combat.TorpedoLaunchBay.PhotonTorpedo',
            'Tech.Combat.TorpedoLaunchBay.PralorWeaponTechnology',
            'Tech.Combat.TorpedoLaunchBay.QuantumTorpedoes',
            'Tech.Combat.TorpedoLaunchBay.SpatialCharges',
            'Tech.Combat.TorpedoLaunchBay.TorpedoLaunchbay',
            'Tech.Combat.TorpedoLaunchBay.TorpedoLaunchbayLevel2',
            'Tech.Combat.TorpedoLaunchBay.TorpedoLaunchbayLevel3',
            'Tech.Combat.TorpedoLaunchBay.TorpedoShieldPenetration',
            'Tech.Combat.TorpedoLaunchBay.TorpedoStorageImprovement1',
            'Tech.Combat.TorpedoLaunchBay.TorpedoStorageImprovement2',
            'Tech.Combat.TorpedoLaunchBay.TransphasicTorpedo',
            'Tech.Combat.TorpedoLaunchBay.TricobaltDevices',
        ],
        ShieldGenerator: [
            'Tech.Combat.ShieldGenerator',
            'Tech.Combat.ShieldGenerator.OptimizedShieldMatrix',
            'Tech.Combat.ShieldGenerator.PralorShieldTechnology',
            'Tech.Combat.ShieldGenerator.RegenerativeShielding',
            'Tech.Combat.ShieldGenerator.RegenerativeShielding2',
            'Tech.Combat.ShieldGenerator.RotateShieldFrequency',
            'Tech.Combat.ShieldGenerator.ShieldGenerator',
            'Tech.Combat.ShieldGenerator.ShieldGeneratorLevel2',
            'Tech.Combat.ShieldGenerator.ShieldGeneratorLevel3',
        ],
        DisruptorArray: [
            'Tech.Combat.DisruptorArray',
            'Tech.Combat.DisruptorArray.DisruptorArrayControlRoom',
            'Tech.Combat.DisruptorArray.DisruptorArrayControlRoomLevel2',
            'Tech.Combat.DisruptorArray.DisruptorArrayControlRoomLevel3',
            'Tech.Combat.DisruptorArray.VidiianHyperthermicchargedDisruptorTechnology',
        ],
        IonCannons: [
            'Tech.Combat.IonCannons',
            'Tech.Combat.IonCannons.IonCannons',
            'Tech.Combat.IonCannons.IonCannonsLevel2',
        ],
        SecurityComplex: [
            'Tech.Combat.SecurityComplex',
            'Tech.Combat.SecurityComplex.AdvancedBoardingTactics',
            'Tech.Combat.SecurityComplex.Bio-Dampener',
            'Tech.Combat.SecurityComplex.SecurityComplex',
            'Tech.Combat.SecurityComplex.SecurityComplexLevel2',
        ],
        TractorBeam: [
            'Tech.Combat.TractorBeam.Level1',
            'Tech.Combat.TractorBeam.Level2',
            'Tech.Combat.TractorBeam.Level3',
        ],
        CombatRewards: [
            'Tech.Combat.CombatRewards',
            'Tech.Combat.CombatRewards.AdvancedSalvageProtocols',
            'Tech.Combat.CombatRewards.CaptainsAcknowledgment',
            'Tech.Combat.CombatRewards.CommendationCeremony',
            'Tech.Combat.CombatRewards.EmergencyForceFields',
            'Tech.Combat.CombatRewards.EnhancedStructuralIntegrityField',
            'Tech.Combat.CombatRewards.SalvageProtocols',
            'Tech.Combat.CombatRewards.VictoryCelebrations',
        ],
        CombatModifiers: [
            'Tech.Combat.CombatModifiers',
            'Tech.Combat.CombatModifiers.SenseOfSecurity',
            'Tech.Combat.CombatModifiers.TalaxianDynamite',
        ],
    },

    crew: {
        _tiers: [
            'Tech.Crew.Tier.0',
            'Tech.Crew.Tier.1',
            'Tech.Crew.Tier.2',
            'Tech.Crew.Tier.3',
            'Tech.Crew.Tier.4',
            'Tech.Crew.Tier.5',
        ],
        MessHall: [
            'Tech.Crew.MessHall',
            'Tech.Crew.MessHall.Deliciousmeals2',
            'Tech.Crew.MessHall.DeuteriumWasteReduction',
            'Tech.Crew.MessHall.DoubleFoodRations',
            'Tech.Crew.MessHall.EnhancedQualityReplicators',
            'Tech.Crew.MessHall.EnhancedQualityReplicators.1',
            'Tech.Crew.MessHall.EnhancedQualityReplicators.2',
            'Tech.Crew.MessHall.FoodEfficiency',
            'Tech.Crew.MessHall.GeneticResequencer',
            'Tech.Crew.MessHall.MessHallLevel1',
            'Tech.Crew.MessHall.MessHallLevel2',
            'Tech.Crew.MessHall.NeelixDelight',
            'Tech.Crew.MessHall.TrabeNutriplexer',
        ],
        Quarters: [
            'Tech.Crew.Quarters',
            'Tech.Crew.Quarters.AdvancedLivingStandards',
            'Tech.Crew.Quarters.CrewQuartersLevel1',
            'Tech.Crew.Quarters.CrewQuartersLevel2',
            'Tech.Crew.Quarters.EnlistedQuartersLevel1',
            'Tech.Crew.Quarters.EnlistedQuartersLevel2',
            'Tech.Crew.Quarters.MoreBeds',
            'Tech.Crew.Quarters.OfficersQuartersLevel1',
            'Tech.Crew.Quarters.OfficersQuartersLevel2',
            'Tech.Crew.Quarters.OptimizedEnergyConsumption',
        ],
        SickBay: [
            'Tech.Crew.SickBay',
            'Tech.Crew.SickBay.AllocatorEfficiencyModule',
            'Tech.Crew.SickBay.AntiRadiationVaccine',
            'Tech.Crew.SickBay.Autosuture',
            'Tech.Crew.SickBay.BorgLaserScalpels',
            'Tech.Crew.SickBay.EnhancedImmuneResponse',
            'Tech.Crew.SickBay.ExobiologyMedicine',
            'Tech.Crew.SickBay.NucleogenicBiobed',
            'Tech.Crew.SickBay.SickBayLevel1',
            'Tech.Crew.SickBay.SickBayLevel2',
            'Tech.Crew.SickBay.SickBayLevel3',
            'Tech.Crew.SickBay.VidiianSurgicalDevice',
        ],
        Holodeck: [
            'Tech.Crew.Holodeck',
            'Tech.Crew.Holodeck.AdvancedHolodeckSimulationTechnology',
            'Tech.Crew.Holodeck.CognitiveStimulationProtocols',
            'Tech.Crew.Holodeck.DisableSafetyProtocols',
            'Tech.Crew.Holodeck.ExpandedHolodeckProgramLibrary',
            'Tech.Crew.Holodeck.HolodeckEnergyEfficiency',
            'Tech.Crew.Holodeck.HolodeckLevel1',
            'Tech.Crew.Holodeck.HolodeckLevel2',
            'Tech.Crew.Holodeck.HolodeckLevel3',
        ],
        ObservatoryLounge: [
            'Tech.Crew.ObservatoryLounge',
            'Tech.Crew.ObservatoryLounge.BlastShutters',
            'Tech.Crew.ObservatoryLounge.ObservatoryLoungeLevel1',
            'Tech.Crew.ObservatoryLounge.ObservatoryLoungeLevel2',
        ],
        Brig: [
            'Tech.Crew.Brig',
            'Tech.Crew.Brig.BrigLevel1',
            'Tech.Crew.Brig.BrigLevel2',
            'Tech.Crew.Brig.ReintegrationProgram',
        ],
        Embassy: [
            'Tech.Crew.Embassy',
            'Tech.Crew.Embassy.DefensePact',
            'Tech.Crew.Embassy.EmbassyLevel1',
            'Tech.Crew.Embassy.EmbassyLevel2',
            'Tech.Crew.Embassy.ExtendedAlliedAssistance',
            'Tech.Crew.Embassy.NegotiationTactics',
            'Tech.Crew.Embassy.StrategicSurrenderProtocols',
        ],
        CombatAlly: [
            'Tech.Crew.CombatAlly',
            'Tech.Crew.CombatAlly.CostPerCycleReduction',
            'Tech.Crew.CombatAlly.InitialCostReduction',
            'Tech.Crew.CombatAlly.MightyTalaxianAlly',
            'Tech.Crew.CombatAlly.StrongerTalaxianAlly',
            'Tech.Crew.CombatAlly.TalaxianAlly',
        ],
        Morale: [
            'Tech.Crew.Morale',
            'Tech.Crew.Morale.InspiredWorkforce',
            'Tech.Crew.Morale.MoraleStabilityProtocols',
            'Tech.Crew.Morale.MoraleStabilityProtocols.Level2',
            'Tech.Crew.Morale.SynapticStimulator',
            'Tech.Crew.Morale.SynergisticPerformanceBoost',
        ],
        Surrender: [
            'Tech.Crew.Surrender',
            'Tech.Crew.Surrender.NegotiationTactics',
            'Tech.Crew.Surrender.StrategicSurrenderProtocols',
        ],
    },

    borg: {
        _tiers: [
            'Tech.Borg.Tier.0',
            'Tech.Borg.Tier.1',
            'Tech.Borg.Tier.2',
            'Tech.Borg.Tier.3',
            'Tech.Borg.Tier.4',
            'Tech.Borg.Tier.5',
        ],
        BorgARU: [
            'Tech.Borg.BorgARU',
            'Tech.Borg.BorgARU.AutonomousRegenerationSequencer',
            'Tech.Borg.BorgARU.BorgARUFacility',
            'Tech.Borg.BorgARU.BorgARUFacilityLevel2',
        ],
        BorgShieldMatrix: [
            'Tech.Borg.BorgShieldMatrix',
            'Tech.Borg.BorgShieldMatrix.BorgShieldMatrix',
            'Tech.Borg.BorgShieldMatrix.BorgShieldMatrixLevel2',
            'Tech.Borg.BorgShieldMatrix.OptimizedMatrix',
        ],
        BorgEnergyBeamWeaponry: [
            'Tech.Borg.BorgEnergyBeamWeaponry',
            'Tech.Borg.BorgEnergyBeamWeaponry.BorgEnergyBeamWeaponry',
            'Tech.Borg.BorgEnergyBeamWeaponry.BorgEnergyBeamWeaponryLevel2',
            'Tech.Borg.BorgEnergyBeamWeaponry.BorgEnergyBeamWeaponryLevel3',
            'Tech.Borg.BorgEnergyBeamWeaponry.TetreonParticleMatrix',
        ],
        BorgMaturationChamber: [
            'Tech.Borg.BorgMaturationChamber',
            'Tech.Borg.BorgMaturationChamber.BorgMaturationChamber',
            'Tech.Borg.BorgMaturationChamber.BorgMaturationChamberLevel2',
        ],
        BorgRegenerationAlcove: [
            'Tech.Borg.BorgRegenerationAlcove',
            'Tech.Borg.BorgRegenerationAlcove.BorgRegenerationAlcove',
            'Tech.Borg.BorgRegenerationAlcove.BorgRegenerationAlcoveLevel2',
        ],
        BorgNeuroElectricFieldGenerator: [
            'Tech.Borg.BorgNeuroElectricFieldGenerator',
            'Tech.Borg.BorgNeuroElectricFieldGenerator.BorgNeuroElectricFieldGenerator',
            'Tech.Borg.BorgNeuroElectricFieldGenerator.BorgNeuroElectricFieldGeneratorLevel2',
            'Tech.Borg.BorgNeuroElectricFieldGenerator.BorgNeuroElectricFieldGeneratorLevel3',
            'Tech.Borg.BorgNeuroElectricFieldGenerator.Vinculum-Anti-ViralAgent',
        ],
        BorgTactics: [
            'Tech.Borg.BorgTactics',
            'Tech.Borg.BorgTactics.DataMiningProtocols',
            'Tech.Borg.BorgTactics.DreamModuleTechnology',
            'Tech.Borg.BorgTactics.NeuralNetworkInterrogation',
            'Tech.Borg.BorgTactics.Resistanceisfutile',
        ],
        MessHall: [
            'Tech.Borg.MessHall',
            'Tech.Borg.MessHall.BorgFoodRations',
        ],
        _standalone: [
            'Tech.Borg',
            'Tech.Borg.BioDampener',
            'Tech.Borg.BorgArmorModule',
            'Tech.Borg.BorgLaserScalpels',
        ],
    },

    missionPrerequisites: {
        _all: [
            'Tech.MissionPrerequisites',
            'Tech.MissionPrerequisites.AblativeArmor',
            'Tech.MissionPrerequisites.AdvancedHolodeckSimulationTechnology',
            'Tech.MissionPrerequisites.AdvancedNeutronMicroscope',
            'Tech.MissionPrerequisites.AllocatorEfficiencyModule',
            'Tech.MissionPrerequisites.AntiRadiationVaccine',
            'Tech.MissionPrerequisites.AstrometricsLab',
            'Tech.MissionPrerequisites.BioDampener',
            'Tech.MissionPrerequisites.BiomolecularTorpedoes',
            'Tech.MissionPrerequisites.BorgArmorModule',
            'Tech.MissionPrerequisites.BorgARU',
            'Tech.MissionPrerequisites.BorgCuttingBeam',
            'Tech.MissionPrerequisites.BorgLaserScalpels',
            'Tech.MissionPrerequisites.BorgMaturationChamber',
            'Tech.MissionPrerequisites.BorgNanites',
            'Tech.MissionPrerequisites.BorgNeuroElectricFieldGenerator',
            'Tech.MissionPrerequisites.BorgRegenerationAlcove',
            'Tech.MissionPrerequisites.BorgShieldMatrix',
            'Tech.MissionPrerequisites.BrillCheeseTorpedo',
            'Tech.MissionPrerequisites.CloakingDevice',
            'Tech.MissionPrerequisites.CommunicationJammer',
            'Tech.MissionPrerequisites.DisruptorControlRoom',
            'Tech.MissionPrerequisites.Dreadnought',
            'Tech.MissionPrerequisites.DreadnoughtAI',
            'Tech.MissionPrerequisites.DreadnoughtMiniTorpedoes',
            'Tech.MissionPrerequisites.DreadnoughtWeaponry',
            'Tech.MissionPrerequisites.DreamModuleTechnology',
            'Tech.MissionPrerequisites.EMPTorpedo',
            'Tech.MissionPrerequisites.EnergyDissipater3',
            'Tech.MissionPrerequisites.EquinoxAntimatterInjector',
            'Tech.MissionPrerequisites.ExobiologyMedicine',
            'Tech.MissionPrerequisites.GeneticResequencer',
            'Tech.MissionPrerequisites.GotanaRetzHyperdriveModulator',
            'Tech.MissionPrerequisites.HirogenHuntingLaser',
            'Tech.MissionPrerequisites.HoloEmitter',
            'Tech.MissionPrerequisites.HolographicShipProjector',
            'Tech.MissionPrerequisites.JohnKellyMemorialHistoryofHumankind',
            'Tech.MissionPrerequisites.JohnKellyMemorialScientificMilestone',
            'Tech.MissionPrerequisites.LimitedTranswarpDrive',
            'Tech.MissionPrerequisites.LinkedBeaming',
            'Tech.MissionPrerequisites.MessHallLevel2',
            'Tech.MissionPrerequisites.MicroSlipstreamDrive',
            'Tech.MissionPrerequisites.MindPilotingLink',
            'Tech.MissionPrerequisites.MobileEmitter',
            'Tech.MissionPrerequisites.ModifiedTrajectorMatrix',
            'Tech.MissionPrerequisites.NeelixDelight',
            'Tech.MissionPrerequisites.NucleogenicBiobed',
            'Tech.MissionPrerequisites.OmegaPower',
            'Tech.MissionPrerequisites.OptimizedCloakingMatrix',
            'Tech.MissionPrerequisites.PowerModulePrototype',
            'Tech.MissionPrerequisites.PralorShieldTechnology',
            'Tech.MissionPrerequisites.PralorWeaponTechnology',
            'Tech.MissionPrerequisites.RadiationRecycling',
            'Tech.MissionPrerequisites.ReactiveArmor',
            'Tech.MissionPrerequisites.RegenerativeFusion',
            'Tech.MissionPrerequisites.SynapticStimulator',
            'Tech.MissionPrerequisites.TalaxianDynamite',
            'Tech.MissionPrerequisites.TelsianMiningLaser',
            'Tech.MissionPrerequisites.TheDiplomatsEar',
            'Tech.MissionPrerequisites.ThoriumInfusedCore',
            'Tech.MissionPrerequisites.TrabeNutriplexer',
            'Tech.MissionPrerequisites.TransphasicTorpedo',
            'Tech.MissionPrerequisites.UltraThinReactorPlating',
            'Tech.MissionPrerequisites.VaadwaurTargetingTechnology',
            'Tech.MissionPrerequisites.VidiianHyperThermicChargedDisruptorTechnology',
            'Tech.MissionPrerequisites.VidiianSurgicalDevice',
            'Tech.MissionPrerequisites.VidiianWeldingDevice',
            'Tech.MissionPrerequisites.VinculumAntiViralAgent',
        ],
    },

    abilities: {
        _all: [
            'Ability.CombatUnlock',
            'Ability.CombatUnlock.KesAbility',
            'Ability.Morale',
            'Ability.Morale.High',
            'Ability.Morale.Low',
            'Ability.Morale.Medium',
            'Ability.Scan.CanScan',
            'Ability.Scan.OtherSystemCanScan',
            'Ability.Shuttlebay',
            'Ability.Shuttlebay.DeltaFlyer',
            'Ability.Shuttlebay.Level2',
            'Ability.Shuttlebay.Level3',
            'Ability.TransporterRoom',
            'Ability.TransporterRoom.Level2',
            'Ability.TransporterRoom.Level3',
            'Ability.Workshop',
            'Ability.Workshop.Level2ProductionTimeReduction',
        ],
    },
};

// Legacy flat structure for backwards compatibility
export const ALL_TECHS = {
    engineering: flattenCategory('engineering'),
    science: flattenCategory('science'),
    combat: flattenCategory('combat'),
    crew: flattenCategory('crew'),
    borg: flattenCategory('borg'),
    prerequisites: TECH_TREE.missionPrerequisites._all,
    abilities: TECH_TREE.abilities._all,
};

/**
 * Flatten a category's rooms into a single array
 */
function flattenCategory(category) {
    const result = [];
    const cat = TECH_TREE[category];
    for (const [key, techs] of Object.entries(cat)) {
        if (Array.isArray(techs)) {
            result.push(...techs);
        }
    }
    return result;
}

/**
 * Category metadata for display
 */
export const TECH_CATEGORIES = {
    engineering: { title: 'Engineering', icon: 'wrench' },
    science: { title: 'Science', icon: 'flask' },
    combat: { title: 'Combat', icon: 'crosshairs' },
    crew: { title: 'Crew', icon: 'users' },
    borg: { title: 'Borg', icon: 'cube' },
    prerequisites: { title: 'Mission Prerequisites', icon: 'flag' },
    abilities: { title: 'Abilities', icon: 'star' },
};

/**
 * Room display names
 */
export const ROOM_NAMES = {
    _tiers: 'Tiers',
    _all: 'All',
    _standalone: 'Other',
    Main: 'Main Engineering',
    Hull: 'Hull',
    Offices: 'Engineering Offices',
    Engines: 'Engines',
    Shuttlebay: 'Shuttlebay',
    Workshop: 'Workshop',
    Storage: 'Storage',
    BussardCollectors: 'Bussard Collectors',
    LifeSupport: 'Life Support',
    StellarCartography: 'Stellar Cartography',
    ScienceLab: 'Science Lab',
    BioLaboratory: 'Bio Laboratory',
    Hydroponics: 'Hydroponics',
    NavigationalDeflector: 'Navigational Deflector',
    TransporterRoom: 'Transporter Room',
    BatteryCompartment: 'Battery Compartment',
    SensorArray: 'Sensor Array',
    CloakingDevice: 'Cloaking Device',
    EnergyDissipater: 'Energy Dissipater',
    TractorBeam: 'Tractor Beam',
    WasteDeAssembler: 'Waste De-Assembler',
    MetaphasicShieldRoom: 'Metaphasic Shield Room',
    Other: 'Other',
    PhaserArray: 'Phaser Array',
    TorpedoLaunchBay: 'Torpedo Launch Bay',
    ShieldGenerator: 'Shield Generator',
    DisruptorArray: 'Disruptor Array',
    IonCannons: 'Ion Cannons',
    SecurityComplex: 'Security Complex',
    CombatRewards: 'Combat Rewards',
    CombatModifiers: 'Combat Modifiers',
    MessHall: 'Mess Hall',
    Quarters: 'Quarters',
    SickBay: 'Sick Bay',
    Holodeck: 'Holodeck',
    ObservatoryLounge: 'Observatory Lounge',
    Brig: 'Brig',
    Embassy: 'Embassy',
    CombatAlly: 'Combat Ally',
    Morale: 'Morale',
    Surrender: 'Surrender',
    BorgARU: 'Borg ARU',
    BorgShieldMatrix: 'Borg Shield Matrix',
    BorgEnergyBeamWeaponry: 'Borg Energy Beam Weaponry',
    BorgMaturationChamber: 'Borg Maturation Chamber',
    BorgRegenerationAlcove: 'Borg Regeneration Alcove',
    BorgNeuroElectricFieldGenerator: 'Borg Neuro-Electric Field Generator',
    BorgTactics: 'Borg Tactics',
};

/**
 * Get display name for a tech path.
 * Converts "Tech.Engineering.Main.WarpCoreEfficiency1" to "Warp Core Efficiency 1"
 * @param {string} techPath
 * @returns {string}
 */
export function getTechDisplayName(techPath) {
    const parts = techPath.split('.');
    
    // Get the last meaningful part
    let name = parts[parts.length - 1];
    
    // Special case for tier entries like "Tech.Engineering.Tiers.0"
    if (/^\d+$/.test(name) && parts.length >= 2) {
        const parent = parts[parts.length - 2];
        if (parent === 'Tiers' || parent === 'Tier') {
            return `Tier ${name}`;
        }
        // For numbered sub-items like "EnhancedQualityReplicators.1"
        return parts[parts.length - 2].replace(/([a-z])([A-Z])/g, '$1 $2') + ' ' + name;
    }
    
    // Add spaces before capitals (CamelCase to Title Case)
    name = name.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Handle level numbers at end
    name = name.replace(/(\D)(\d)/, '$1 $2');
    
    // Fix common patterns
    name = name.replace(/Level (\d)/, 'Level $1');
    
    return name;
}

/**
 * Get the category key for a tech path.
 * @param {string} techPath
 * @returns {string|null}
 */
export function getTechCategory(techPath) {
    if (techPath.startsWith('Tech.Engineering')) return 'engineering';
    if (techPath.startsWith('Tech.Science')) return 'science';
    if (techPath.startsWith('Tech.Crew')) return 'crew';
    if (techPath.startsWith('Tech.Combat')) return 'combat';
    if (techPath.startsWith('Tech.Borg')) return 'borg';
    if (techPath.startsWith('Tech.MissionPrerequisites')) return 'prerequisites';
    if (techPath.startsWith('Ability.')) return 'abilities';
    return null;
}

/**
 * Get all tech paths as a flat array.
 * @returns {string[]}
 */
export function getAllTechPaths() {
    const all = [];
    for (const category of Object.values(ALL_TECHS)) {
        all.push(...category);
    }
    return all;
}

/**
 * Check if a tech path is in our database.
 * @param {string} techPath
 * @returns {boolean}
 */
export function isKnownTech(techPath) {
    const category = getTechCategory(techPath);
    if (!category) return false;
    return ALL_TECHS[category]?.includes(techPath) || false;
}

/**
 * Get room name for display
 * @param {string} roomKey
 * @returns {string}
 */
export function getRoomDisplayName(roomKey) {
    return ROOM_NAMES[roomKey] || roomKey.replace(/([a-z])([A-Z])/g, '$1 $2');
}
