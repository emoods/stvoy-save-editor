/**
 * Main editor logic for STV Save Editor.
 * Handles UI interactions and coordinates save file operations.
 */

import { loadSave, saveToBlobUrl, getSaveTimestamp } from './savefile.js';
import { readResources, readHullIntegrity, setHullIntegrity, modifyResources, addResources } from './resources.js';
import { BASE_RESOURCES, STACKABLE_ITEMS, ALL_ITEMS, ITEM_METADATA, isStackableItem, isStackableName, getDisplayName, getDescription, getFullItemName } from './itemdb.js';
import { readTechUnlocks, modifyTechUnlocks } from './techtree.js';
import { TECH_TREE, ALL_TECHS, TECH_CATEGORIES, getTechDisplayName, getTechCategory, isKnownTech, getRoomDisplayName } from './techdb.js';

// State
let currentData = null;
let currentFilename = null;
let originalResources = null;
let originalHull = null;
let originalTechs = null;  // Array of tech path strings
let addedItems = {};  // Track newly added items: { fullName: quantity }
let addedTechs = new Set();   // Track newly added techs
let removedTechs = new Set(); // Track techs to remove

/**
 * Initialize the editor when DOM is ready.
 */
export function init() {
    const fileInput = document.getElementById('file-input');
    const downloadBtn = document.getElementById('download-btn');
    
    fileInput.addEventListener('change', handleFileSelect);
    downloadBtn.addEventListener('click', handleDownload);
    
    // Initially disable download
    downloadBtn.disabled = true;
}

/**
 * Handle file selection.
 */
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    currentFilename = file.name;
    addedItems = {};  // Reset added items on new file load
    addedTechs = new Set();   // Reset added techs
    removedTechs = new Set(); // Reset removed techs
    
    try {
        showStatus('Loading save file...', 'info');
        const buffer = await file.arrayBuffer();
        const save = loadSave(buffer);
        
        currentData = save.data;
        
        if (!save.hashValid) {
            showStatus('Warning: File hash mismatch. File may be corrupted.', 'warning');
        }
        
        // Read current values
        originalResources = readResources(currentData);
        try {
            originalHull = readHullIntegrity(currentData);
        } catch (e) {
            originalHull = null;
            console.warn('Could not read hull integrity:', e);
        }
        
        // Read tech tree
        try {
            const techData = readTechUnlocks(currentData);
            originalTechs = techData.techs;
        } catch (e) {
            originalTechs = [];
            console.warn('Could not read tech tree:', e);
        }
        
        // Populate UI
        populateResourceFields(originalResources);
        populateHullField(originalHull);
        populateTechTree(originalTechs);
        
        // Enable download
        document.getElementById('download-btn').disabled = false;
        document.getElementById('filename-display').textContent = currentFilename;
        
        // Display save timestamp
        const timestamp = getSaveTimestamp(currentData);
        const timestampEl = document.getElementById('save-timestamp');
        if (timestamp) {
            timestampEl.textContent = `Saved: ${timestamp.toLocaleString()}`;
        } else {
            timestampEl.textContent = '';
        }
        
        showStatus(`Loaded ${currentFilename} (${save.fileSize} bytes, ${originalResources.length} resources, ${originalTechs.length} techs)`, 'success');
        
        // Show editor section
        document.getElementById('editor-section').classList.remove('hidden');
        
    } catch (error) {
        showStatus(`Error loading file: ${error.message}`, 'error');
        console.error(error);
    }
}

/**
 * Populate resource input fields from save data.
 * Shows ALL items from the game database, organized by category.
 * Items in the save file are editable; others show as "not in save".
 */
function populateResourceFields(resources) {
    const baseContainer = document.getElementById('base-resources');
    const itemContainer = document.getElementById('item-resources');
    
    baseContainer.innerHTML = '';
    itemContainer.innerHTML = '';
    
    // Create a map for quick lookup
    const resourceMap = {};
    for (const res of resources) {
        resourceMap[res.name] = res;
    }
    
    // === BASE RESOURCES ===
    for (const name of BASE_RESOURCES) {
        const res = resourceMap[name];
        if (res) {
            baseContainer.appendChild(createResourceRow(res));
        }
    }
    
    // Add any other base resources (flag=0) not in our list
    for (const res of resources) {
        if (!BASE_RESOURCES.includes(res.name) && res.flag === 0) {
            baseContainer.appendChild(createResourceRow(res));
        }
    }
    
    // === ITEM RESOURCES - Organized by Category ===
    const categories = [
        { key: 'items', title: 'Items', filter: (n) => n.startsWith('Item_') && !n.includes('Test') },
        { key: 'combatAllies', title: 'Combat Allies', filter: (n) => n.startsWith('Combat_Ally_') && !n.includes('Test') },
        { key: 'research', title: 'Research', filter: (n) => n.startsWith('Research_') && !n.includes('Test') },
        { key: 'craftables', title: 'Craft Recipes', filter: (n) => n.startsWith('Craft_') && !n.includes('Test') },
        { key: 'recipes', title: 'Blueprints', filter: (n) => n.startsWith('Recipe_') },
        { key: 'production', title: 'Production', filter: (n) => n.startsWith('Produce_') },
        { key: 'special', title: 'Special', filter: (n) => !n.startsWith('Item_') && !n.startsWith('Combat_Ally_') && !n.startsWith('Research_') && !n.startsWith('Craft_') && !n.startsWith('Recipe_') && !n.startsWith('Produce_') }
    ];
    
    // First show stackable items from the save (ones you can edit quantities on)
    const stackableSection = document.createElement('div');
    stackableSection.className = 'resource-category';
    const stackableHeader = document.createElement('h4');
    stackableHeader.textContent = 'Stackable Items (In Save)';
    stackableSection.appendChild(stackableHeader);
    
    let hasStackable = false;
    for (const res of resources) {
        if (res.name.startsWith('Items.Item.') && isStackableItem(res)) {
            stackableSection.appendChild(createResourceRow(res));
            hasStackable = true;
        }
    }
    
    if (hasStackable) {
        itemContainer.appendChild(stackableSection);
    }
    
    // Show all items from each category
    for (const category of categories) {
        const categoryItems = ALL_ITEMS[category.key] || [];
        if (categoryItems.length === 0) continue;
        
        const section = document.createElement('div');
        section.className = 'resource-category collapsed';
        
        const header = document.createElement('h4');
        header.className = 'category-header';
        header.innerHTML = `<span class="collapse-icon">+</span> ${category.title} <span class="item-count">(${categoryItems.length})</span>`;
        header.addEventListener('click', () => {
            section.classList.toggle('collapsed');
            const icon = header.querySelector('.collapse-icon');
            icon.textContent = section.classList.contains('collapsed') ? '+' : '-';
        });
        section.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'category-content';
        
        for (const shortName of categoryItems) {
            const fullName = getFullItemName(shortName);
            const res = resourceMap[fullName];
            
            if (res) {
                // Item exists in save - show editable
                content.appendChild(createResourceRow(res));
            } else {
                // Item not in save - show as info only (greyed out)
                content.appendChild(createItemInfoRow(shortName, fullName));
            }
        }
        
        section.appendChild(content);
        itemContainer.appendChild(section);
    }
    
    // Show any items from save that aren't in our database
    const unknownItems = resources.filter(res => {
        if (!res.name.startsWith('Items.Item.')) return false;
        const shortName = res.name.replace('Items.Item.', '');
        // Check if it's in any category
        for (const cat of Object.values(ALL_ITEMS)) {
            if (cat.includes(shortName)) return false;
        }
        return true;
    });
    
    if (unknownItems.length > 0) {
        const unknownSection = document.createElement('div');
        unknownSection.className = 'resource-category';
        const unknownHeader = document.createElement('h4');
        unknownHeader.textContent = `Unknown Items (${unknownItems.length})`;
        unknownSection.appendChild(unknownHeader);
        
        for (const res of unknownItems) {
            unknownSection.appendChild(createResourceRow(res));
        }
        itemContainer.appendChild(unknownSection);
    }
}

/**
 * Create a row for items not in the save - with Add button.
 */
function createItemInfoRow(shortName, fullName) {
    const row = document.createElement('div');
    row.className = 'resource-row item-not-in-save';
    row.id = `row-${fullName}`;
    
    const label = document.createElement('label');
    const displayName = getDisplayName(fullName);
    label.textContent = displayName;
    
    // Add tooltip with description
    const description = getDescription(fullName);
    if (description) {
        label.title = description;
        row.title = description;
    }
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-btn';
    addBtn.textContent = '+ Add';
    addBtn.addEventListener('click', () => {
        addItemToSave(shortName, fullName, row);
    });
    
    row.appendChild(label);
    row.appendChild(addBtn);
    
    return row;
}

/**
 * Add an item to the save (converts row from "not in save" to editable).
 */
function addItemToSave(shortName, fullName, row) {
    const isStackable = isStackableName(shortName);
    const defaultQty = isStackable ? 1 : 1;  // Both start at 1, but stackable can be changed
    
    // Track the added item
    addedItems[fullName] = defaultQty;
    
    // Replace the row content
    row.className = 'resource-row item-added';
    row.innerHTML = '';
    
    const label = document.createElement('label');
    const displayName = getDisplayName(fullName);
    label.textContent = displayName;
    label.setAttribute('for', `res-${fullName}`);
    
    const description = getDescription(fullName);
    if (description) {
        label.title = description;
        row.title = description;
    }
    
    if (isStackable) {
        // Stackable: show number input
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `res-${fullName}`;
        input.dataset.resourceName = fullName;
        input.dataset.originalValue = '0';  // Was not in save
        input.dataset.isAdded = 'true';
        input.value = defaultQty;
        input.min = '0';
        input.className = 'resource-input modified';
        
        input.addEventListener('input', () => {
            const val = parseInt(input.value) || 0;
            if (val === 0) {
                // Remove from added items if set to 0
                delete addedItems[fullName];
                input.classList.remove('modified');
            } else {
                addedItems[fullName] = val;
                input.classList.add('modified');
            }
        });
        
        row.appendChild(label);
        row.appendChild(input);
    } else {
        // Boolean: show checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `res-${fullName}`;
        checkbox.dataset.resourceName = fullName;
        checkbox.dataset.originalValue = '0';
        checkbox.dataset.isAdded = 'true';
        checkbox.checked = true;
        checkbox.className = 'resource-checkbox modified';
        
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                addedItems[fullName] = 1;
                checkbox.classList.add('modified');
            } else {
                delete addedItems[fullName];
                checkbox.classList.remove('modified');
            }
        });
        
        const badge = document.createElement('span');
        badge.className = 'badge badge-added';
        badge.textContent = 'Added';
        
        row.appendChild(label);
        row.appendChild(checkbox);
        row.appendChild(badge);
    }
}

/**
 * Create a row for a resource input.
 * Uses number input for stackable items, checkbox for boolean unlocks.
 */
function createResourceRow(resource) {
    const row = document.createElement('div');
    row.className = 'resource-row';
    row.id = `row-${resource.name}`;
    
    const label = document.createElement('label');
    const displayName = formatResourceName(resource.name);
    label.textContent = displayName;
    label.setAttribute('for', `res-${resource.name}`);
    
    // Add tooltip with description
    const description = getDescription(resource.name);
    if (description) {
        label.title = description;
        row.title = description;
    }
    
    // Determine if this is a stackable item or a boolean unlock
    const isStackable = isStackableItem(resource);
    const isBaseResource = BASE_RESOURCES.includes(resource.name);
    
    if (isStackable || isBaseResource) {
        // Stackable or base resource: use number input
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `res-${resource.name}`;
        input.dataset.resourceName = resource.name;
        input.dataset.originalValue = resource.quantity;
        input.value = resource.quantity;
        input.className = 'resource-input';
        
        // Highlight changed values
        input.addEventListener('input', () => {
            if (parseInt(input.value) !== parseInt(input.dataset.originalValue)) {
                input.classList.add('modified');
            } else {
                input.classList.remove('modified');
            }
        });
        
        row.appendChild(label);
        row.appendChild(input);
    } else {
        // Boolean unlock: use checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `res-${resource.name}`;
        checkbox.dataset.resourceName = resource.name;
        checkbox.dataset.originalValue = resource.quantity;
        checkbox.checked = resource.quantity > 0;
        checkbox.className = 'resource-checkbox';
        
        checkbox.addEventListener('change', () => {
            const newVal = checkbox.checked ? 1 : 0;
            if (newVal !== parseInt(checkbox.dataset.originalValue)) {
                checkbox.classList.add('modified');
            } else {
                checkbox.classList.remove('modified');
            }
        });
        
        const badge = document.createElement('span');
        badge.className = 'badge badge-unlocked';
        badge.textContent = 'Unlocked';
        
        row.appendChild(label);
        row.appendChild(checkbox);
        row.appendChild(badge);
    }
    
    return row;
}

/**
 * Format resource name for display.
 */
function formatResourceName(name) {
    // Use getDisplayName from itemdb.js for Items.Item.* names
    if (name.startsWith('Items.Item.')) {
        return getDisplayName(name);
    }
    // For base resources, add spaces before capitals (CamelCase to Title Case)
    return name.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Populate tech tree section.
 * Shows all techs organized by Category → Room/Facility with checkboxes.
 * Tiers are shown first in each category.
 * @param {string[]} unlockedTechs - Array of tech paths currently in save
 */
function populateTechTree(unlockedTechs) {
    const container = document.getElementById('tech-tree');
    container.innerHTML = '';
    
    const unlockedSet = new Set(unlockedTechs);
    
    // Categories to display with hierarchical structure (skip prerequisites and abilities which are flat)
    const hierarchicalCategories = ['engineering', 'science', 'combat', 'crew', 'borg'];
    const flatCategories = ['prerequisites', 'abilities'];
    
    // Process hierarchical categories (with rooms)
    for (const categoryKey of hierarchicalCategories) {
        const categoryInfo = TECH_CATEGORIES[categoryKey];
        const categoryData = TECH_TREE[categoryKey];
        if (!categoryData) continue;
        
        // Count total techs and unlocked in this category
        let totalTechs = 0;
        let unlockedInCategory = 0;
        for (const [roomKey, techs] of Object.entries(categoryData)) {
            if (Array.isArray(techs)) {
                totalTechs += techs.length;
                unlockedInCategory += techs.filter(t => unlockedSet.has(t)).length;
            }
        }
        
        const section = document.createElement('div');
        section.className = 'resource-category collapsed';
        
        const header = document.createElement('h4');
        header.className = 'category-header';
        header.innerHTML = `<span class="collapse-icon">+</span> ${categoryInfo.title} <span class="item-count">(${unlockedInCategory}/${totalTechs})</span>`;
        header.addEventListener('click', () => {
            section.classList.toggle('collapsed');
            const icon = header.querySelector('.collapse-icon');
            icon.textContent = section.classList.contains('collapsed') ? '+' : '-';
        });
        section.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'category-content';
        
        // Show tiers first (if present)
        if (categoryData._tiers && categoryData._tiers.length > 0) {
            const roomDiv = createRoomSection('_tiers', categoryData._tiers, unlockedSet);
            content.appendChild(roomDiv);
        }
        
        // Then show all other rooms
        for (const [roomKey, techs] of Object.entries(categoryData)) {
            if (roomKey === '_tiers' || !Array.isArray(techs)) continue;
            const roomDiv = createRoomSection(roomKey, techs, unlockedSet);
            content.appendChild(roomDiv);
        }
        
        section.appendChild(content);
        container.appendChild(section);
    }
    
    // Process flat categories (prerequisites, abilities)
    for (const categoryKey of flatCategories) {
        const categoryInfo = TECH_CATEGORIES[categoryKey];
        const techsInCategory = ALL_TECHS[categoryKey] || [];
        if (techsInCategory.length === 0) continue;
        
        const unlockedInCategory = techsInCategory.filter(t => unlockedSet.has(t)).length;
        
        const section = document.createElement('div');
        section.className = 'resource-category collapsed';
        
        const header = document.createElement('h4');
        header.className = 'category-header';
        header.innerHTML = `<span class="collapse-icon">+</span> ${categoryInfo.title} <span class="item-count">(${unlockedInCategory}/${techsInCategory.length})</span>`;
        header.addEventListener('click', () => {
            section.classList.toggle('collapsed');
            const icon = header.querySelector('.collapse-icon');
            icon.textContent = section.classList.contains('collapsed') ? '+' : '-';
        });
        section.appendChild(header);
        
        const content = document.createElement('div');
        content.className = 'category-content';
        
        for (const techPath of techsInCategory) {
            const isUnlocked = unlockedSet.has(techPath);
            content.appendChild(createTechRow(techPath, isUnlocked));
        }
        
        section.appendChild(content);
        container.appendChild(section);
    }
    
    // Show any unlocked techs not in our database
    const unknownTechs = unlockedTechs.filter(t => !isKnownTech(t));
    if (unknownTechs.length > 0) {
        const section = document.createElement('div');
        section.className = 'resource-category';
        
        const header = document.createElement('h4');
        header.textContent = `Unknown Techs (${unknownTechs.length})`;
        section.appendChild(header);
        
        for (const techPath of unknownTechs.sort()) {
            section.appendChild(createTechRow(techPath, true));
        }
        
        container.appendChild(section);
    }
}

/**
 * Create a collapsible room/facility section within a category.
 * @param {string} roomKey - Room identifier (e.g., 'Main', '_tiers')
 * @param {string[]} techs - Array of tech paths in this room
 * @param {Set<string>} unlockedSet - Set of unlocked tech paths
 * @returns {HTMLElement}
 */
function createRoomSection(roomKey, techs, unlockedSet) {
    const unlockedInRoom = techs.filter(t => unlockedSet.has(t)).length;
    
    const roomDiv = document.createElement('div');
    roomDiv.className = 'tech-room collapsed';
    
    const roomHeader = document.createElement('h5');
    roomHeader.className = 'room-header';
    roomHeader.innerHTML = `<span class="collapse-icon">+</span> ${getRoomDisplayName(roomKey)} <span class="item-count">(${unlockedInRoom}/${techs.length})</span>`;
    roomHeader.addEventListener('click', (e) => {
        e.stopPropagation();
        roomDiv.classList.toggle('collapsed');
        const icon = roomHeader.querySelector('.collapse-icon');
        icon.textContent = roomDiv.classList.contains('collapsed') ? '+' : '-';
    });
    roomDiv.appendChild(roomHeader);
    
    const roomContent = document.createElement('div');
    roomContent.className = 'room-content';
    
    for (const techPath of techs) {
        const isUnlocked = unlockedSet.has(techPath);
        roomContent.appendChild(createTechRow(techPath, isUnlocked));
    }
    
    roomDiv.appendChild(roomContent);
    return roomDiv;
}

/**
 * Create a row for a tech entry.
 * @param {string} techPath - Full tech path
 * @param {boolean} isUnlocked - Whether the tech is currently in the save
 */
function createTechRow(techPath, isUnlocked) {
    const row = document.createElement('div');
    row.className = 'resource-row' + (isUnlocked ? '' : ' tech-not-unlocked');
    row.id = `tech-${techPath.replace(/\./g, '-')}`;
    
    const label = document.createElement('label');
    label.textContent = getTechDisplayName(techPath);
    label.title = techPath;  // Show full path on hover
    label.setAttribute('for', `tech-cb-${techPath}`);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `tech-cb-${techPath}`;
    checkbox.dataset.techPath = techPath;
    checkbox.dataset.wasUnlocked = isUnlocked ? '1' : '0';
    checkbox.checked = isUnlocked;
    checkbox.className = 'tech-checkbox';
    
    checkbox.addEventListener('change', () => {
        const wasUnlocked = checkbox.dataset.wasUnlocked === '1';
        const nowChecked = checkbox.checked;
        
        if (wasUnlocked && !nowChecked) {
            // Was unlocked, now being removed
            removedTechs.add(techPath);
            addedTechs.delete(techPath);
            checkbox.classList.add('modified');
            row.classList.add('tech-removing');
        } else if (!wasUnlocked && nowChecked) {
            // Was not unlocked, now being added
            addedTechs.add(techPath);
            removedTechs.delete(techPath);
            checkbox.classList.add('modified');
            row.classList.add('tech-adding');
        } else {
            // Back to original state
            addedTechs.delete(techPath);
            removedTechs.delete(techPath);
            checkbox.classList.remove('modified');
            row.classList.remove('tech-adding', 'tech-removing');
        }
    });
    
    const badge = document.createElement('span');
    badge.className = 'badge ' + (isUnlocked ? 'badge-unlocked' : 'badge-locked');
    badge.textContent = isUnlocked ? 'Unlocked' : 'Locked';
    
    row.appendChild(label);
    row.appendChild(checkbox);
    row.appendChild(badge);
    
    return row;
}

/**
 * Populate hull integrity field.
 */
function populateHullField(hull) {
    const container = document.getElementById('hull-container');
    container.innerHTML = '';
    
    if (!hull) {
        container.innerHTML = '<p class="note">Hull integrity not found in this save.</p>';
        return;
    }
    
    const row = document.createElement('div');
    row.className = 'resource-row';
    
    const label = document.createElement('label');
    label.textContent = 'Hull Integrity';
    label.setAttribute('for', 'hull-value');
    
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'hull-value';
    input.step = '0.1';
    input.dataset.originalValue = hull.value;
    input.value = Math.round(hull.value * 10) / 10;
    input.className = 'resource-input';
    
    input.addEventListener('input', () => {
        if (parseFloat(input.value) !== parseFloat(input.dataset.originalValue)) {
            input.classList.add('modified');
        } else {
            input.classList.remove('modified');
        }
    });
    
    const note = document.createElement('span');
    note.className = 'note';
    note.textContent = '(Max hull is determined by ship modules)';
    
    row.appendChild(label);
    row.appendChild(input);
    container.appendChild(row);
    container.appendChild(note);
}

/**
 * Handle download button click.
 */
function handleDownload() {
    if (!currentData) {
        showStatus('No save file loaded.', 'error');
        return;
    }
    
    // Show backup confirmation dialog
    const confirmed = confirm(
        "WARNING: Modifying save files can corrupt your game progress!\n\n" +
        "Before proceeding, please confirm:\n\n" +
        "✓ I have created a backup of my existing save files.\n\n" +
        "Save files are located at:\n" +
        "C:\\Users\\<Name>\\AppData\\Local\\STVoyager\\Saved\\SaveGames\\<SteamID>\\\n\n" +
        "Click OK to download the modified save file.\n" +
        "Click Cancel to go back."
    );
    
    if (!confirmed) {
        showStatus('Download cancelled. Please backup your saves first!', 'warning');
        return;
    }
    
    try {
        showStatus('Applying modifications...', 'info');
        
        // Collect resource modifications from number inputs
        const modifications = {};
        const numberInputs = document.querySelectorAll('.resource-input[data-resource-name]');
        for (const input of numberInputs) {
            const name = input.dataset.resourceName;
            const isAdded = input.dataset.isAdded === 'true';
            const newVal = parseInt(input.value) || 0;
            const oldVal = parseInt(input.dataset.originalValue) || 0;
            
            if (isAdded && newVal > 0) {
                // New item being added
                modifications[name] = newVal;
            } else if (!isAdded && newVal !== oldVal) {
                // Existing item being modified
                modifications[name] = newVal;
            }
        }
        
        // Collect modifications from checkboxes
        const checkboxes = document.querySelectorAll('.resource-checkbox[data-resource-name]');
        for (const checkbox of checkboxes) {
            const name = checkbox.dataset.resourceName;
            const isAdded = checkbox.dataset.isAdded === 'true';
            const newVal = checkbox.checked ? 1 : 0;
            const oldVal = parseInt(checkbox.dataset.originalValue) || 0;
            
            if (isAdded && newVal > 0) {
                // New item being added
                modifications[name] = newVal;
            } else if (!isAdded && newVal !== oldVal) {
                // Existing item being modified
                modifications[name] = newVal;
            }
        }
        
        // Separate existing modifications from new additions
        const existingMods = {};
        const newAdditions = {};
        
        for (const [name, value] of Object.entries(modifications)) {
            // Check if this resource exists in original save
            const existsInSave = originalResources.some(r => r.name === name);
            if (existsInSave) {
                existingMods[name] = value;
            } else {
                newAdditions[name] = value;
            }
        }
        
        // Apply resource modifications to existing resources
        let modifiedData = currentData;
        if (Object.keys(existingMods).length > 0) {
            modifiedData = modifyResources(modifiedData, existingMods);
        }
        
        // Handle new additions (if any)
        if (Object.keys(newAdditions).length > 0) {
            // Convert newAdditions object to array format expected by addResources
            const additionsArray = Object.entries(newAdditions).map(([name, quantity]) => ({
                name: name,
                quantity: quantity,
                flag: 1  // All added items are items (flag=1), not base resources
            }));
            modifiedData = addResources(modifiedData, additionsArray);
        }
        
        // Apply hull modification
        const hullInput = document.getElementById('hull-value');
        if (hullInput && originalHull) {
            const newHull = parseFloat(hullInput.value);
            const oldHull = parseFloat(hullInput.dataset.originalValue);
            if (Math.abs(newHull - oldHull) > 0.01) {
                setHullIntegrity(modifiedData, newHull);
            }
        }
        
        // Apply tech tree modifications
        const techsToAdd = Array.from(addedTechs);
        const techsToRemove = Array.from(removedTechs);
        if (techsToAdd.length > 0 || techsToRemove.length > 0) {
            modifiedData = modifyTechUnlocks(modifiedData, techsToAdd, techsToRemove);
        }
        
        // Generate download
        const url = saveToBlobUrl(modifiedData);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        const modCount = Object.keys(existingMods).length + (hullInput && Math.abs(parseFloat(hullInput.value) - parseFloat(hullInput.dataset.originalValue)) > 0.01 ? 1 : 0);
        const addCount = Object.keys(newAdditions).length;
        const techAddCount = techsToAdd.length;
        const techRemoveCount = techsToRemove.length;
        
        // Build status message
        const parts = [];
        if (modCount > 0) parts.push(`${modCount} resource modification(s)`);
        if (addCount > 0) parts.push(`${addCount} new item(s)`);
        if (techAddCount > 0) parts.push(`${techAddCount} tech(s) added`);
        if (techRemoveCount > 0) parts.push(`${techRemoveCount} tech(s) removed`);
        
        if (parts.length > 0) {
            showStatus(`Downloaded ${a.download} with ${parts.join(', ')}.`, 'success');
        } else {
            showStatus(`Downloaded ${a.download} (no modifications).`, 'success');
        }
        
    } catch (error) {
        showStatus(`Error saving file: ${error.message}`, 'error');
        console.error(error);
    }
}

/**
 * Show a status message.
 */
function showStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status status-${type}`;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
