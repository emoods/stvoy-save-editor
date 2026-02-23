/**
 * Main Vue application for STV Save Editor.
 * Uses Vue 3 with browser build (no compilation step).
 */

import { useFileHandler } from './vue/useFileHandler.js';
import { useResources } from './vue/useResources.js';
import { useTechTree } from './vue/useTechTree.js';

const { createApp } = Vue;

const app = createApp({
    setup() {
        // Composables
        const fileHandler = useFileHandler();
        const resources = useResources();
        const techTree = useTechTree();

        /**
         * Handle file selection from input.
         */
        async function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            try {
                const data = await fileHandler.loadFile(file);
                
                // Initialize resources
                resources.initResources(data.resources);
                resources.initHull(data.hull);
                
                // Initialize tech tree
                techTree.initTechTree(data.techs);
                
            } catch (error) {
                console.error('Failed to load file:', error);
            }
        }

        /**
         * Handle download button click.
         */
        function handleDownload() {
            // Collect all modifications
            const resourceMods = resources.getModifications();
            const techMods = techTree.getModifications();
            
            fileHandler.saveFile({
                resources: resourceMods.resources,
                newItems: resourceMods.newItems,
                hull: resources.hull.value ? resources.hull.value.value : null,
                techsToAdd: techMods.techsToAdd,
                techsToRemove: techMods.techsToRemove
            });
        }

        return {
            // File handler state
            filename: fileHandler.filename,
            loaded: fileHandler.loaded,
            saveTimestamp: fileHandler.saveTimestamp,
            status: fileHandler.status,
            
            // Resources state
            hull: resources.hull,
            baseResources: resources.baseResources,
            itemCategories: resources.itemCategories,
            stackableItemsInSave: resources.stackableItemsInSave,
            
            // Tech tree state
            techCategories: techTree.techCategories,
            unknownTechs: techTree.unknownTechs,
            
            // Methods
            handleFileSelect,
            handleDownload,
            formatResourceName: resources.formatResourceName,
            getDisplayName: resources.getDisplayName,
            addItem: resources.addItem,
            onTechChange: techTree.onTechChange
        };
    }
});

app.mount('#app');
