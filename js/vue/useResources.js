/**
 * Vue composable for managing resources and items.
 */

import { BASE_RESOURCES, ALL_ITEMS, isStackableItem, isStackableName, getDisplayName, getDescription, getFullItemName } from '../itemdb.js';

const { ref, reactive, computed } = Vue;

export function useResources() {
    // Hull state
    const hull = ref(null);
    
    // Base resources (reactive array)
    const baseResources = ref([]);
    
    // Item categories with their items
    const itemCategories = ref([]);
    
    // Stackable items that are in the save
    const stackableItemsInSave = ref([]);

    /**
     * Initialize resources from raw save data.
     * @param {Array} rawResources - Resources read from save file
     */
    function initResources(rawResources) {
        // Create a map for quick lookup
        const resourceMap = {};
        for (const res of rawResources) {
            resourceMap[res.name] = res;
        }
        
        // === BASE RESOURCES ===
        baseResources.value = [];
        for (const name of BASE_RESOURCES) {
            const res = resourceMap[name];
            if (res) {
                baseResources.value.push({
                    name: res.name,
                    quantity: res.quantity,
                    original: res.quantity,
                    flag: res.flag
                });
            }
        }
        
        // Add any other base resources (flag=0) not in our list
        for (const res of rawResources) {
            if (!BASE_RESOURCES.includes(res.name) && res.flag === 0) {
                baseResources.value.push({
                    name: res.name,
                    quantity: res.quantity,
                    original: res.quantity,
                    flag: res.flag
                });
            }
        }
        
        // === STACKABLE ITEMS IN SAVE ===
        stackableItemsInSave.value = [];
        for (const res of rawResources) {
            if (res.name.startsWith('Items.Item.') && isStackableItem(res)) {
                stackableItemsInSave.value.push({
                    name: res.name,
                    quantity: res.quantity,
                    original: res.quantity,
                    flag: res.flag,
                    description: getDescription(res.name)
                });
            }
        }
        
        // === ITEM CATEGORIES ===
        const categories = [
            { key: 'items', title: 'Items', filter: (n) => n.startsWith('Item_') && !n.includes('Test') },
            { key: 'combatAllies', title: 'Combat Allies', filter: (n) => n.startsWith('Combat_Ally_') && !n.includes('Test') },
            { key: 'research', title: 'Research', filter: (n) => n.startsWith('Research_') && !n.includes('Test') },
            { key: 'craftables', title: 'Craft Recipes', filter: (n) => n.startsWith('Craft_') && !n.includes('Test') },
            { key: 'recipes', title: 'Blueprints', filter: (n) => n.startsWith('Recipe_') },
            { key: 'production', title: 'Production', filter: (n) => n.startsWith('Produce_') },
            { key: 'special', title: 'Special', filter: (n) => !n.startsWith('Item_') && !n.startsWith('Combat_Ally_') && !n.startsWith('Research_') && !n.startsWith('Craft_') && !n.startsWith('Recipe_') && !n.startsWith('Produce_') }
        ];
        
        itemCategories.value = [];
        
        for (const category of categories) {
            const categoryItems = ALL_ITEMS[category.key] || [];
            if (categoryItems.length === 0) continue;
            
            const items = [];
            for (const shortName of categoryItems) {
                const fullName = getFullItemName(shortName);
                const res = resourceMap[fullName];
                const stackable = isStackableName(shortName);
                
                if (res) {
                    // Item exists in save
                    items.push({
                        shortName,
                        fullName,
                        displayName: getDisplayName(fullName),
                        description: getDescription(fullName),
                        inSave: true,
                        added: false,
                        stackable,
                        quantity: res.quantity,
                        original: res.quantity,
                        checked: res.quantity > 0,
                        originalChecked: res.quantity > 0,
                        flag: res.flag
                    });
                } else {
                    // Item not in save
                    items.push({
                        shortName,
                        fullName,
                        displayName: getDisplayName(fullName),
                        description: getDescription(fullName),
                        inSave: false,
                        added: false,
                        stackable,
                        quantity: 0,
                        original: 0,
                        checked: false,
                        originalChecked: false,
                        flag: 1
                    });
                }
            }
            
            itemCategories.value.push({
                key: category.key,
                title: category.title,
                collapsed: true,
                items
            });
        }
    }

    /**
     * Initialize hull from raw save data.
     * @param {Object|null} rawHull - Hull data from save file
     */
    function initHull(rawHull) {
        if (rawHull) {
            hull.value = {
                value: Math.round(rawHull.value * 10) / 10,
                original: rawHull.value,
                bitPosition: rawHull.bitPosition
            };
        } else {
            hull.value = null;
        }
    }

    /**
     * Add an item to the save.
     * @param {Object} item - Item object from itemCategories
     */
    function addItem(item) {
        item.added = true;
        item.quantity = 1;
        item.checked = true;
    }

    /**
     * Get all modifications to be saved.
     * Returns { resources, newItems }
     */
    function getModifications() {
        const resources = {};
        const newItems = [];
        
        // Base resources
        for (const res of baseResources.value) {
            if (res.quantity !== res.original) {
                resources[res.name] = res.quantity;
            }
        }
        
        // Stackable items in save
        for (const res of stackableItemsInSave.value) {
            if (res.quantity !== res.original) {
                resources[res.name] = res.quantity;
            }
        }
        
        // Item categories
        for (const cat of itemCategories.value) {
            for (const item of cat.items) {
                if (item.added && (item.stackable ? item.quantity > 0 : item.checked)) {
                    // New item being added
                    newItems.push({
                        name: item.fullName,
                        quantity: item.stackable ? item.quantity : (item.checked ? 1 : 0),
                        flag: 1
                    });
                } else if (item.inSave) {
                    // Existing item being modified
                    const newVal = item.stackable ? item.quantity : (item.checked ? 1 : 0);
                    const oldVal = item.original;
                    if (newVal !== oldVal) {
                        resources[item.fullName] = newVal;
                    }
                }
            }
        }
        
        return { resources, newItems };
    }

    /**
     * Format resource name for display.
     */
    function formatResourceName(name) {
        if (name.startsWith('Items.Item.')) {
            return getDisplayName(name);
        }
        return name.replace(/([A-Z])/g, ' $1').trim();
    }

    return {
        // State
        hull,
        baseResources,
        itemCategories,
        stackableItemsInSave,
        
        // Methods
        initResources,
        initHull,
        addItem,
        getModifications,
        formatResourceName,
        getDisplayName
    };
}
