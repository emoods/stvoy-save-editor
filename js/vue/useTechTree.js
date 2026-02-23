/**
 * Vue composable for managing the tech tree.
 */

import { TECH_TREE, ALL_TECHS, TECH_CATEGORIES, getTechDisplayName, isKnownTech, getRoomDisplayName } from '../techdb.js';

const { ref, reactive, computed } = Vue;

export function useTechTree() {
    // Tech categories with hierarchical structure
    const techCategories = ref([]);
    
    // Unknown techs (in save but not in our database)
    const unknownTechs = ref([]);
    
    // Track added/removed techs
    const techsToAdd = ref(new Set());
    const techsToRemove = ref(new Set());

    /**
     * Initialize tech tree from raw save data.
     * @param {string[]} rawTechs - Array of tech paths from save file
     */
    function initTechTree(rawTechs) {
        const unlockedSet = new Set(rawTechs);
        techsToAdd.value = new Set();
        techsToRemove.value = new Set();
        
        // Categories with hierarchical structure
        const hierarchicalCategories = ['engineering', 'science', 'combat', 'crew', 'borg'];
        const flatCategories = ['prerequisites', 'abilities'];
        
        techCategories.value = [];
        
        // Process hierarchical categories
        for (const categoryKey of hierarchicalCategories) {
            const categoryInfo = TECH_CATEGORIES[categoryKey];
            const categoryData = TECH_TREE[categoryKey];
            if (!categoryData) continue;
            
            const rooms = [];
            let totalCount = 0;
            let unlockedCount = 0;
            
            // Process rooms - tiers first
            const roomKeys = Object.keys(categoryData);
            const sortedRoomKeys = roomKeys.sort((a, b) => {
                if (a === '_tiers') return -1;
                if (b === '_tiers') return 1;
                return 0;
            });
            
            for (const roomKey of sortedRoomKeys) {
                const techs = categoryData[roomKey];
                if (!Array.isArray(techs)) continue;
                
                const roomTechs = techs.map(techPath => {
                    const unlocked = unlockedSet.has(techPath);
                    totalCount++;
                    if (unlocked) unlockedCount++;
                    
                    return {
                        path: techPath,
                        displayName: getTechDisplayName(techPath),
                        unlocked,
                        checked: unlocked,
                        originalChecked: unlocked,
                        adding: false,
                        removing: false
                    };
                });
                
                rooms.push({
                    key: roomKey,
                    displayName: getRoomDisplayName(roomKey),
                    collapsed: true,
                    techs: roomTechs,
                    unlockedCount: roomTechs.filter(t => t.unlocked).length
                });
            }
            
            techCategories.value.push({
                key: categoryKey,
                title: categoryInfo.title,
                collapsed: true,
                rooms,
                totalCount,
                unlockedCount
            });
        }
        
        // Process flat categories
        for (const categoryKey of flatCategories) {
            const categoryInfo = TECH_CATEGORIES[categoryKey];
            const techsInCategory = ALL_TECHS[categoryKey] || [];
            if (techsInCategory.length === 0) continue;
            
            const flatTechs = techsInCategory.map(techPath => {
                const unlocked = unlockedSet.has(techPath);
                return {
                    path: techPath,
                    displayName: getTechDisplayName(techPath),
                    unlocked,
                    checked: unlocked,
                    originalChecked: unlocked,
                    adding: false,
                    removing: false
                };
            });
            
            techCategories.value.push({
                key: categoryKey,
                title: categoryInfo.title,
                collapsed: true,
                rooms: [],
                flatTechs,
                totalCount: flatTechs.length,
                unlockedCount: flatTechs.filter(t => t.unlocked).length
            });
        }
        
        // Unknown techs
        unknownTechs.value = rawTechs
            .filter(t => !isKnownTech(t))
            .sort()
            .map(techPath => ({
                path: techPath,
                displayName: getTechDisplayName(techPath),
                unlocked: true,
                checked: true,
                originalChecked: true,
                adding: false,
                removing: false
            }));
    }

    /**
     * Handle tech checkbox change.
     * @param {Object} tech - Tech object
     */
    function onTechChange(tech) {
        const wasUnlocked = tech.originalChecked;
        const nowChecked = tech.checked;
        
        if (wasUnlocked && !nowChecked) {
            // Was unlocked, now being removed
            techsToRemove.value.add(tech.path);
            techsToAdd.value.delete(tech.path);
            tech.adding = false;
            tech.removing = true;
        } else if (!wasUnlocked && nowChecked) {
            // Was not unlocked, now being added
            techsToAdd.value.add(tech.path);
            techsToRemove.value.delete(tech.path);
            tech.adding = true;
            tech.removing = false;
        } else {
            // Back to original state
            techsToAdd.value.delete(tech.path);
            techsToRemove.value.delete(tech.path);
            tech.adding = false;
            tech.removing = false;
        }
        
        // Update category counts
        updateCategoryCounts();
    }

    /**
     * Update unlocked counts for all categories.
     */
    function updateCategoryCounts() {
        for (const cat of techCategories.value) {
            let unlockedCount = 0;
            
            // Count in rooms
            for (const room of cat.rooms) {
                room.unlockedCount = room.techs.filter(t => t.checked).length;
                unlockedCount += room.unlockedCount;
            }
            
            // Count flat techs
            if (cat.flatTechs) {
                unlockedCount += cat.flatTechs.filter(t => t.checked).length;
            }
            
            cat.unlockedCount = unlockedCount;
        }
    }

    /**
     * Get tech modifications to be saved.
     * Returns { techsToAdd, techsToRemove }
     */
    function getModifications() {
        return {
            techsToAdd: Array.from(techsToAdd.value),
            techsToRemove: Array.from(techsToRemove.value)
        };
    }

    return {
        // State
        techCategories,
        unknownTechs,
        
        // Methods
        initTechTree,
        onTechChange,
        getModifications
    };
}
