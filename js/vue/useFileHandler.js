/**
 * Vue composable for handling save file loading and saving.
 */

import { loadSave, saveToBlobUrl, getSaveTimestamp } from '../savefile.js';
import { readResources, readHullIntegrity, setHullIntegrity, modifyResources, addResources } from '../resources.js';
import { readTechUnlocks, modifyTechUnlocks } from '../techtree.js';

const { ref, reactive } = Vue;

export function useFileHandler() {
    // State
    const currentData = ref(null);
    const filename = ref('');
    const loaded = ref(false);
    const saveTimestamp = ref('');
    const status = reactive({ message: '', type: 'info' });

    // Raw data from save
    const rawResources = ref([]);
    const rawHull = ref(null);
    const rawTechs = ref([]);

    /**
     * Show a status message.
     */
    function showStatus(message, type = 'info') {
        status.message = message;
        status.type = type;
    }

    /**
     * Load a save file from an ArrayBuffer.
     */
    async function loadFile(file) {
        filename.value = file.name;
        
        try {
            showStatus('Loading save file...', 'info');
            const buffer = await file.arrayBuffer();
            const save = loadSave(buffer);
            
            currentData.value = save.data;
            
            if (!save.hashValid) {
                showStatus('Warning: File hash mismatch. File may be corrupted.', 'warning');
            }
            
            // Read current values
            rawResources.value = readResources(save.data);
            
            try {
                const hullData = readHullIntegrity(save.data);
                rawHull.value = hullData;
            } catch (e) {
                rawHull.value = null;
                console.warn('Could not read hull integrity:', e);
            }
            
            // Read tech tree
            try {
                const techData = readTechUnlocks(save.data);
                rawTechs.value = techData.techs;
            } catch (e) {
                rawTechs.value = [];
                console.warn('Could not read tech tree:', e);
            }
            
            // Display save timestamp
            const ts = getSaveTimestamp(save.data);
            saveTimestamp.value = ts ? ts.toLocaleString() : '';
            
            loaded.value = true;
            showStatus(`Loaded ${file.name} (${save.fileSize} bytes, ${rawResources.value.length} resources, ${rawTechs.value.length} techs)`, 'success');
            
            return {
                resources: rawResources.value,
                hull: rawHull.value,
                techs: rawTechs.value
            };
            
        } catch (error) {
            showStatus(`Error loading file: ${error.message}`, 'error');
            console.error(error);
            throw error;
        }
    }

    /**
     * Save modifications and trigger download.
     * @param {Object} modifications - { resources, newItems, hull, techsToAdd, techsToRemove }
     */
    function saveFile(modifications) {
        if (!currentData.value) {
            showStatus('No save file loaded.', 'error');
            return false;
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
            return false;
        }
        
        try {
            showStatus('Applying modifications...', 'info');
            
            let modifiedData = currentData.value;
            
            // Apply resource modifications to existing resources
            if (modifications.resources && Object.keys(modifications.resources).length > 0) {
                modifiedData = modifyResources(modifiedData, modifications.resources);
            }
            
            // Add new items
            if (modifications.newItems && modifications.newItems.length > 0) {
                modifiedData = addResources(modifiedData, modifications.newItems);
            }
            
            // Apply hull modification
            if (modifications.hull !== null && rawHull.value) {
                if (Math.abs(modifications.hull - rawHull.value.value) > 0.01) {
                    setHullIntegrity(modifiedData, modifications.hull);
                }
            }
            
            // Apply tech tree modifications
            if ((modifications.techsToAdd && modifications.techsToAdd.length > 0) ||
                (modifications.techsToRemove && modifications.techsToRemove.length > 0)) {
                modifiedData = modifyTechUnlocks(
                    modifiedData, 
                    modifications.techsToAdd || [], 
                    modifications.techsToRemove || []
                );
            }
            
            // Generate download
            const url = saveToBlobUrl(modifiedData);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename.value;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Build status message
            const parts = [];
            const resCount = modifications.resources ? Object.keys(modifications.resources).length : 0;
            const newCount = modifications.newItems ? modifications.newItems.length : 0;
            const techAddCount = modifications.techsToAdd ? modifications.techsToAdd.length : 0;
            const techRemoveCount = modifications.techsToRemove ? modifications.techsToRemove.length : 0;
            const hullChanged = modifications.hull !== null && rawHull.value && 
                Math.abs(modifications.hull - rawHull.value.value) > 0.01;
            
            if (resCount > 0) parts.push(`${resCount} resource modification(s)`);
            if (newCount > 0) parts.push(`${newCount} new item(s)`);
            if (techAddCount > 0) parts.push(`${techAddCount} tech(s) added`);
            if (techRemoveCount > 0) parts.push(`${techRemoveCount} tech(s) removed`);
            if (hullChanged) parts.push('hull modified');
            
            if (parts.length > 0) {
                showStatus(`Downloaded ${filename.value} with ${parts.join(', ')}.`, 'success');
            } else {
                showStatus(`Downloaded ${filename.value} (no modifications).`, 'success');
            }
            
            return true;
            
        } catch (error) {
            showStatus(`Error saving file: ${error.message}`, 'error');
            console.error(error);
            return false;
        }
    }

    return {
        // State
        currentData,
        filename,
        loaded,
        saveTimestamp,
        status,
        rawResources,
        rawHull,
        rawTechs,
        
        // Methods
        showStatus,
        loadFile,
        saveFile
    };
}
