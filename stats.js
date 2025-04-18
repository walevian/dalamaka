// Initialize Telegram Web App compatibility (can run without Telegram too)
let tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
    tg.expand();
}

// DOM Elements
const levelValue = document.getElementById("level-value");
const xpValue = document.getElementById("xp-value");
const xpNextLevel = document.getElementById("xp-next-level");
const xpFill = document.getElementById("xp-fill");
const livesContainer = document.getElementById("lives-container");
const intelligenceValue = document.getElementById("intelligence-value");
const sportsValue = document.getElementById("sports-value");
const languagesValue = document.getElementById("languages-value");
const energyValue = document.getElementById("energy-value");
const creativityValue = document.getElementById("creativity-value");
const healthValue = document.getElementById("health-value");
const customizeButton = document.getElementById("customize-button");
const petButton = document.getElementById("pet-button");
const backToHomeButton = document.getElementById("back-to-home");
const customizationModal = document.getElementById("customization-modal");
const inventoryContainer = document.getElementById("inventory-container");
const inventoryModal = document.getElementById("inventory-modal");
const itemDetails = document.getElementById("item-details");
const useItemButton = document.getElementById("use-item");
const discardItemButton = document.getElementById("discard-item");
const petShopModal = document.getElementById("pet-shop-modal");
const closeModals = document.querySelectorAll(".modal .close");
const characterContainer = document.getElementById("character-base");
const petDisplay = document.getElementById("pet-display");

// Currently selected inventory item
let selectedItem = null;

// Equipment slots
const equipmentSlots = document.querySelectorAll(".equipment-slot");

// User data from localStorage
let userData;

// Equipment and item types
const equipmentTypes = {
    headgear: ['helmet', 'crown', 'hat', 'magic_hat', 'laser_visor'],
    outfit: ['casual', 'formal', 'warrior', 'mage', 'tech_suit'],
    weapon: ['sword', 'staff', 'bow', 'laser_gun', 'magic_wand'],
    accessory: ['necklace', 'glasses', 'shield', 'wings', 'jetpack']
};

// Item descriptions and effects
const itemDescriptions = {
    // Headgear
    helmet: {
        description: "A sturdy metal helmet that provides protection.",
        type: "headgear",
        effects: { defense: 3 },
        rarity: "common"
    },
    crown: {
        description: "A royal crown that commands respect.",
        type: "headgear",
        effects: { charisma: 5 },
        rarity: "rare"
    },
    hat: {
        description: "A stylish hat that looks good with any outfit.",
        type: "headgear",
        effects: { creativity: 2 },
        rarity: "common"
    },
    magic_hat: {
        description: "A magical hat that enhances intelligence.",
        type: "headgear",
        effects: { intelligence: 5 },
        rarity: "rare"
    },
    laser_visor: {
        description: "A high-tech visor with targeting capabilities.",
        type: "headgear",
        effects: { accuracy: 4 },
        rarity: "epic"
    },
    
    // Outfits
    casual: {
        description: "Comfortable everyday clothes.",
        type: "outfit",
        effects: { energy: 1 },
        rarity: "common"
    },
    formal: {
        description: "Elegant formal attire for special occasions.",
        type: "outfit",
        effects: { charisma: 3 },
        rarity: "uncommon"
    },
    warrior: {
        description: "Battle armor that provides extra protection.",
        type: "outfit",
        effects: { defense: 4, attack: 2 },
        rarity: "rare"
    },
    mage: {
        description: "Mystical robes that enhance magical abilities.",
        type: "outfit",
        effects: { intelligence: 3, energy: 2 },
        rarity: "rare"
    },
    tech_suit: {
        description: "Advanced technological suit with various enhancements.",
        type: "outfit",
        effects: { defense: 3, energy: 3, speed: 3 },
        rarity: "epic"
    },
    
    // Weapons
    sword: {
        description: "A sharp sword for close combat.",
        type: "weapon",
        effects: { attack: 5 },
        rarity: "common"
    },
    staff: {
        description: "A magical staff that channels arcane energy.",
        type: "weapon",
        effects: { intelligence: 3, attack: 3 },
        rarity: "uncommon"
    },
    bow: {
        description: "A bow for ranged attacks.",
        type: "weapon",
        effects: { attack: 4, accuracy: 3 },
        rarity: "uncommon"
    },
    laser_gun: {
        description: "A high-tech weapon that fires energy beams.",
        type: "weapon",
        effects: { attack: 6, accuracy: 5 },
        rarity: "epic"
    },
    magic_wand: {
        description: "A wand that casts powerful spells.",
        type: "weapon",
        effects: { intelligence: 5, creativity: 3 },
        rarity: "rare"
    },
    
    // Accessories
    necklace: {
        description: "A beautiful necklace that brings good luck.",
        type: "accessory",
        effects: { luck: 3 },
        rarity: "common"
    },
    glasses: {
        description: "Smart glasses that enhance perception.",
        type: "accessory",
        effects: { intelligence: 2, accuracy: 2 },
        rarity: "uncommon"
    },
    shield: {
        description: "A sturdy shield for defense.",
        type: "accessory",
        effects: { defense: 5 },
        rarity: "rare"
    },
    wings: {
        description: "Magical wings that allow limited flight.",
        type: "accessory",
        effects: { speed: 5, energy: 2 },
        rarity: "epic"
    },
    jetpack: {
        description: "A technological jetpack for flying.",
        type: "accessory",
        effects: { speed: 6, energy: -2 },
        rarity: "epic"
    },
    
    // Consumables
    health_potion: {
        description: "Restores 1 life when used.",
        type: "consumable",
        effects: { life: 1 },
        rarity: "common"
    },
    intelligence_book: {
        description: "Increases intelligence by 1 when read.",
        type: "consumable",
        effects: { intelligence: 1 },
        rarity: "uncommon"
    },
    sports_equipment: {
        description: "Increases sports skill by 1 when used.",
        type: "consumable",
        effects: { sports: 1 },
        rarity: "uncommon"
    },
    language_guide: {
        description: "Increases language skill by 1 when studied.",
        type: "consumable",
        effects: { languages: 1 },
        rarity: "uncommon"
    },
    energy_drink: {
        description: "Increases energy by 1 when consumed.",
        type: "consumable",
        effects: { energy: 1 },
        rarity: "common"
    },
    creativity_kit: {
        description: "Increases creativity by 1 when used.",
        type: "consumable",
        effects: { creativity: 1 },
        rarity: "uncommon"
    },
    
    // Battle items
    monster_fang: {
        description: "A sharp fang from a defeated monster. Can be used to create weapons.",
        type: "crafting",
        rarity: "common"
    },
    monster_scale: {
        description: "A tough scale from a monster. Good for crafting armor.",
        type: "crafting",
        rarity: "common"
    },
    monster_essence: {
        description: "Magical essence from a monster. Used in enchantments.",
        type: "crafting",
        rarity: "uncommon"
    },
    gold_coins: {
        description: "Currency that can be used to buy items and upgrades.",
        type: "currency",
        rarity: "common"
    },
    weapon_part: {
        description: "A component for crafting weapons.",
        type: "crafting",
        rarity: "uncommon"
    },
    xp_boost: {
        description: "Instantly grants 50 XP points.",
        type: "consumable",
        effect: "Grants 50 XP",
        rarity: "uncommon"
    },
    stat_boost: {
        description: "Permanently increases a random stat by 1 point.",
        type: "consumable",
        effect: "Increases a random stat by 1",
        rarity: "rare"
    },
    wizard_hat: {
        description: "A pointy hat that increases intelligence.",
        type: "headgear",
        effect: "+1 Intelligence while equipped",
        rarity: "uncommon"
    },
    sports_cap: {
        description: "A sporty cap that enhances athletic performance.",
        type: "headgear",
        effect: "+1 Sports while equipped",
        rarity: "uncommon"
    },
    sports_uniform: {
        description: "Athletic wear that improves sports performance.",
        type: "outfit",
        effect: "+1 Sports while equipped",
        rarity: "uncommon"
    },
    study_glasses: {
        description: "Reading glasses that help with focus.",
        type: "accessory",
        effect: "+1 Intelligence while equipped",
        rarity: "uncommon"
    }
};

// Character customization options
const characterOptions = {
    skin: ['light', 'medium', 'dark', 'fantasy'],
    outfit: ['casual', 'formal', 'warrior', 'mage'],
    headgear: ['none', 'hat', 'crown', 'helmet'],
    weapon: ['none', 'sword', 'staff', 'bow']
};

// Pet customization options
const petOptions = {
    type: ['cat', 'dog', 'dragon', 'bird'],
    color: ['default', 'black', 'white', 'gold', 'blue'],
    accessory: ['none', 'bow', 'hat', 'glasses']
};

// Load user data
function loadUserData() {
    // Get saved data
    const savedData = localStorage.getItem('userData');
    
    // If we have saved data, parse it
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        // Merge saved data with userData
        userData = {
            ...userData,
            ...parsedData
        };
    }
    
    // Ensure all required properties exist
    if (!userData.stats) {
        userData.stats = {
            intelligence: 5,
            sports: 5,
            languages: 5,
            energy: 5,
            creativity: 5,
            health: 5
        };
    }
    
    if (!userData.level) userData.level = 1;
    if (!userData.xp) userData.xp = 0;
    if (!userData.lives) userData.lives = 5;
    if (!userData.maxLives) userData.maxLives = 5;
    
    if (!userData.equipment) {
        userData.equipment = {
            skin: 'default',
            outfit: 'casual',
            headgear: 'none',
            weapon: 'none',
            accessory: 'none'
        };
    }
    
    if (!userData.pet) {
        userData.pet = {
            unlocked: false,
            type: 'cat',
            color: 'orange',
            accessory: 'none',
            abilities: {
                loyalty: 10,
                intelligence: 10,
                speed: 10,
                strength: 10
            }
        };
    }
    
    if (!userData.achievements) {
        userData.achievements = {
            memoryMaster: false,
            mathWizard: false,
            dailyStreak: false
        };
    }
    
    if (!userData.inventory) {
        userData.inventory = [];
    }
    
    // Update the display
    updateStatsDisplay();
    updateInventoryDisplay();
    updateAchievements();
    updateBuffsDisplay();
    loadEquipmentSlots();
}

// Save user data
function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Update the character stats display
function updateStatsDisplay() {
    // Level and XP
    levelValue.textContent = userData.level;
    xpValue.textContent = userData.xp;
    const xpForNextLevel = userData.level * 100;
    xpNextLevel.textContent = xpForNextLevel;
    
    // XP progress bar
    const xpPercentage = Math.min(100, (userData.xp / xpForNextLevel) * 100);
    xpFill.style.width = `${xpPercentage}%`;
    
    // Lives
    livesContainer.innerHTML = '';
    for (let i = 0; i < userData.lives; i++) {
        const lifeIcon = document.createElement("div");
        lifeIcon.className = "life-icon";
        lifeIcon.textContent = "❤️";
        livesContainer.appendChild(lifeIcon);
    }
    
    // Attributes with animated bars
    updateAttributeBar('intelligence', userData.stats.intelligence);
    updateAttributeBar('sports', userData.stats.sports);
    updateAttributeBar('languages', userData.stats.languages);
    updateAttributeBar('energy', userData.stats.energy);
    updateAttributeBar('creativity', userData.stats.creativity);
    updateAttributeBar('health', userData.stats.health);
    
    // Set attribute values
    intelligenceValue.textContent = userData.stats.intelligence;
    sportsValue.textContent = userData.stats.sports;
    languagesValue.textContent = userData.stats.languages;
    energyValue.textContent = userData.stats.energy;
    creativityValue.textContent = userData.stats.creativity;
    healthValue.textContent = userData.stats.health;
    
    // Update achievements
    updateAchievements();
    
    // Update buffs
    updateBuffsDisplay();
    
    // Update inventory
    updateInventoryDisplay();
    
    // Update equipment slots
    loadEquipmentSlots();
}

// Display the inventory items
function updateInventoryDisplay() {
    const inventoryContainer = document.getElementById('inventoryItems');
    inventoryContainer.innerHTML = '';
    
    // Check if inventory exists
    if (!userData.inventory || userData.inventory.length === 0) {
        inventoryContainer.innerHTML = '<p>Your inventory is empty.</p>';
        return;
    }
    
    // Group items by type for better organization
    const itemsByType = {};
    userData.inventory.forEach(item => {
        if (!itemsByType[item.type]) {
            itemsByType[item.type] = [];
        }
        itemsByType[item.type].push(item);
    });
    
    // Create sections for each item type
    for (const type in itemsByType) {
        const typeHeading = document.createElement('h3');
        typeHeading.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's';
        inventoryContainer.appendChild(typeHeading);
        
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'items-grid';
        
        // Add items of this type
        itemsByType[type].forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = `inventory-item ${item.rarity || 'common'}`;
            
            // Format the item name
            const formattedName = formatItemName(item.id);
            
            itemElement.innerHTML = `
                <img src="images/items/${item.id}.png" onerror="this.src='images/items/default.png'" alt="${formattedName}">
                <span>${formattedName}</span>
                <span class="item-quantity">x${item.quantity}</span>
            `;
            
            itemElement.addEventListener('click', () => showItemDetails(item));
            itemsContainer.appendChild(itemElement);
        });
        
        inventoryContainer.appendChild(itemsContainer);
    }
    
    // Update equipment display
    updateEquipmentDisplay();
}

// Show item details when clicking on item
function showItemDetails(item) {
    const itemDescription = itemDescriptions[item.id] || 'No description available.';
    const formattedName = formatItemName(item.id);
    
    const itemDetailsHTML = `
        <h3>${formattedName}</h3>
        <p>${itemDescription}</p>
        <p><strong>Type:</strong> ${item.type}</p>
        ${item.effect ? `<p><strong>Effect:</strong> ${item.effect}</p>` : ''}
        <p><strong>Rarity:</strong> ${item.rarity || 'Common'}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
    `;
    
    document.getElementById('itemDetails').innerHTML = itemDetailsHTML;
    document.getElementById('itemDetails').style.display = 'block';
    
    // Show use button only for consumables or equipment
    const useItemButton = document.getElementById('useItemButton');
    if (item.type === 'consumable' || item.type === 'equipment') {
        useItemButton.style.display = 'block';
        useItemButton.textContent = item.type === 'consumable' ? 'Use Item' : 'Equip Item';
        useItemButton.onclick = () => useItem(item);
    } else {
        useItemButton.style.display = 'none';
    }
}

// Use the selected item
function useItem(item) {
    // Handle different item types
    if (item.type === 'consumable') {
        // Process consumable effects
        if (!userData.buffs) userData.buffs = [];
        
        if (item.id === 'health_potion') {
            userData.health = Math.min(userData.maxHealth, userData.health + 50);
        } else if (item.id === 'xp_boost') {
            userData.buffs.push({
                stat: 'xp',
                amount: 10,
                duration: 3 // days
            });
        } else if (item.id === 'energy_drink') {
            userData.energy = Math.min(userData.maxEnergy, userData.energy + 30);
        }
        
        // Remove the consumed item from inventory
        removeItemFromInventory(item);
        
    } else if (item.type === 'equipment') {
        // Initialize equipment object if it doesn't exist
        if (!userData.equipment) userData.equipment = {};
        
        // Determine equipment slot based on item category
        let slot = '';
        if (item.id.includes('hat') || item.id.includes('helmet')) {
            slot = 'headgear';
        } else if (item.id.includes('shirt') || item.id.includes('armor') || item.id.includes('outfit')) {
            slot = 'outfit';
        } else if (item.id.includes('ring') || item.id.includes('pendant') || item.id.includes('charm')) {
            slot = 'accessory';
        }
        
        // Store the previously equipped item if any
        const previousItem = userData.equipment[slot];
        
        // Equip the new item
        userData.equipment[slot] = item.id;
        
        // Remove the equipped item from inventory
        removeItemFromInventory(item);
        
        // Add previously equipped item back to inventory if there was one
        if (previousItem) {
            const previousItemData = { 
                id: previousItem, 
                type: 'equipment',
                quantity: 1
            };
            
            const inventoryItem = userData.inventory.find(i => i.id === previousItem);
            if (inventoryItem) {
                inventoryItem.quantity++;
            } else {
                userData.inventory.push(previousItemData);
            }
        }
        
        // Update character appearance based on equipped items
        updateCharacterAppearance();
    }
    
    // Save changes to localStorage
    localStorage.setItem('walrise_user_data', JSON.stringify(userData));
    
    // Update displays
    updateStatsDisplay();
    updateInventoryDisplay();
    updateBuffsDisplay();
    
    // Close item details panel
    document.getElementById('itemDetails').style.display = 'none';
}

// Discard the selected item
function discardItem() {
    if (!selectedItem) return;
    
    // Confirm discard
    const confirmDiscard = confirm(`Are you sure you want to discard one ${selectedItem.name}?`);
    
    if (confirmDiscard) {
        // Remove one instance of the item
        removeItemFromInventory(selectedItem);
        
        // Save changes
        saveUserData();
        
        // Update inventory display
        updateInventoryDisplay();
        
        // Close modal
        inventoryModal.style.display = 'none';
    }
}

// Remove an item from inventory
function removeItemFromInventory(item) {
    // Find the item in the inventory
    const itemIndex = userData.inventory.findIndex(i => i.id === item.id);
    
    if (itemIndex !== -1) {
        // Reduce quantity, or remove if it's the last one
        userData.inventory[itemIndex].quantity--;
        
        if (userData.inventory[itemIndex].quantity <= 0) {
            userData.inventory.splice(itemIndex, 1);
        }
        
        // Save the updated inventory
        localStorage.setItem('walrise_user_data', JSON.stringify(userData));
    }
}

// Update attribute bars with animation
function updateAttributeBar(attribute, value) {
    const maxValue = 100; // Maximum possible value
    const percentage = (value / maxValue) * 100;
    const bar = document.querySelector(`.${attribute}-fill`);
    
    // Set initial width to 0
    bar.style.width = '0%';
    
    // Use setTimeout to create a delay for animation effect
    setTimeout(() => {
        bar.style.width = `${percentage}%`;
    }, 100);
}

// Update achievements display
function updateAchievements() {
    // Memory Master achievement
    if (userData.achievements.memoryMaster) {
        document.getElementById("achievement-memory").classList.remove("locked");
        document.getElementById("achievement-memory").classList.add("unlocked");
    }
    
    // Math Wizard achievement
    if (userData.achievements.mathWizard) {
        document.getElementById("achievement-math").classList.remove("locked");
        document.getElementById("achievement-math").classList.add("unlocked");
    }
    
    // Daily Streak achievement
    if (userData.achievements.dailyStreak) {
        document.getElementById("achievement-streak").classList.remove("locked");
        document.getElementById("achievement-streak").classList.add("unlocked");
    }
}

// Update buffs display
function updateBuffsDisplay() {
    const buffsDisplay = document.getElementById('buffs-display');
    if (!buffsDisplay) return;
    
    if (!userData.buffs || userData.buffs.length === 0) {
        buffsDisplay.innerHTML = '';
        return;
    }
    
    let buffsHTML = '<h3>Active Buffs</h3><ul>';
    
    for (const buff of userData.buffs) {
        buffsHTML += `
            <li>
                <strong>${capitalizeFirstLetter(buff.stat)}:</strong> 
                +${buff.amount} (${buff.duration} days)
            </li>
        `;
    }
    
    buffsHTML += '</ul>';
    buffsDisplay.innerHTML = buffsHTML;
}

// Update equipment slots
function loadEquipmentSlots() {
    equipmentSlots.forEach(slot => {
        const slotType = slot.getAttribute("data-slot");
        const equippedItem = userData.equipment[slotType];
        const slotIcon = slot.querySelector(".slot-icon");
        
        if (equippedItem && equippedItem !== 'none') {
            // Show equipped item
            slotIcon.className = 'slot-icon equipped';
            
            // Get the item icon
            const itemName = equippedItem.charAt(0).toUpperCase() + equippedItem.slice(1);
            
            // Display the item
            if (equippedItem === 'sword') {
                slotIcon.textContent = '🗡️';
            } else if (equippedItem === 'staff') {
                slotIcon.textContent = '🔮';
            } else if (equippedItem === 'bow') {
                slotIcon.textContent = '🏹';
            } else if (equippedItem === 'hat') {
                slotIcon.textContent = '🎩';
            } else if (equippedItem === 'crown') {
                slotIcon.textContent = '👑';
            } else if (equippedItem === 'helmet') {
                slotIcon.textContent = '⛑️';
            } else if (equippedItem === 'casual') {
                slotIcon.textContent = '👕';
            } else if (equippedItem === 'formal') {
                slotIcon.textContent = '👔';
            } else if (equippedItem === 'warrior') {
                slotIcon.textContent = '🛡️';
            } else if (equippedItem === 'mage') {
                slotIcon.textContent = '🧙';
            } else if (equippedItem === 'magic_hat') {
                slotIcon.textContent = '🧙‍♂️';
            } else if (equippedItem === 'laser_visor') {
                slotIcon.textContent = '🔍';
            } else if (equippedItem === 'tech_suit') {
                slotIcon.textContent = '🤖';
            } else if (equippedItem === 'laser_gun') {
                slotIcon.textContent = '🔫';
            } else if (equippedItem === 'magic_wand') {
                slotIcon.textContent = '✨';
            } else if (equippedItem === 'necklace') {
                slotIcon.textContent = '📿';
            } else if (equippedItem === 'glasses') {
                slotIcon.textContent = '👓';
            } else if (equippedItem === 'shield') {
                slotIcon.textContent = '🛡️';
            } else if (equippedItem === 'wings') {
                slotIcon.textContent = '👼';
            } else if (equippedItem === 'jetpack') {
                slotIcon.textContent = '🚀';
            } else {
                slotIcon.textContent = '✓';
            }
            
        } else {
            // Show empty slot
            slotIcon.className = 'slot-icon empty';
            slotIcon.textContent = '?';
        }
        
        // Add click listener to equip/unequip items
        slot.addEventListener('click', () => {
            // Future implementation: Show equipment options
            createEquipmentModal(slotType);
        });
    });
}

// Equipment modal to show available items for a slot
function createEquipmentModal(slotType) {
    const modal = document.getElementById("customization-modal");
    const modalContent = modal.querySelector(".modal-content");
    
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>${slotType.charAt(0).toUpperCase() + slotType.slice(1)} Equipment</h2>
        <div class="equipment-options">
            <!-- Options will be added here -->
        </div>
    `;
    
    const optionsContainer = modalContent.querySelector(".equipment-options");
    
    // Add "none" option
    const noneOption = document.createElement("div");
    noneOption.className = "customization-option";
    noneOption.textContent = "None";
    noneOption.addEventListener("click", () => {
        userData.equipment[slotType] = "none";
        saveUserData();
        updateCharacterAppearance();
        loadEquipmentSlots();
        modal.style.display = "none";
    });
    optionsContainer.appendChild(noneOption);
    
    // Find items in inventory that fit this slot type
    const availableItems = userData.inventory.filter(item => {
        const itemName = item.name.toLowerCase().replace(/\s+/g, '_');
        const itemInfo = itemDescriptions[itemName] || { type: item.type };
        return itemInfo.type === slotType;
    });
    
    // Group by name to avoid duplicates
    const uniqueItems = {};
    availableItems.forEach(item => {
        const itemName = item.name.toLowerCase().replace(/\s+/g, '_');
        if (!uniqueItems[itemName]) {
            uniqueItems[itemName] = {
                name: item.name,
                icon: item.icon,
                count: 0
            };
        }
        uniqueItems[itemName].count++;
    });
    
    // Add item options
    Object.entries(uniqueItems).forEach(([key, item]) => {
        const option = document.createElement("div");
        option.className = "customization-option";
        option.innerHTML = `
            <span class="option-icon">${item.icon}</span>
            <span class="option-name">${item.name}</span>
            <span class="option-count">x${item.count}</span>
        `;
        
        option.addEventListener("click", () => {
            userData.equipment[slotType] = key;
            saveUserData();
            updateCharacterAppearance();
            loadEquipmentSlots();
            modal.style.display = "none";
        });
        
        optionsContainer.appendChild(option);
    });
    
    // Add any predefined options from characterOptions if they exist
    if (characterOptions[slotType]) {
        characterOptions[slotType].forEach(option => {
            // Skip 'none' since we already added it
            if (option === 'none') return;
            
            // Skip options already in inventory
            if (uniqueItems[option]) return;
            
            const optionElement = document.createElement("div");
            optionElement.className = "customization-option locked";
            optionElement.innerHTML = `
                <span class="option-icon">🔒</span>
                <span class="option-name">${option.charAt(0).toUpperCase() + option.slice(1)}</span>
                <span class="option-locked">Locked</span>
            `;
            
            optionsContainer.appendChild(optionElement);
        });
    }
    
    // Close button functionality
    const closeButton = modalContent.querySelector(".close");
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    // Show the modal
    modal.style.display = "block";
}

// Update the character appearance
function updateCharacterAppearance() {
    // Reset character container classes
    characterContainer.className = 'character-container';
    
    // Apply customizations based on equipped items
    if (userData.equipment.skin) {
        characterContainer.classList.add(`skin-${userData.equipment.skin}`);
    }
    
    if (userData.equipment.outfit && userData.equipment.outfit !== 'none') {
        characterContainer.classList.add(`outfit-${userData.equipment.outfit}`);
    }
    
    if (userData.equipment.headgear && userData.equipment.headgear !== 'none') {
        characterContainer.classList.add(`headgear-${userData.equipment.headgear}`);
    }
    
    if (userData.equipment.weapon && userData.equipment.weapon !== 'none') {
        characterContainer.classList.add(`weapon-${userData.equipment.weapon}`);
    }
    
    if (userData.equipment.accessory && userData.equipment.accessory !== 'none') {
        characterContainer.classList.add(`accessory-${userData.equipment.accessory}`);
    }
}

// Update pet appearance
function updatePetAppearance() {
    // Only show pet if unlocked
    if (userData.pet.unlocked) {
        petDisplay.style.display = 'block';
        
        // Reset pet container classes
        const petContainer = document.getElementById('pet-base');
        petContainer.className = 'pet-container';
        
        // Apply pet customizations
        petContainer.classList.add(`pet-type-${userData.pet.type}`);
        petContainer.classList.add(`pet-color-${userData.pet.color}`);
        
        if (userData.pet.accessory !== 'none') {
            petContainer.classList.add(`pet-accessory-${userData.pet.accessory}`);
        }
    } else {
        petDisplay.style.display = 'none';
    }
}

// Character customization modal
function createCharacterCustomizationModal() {
    const modal = document.getElementById("customization-modal");
    const modalContent = modal.querySelector(".modal-content");
    
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Character Customization</h2>
        
        <div class="customization-section">
            <h3>Skin</h3>
            <div class="options-container" id="skin-options"></div>
        </div>
        
        <div class="customization-section">
            <h3>Outfit</h3>
            <div class="options-container" id="outfit-options"></div>
        </div>
        
        <div class="customization-section">
            <h3>Headgear</h3>
            <div class="options-container" id="headgear-options"></div>
        </div>
        
        <div class="customization-section">
            <h3>Weapon</h3>
            <div class="options-container" id="weapon-options"></div>
        </div>
    `;
    
    // Populate customization options
    populateCustomizationOptions("skin", characterOptions.skin);
    populateCustomizationOptions("outfit", characterOptions.outfit);
    populateCustomizationOptions("headgear", characterOptions.headgear);
    populateCustomizationOptions("weapon", characterOptions.weapon);
    
    // Close button functionality
    const closeButton = modalContent.querySelector(".close");
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    // Show the modal
    modal.style.display = "block";
}

// Pet shop modal
function createPetShopModal() {
    if (userData.pet.unlocked) {
        // If user already has a pet, show pet customization instead
        createPetCustomizationModal();
        return;
    }
    
    // Otherwise show pet shop
    petShopModal.style.display = "block";
    
    // Add event listeners to pet options
    const petOptions = document.querySelectorAll(".pet-option");
    petOptions.forEach(option => {
        option.addEventListener("click", () => {
            const petType = option.getAttribute("data-pet");
            const petPrice = parseInt(option.querySelector(".pet-price").textContent);
            
            // Check if user has enough XP
            if (userData.xp >= petPrice) {
                // Purchase pet
                userData.xp -= petPrice;
                userData.pet.unlocked = true;
                userData.pet.type = petType;
                
                // Save data
                saveUserData();
                
                // Update display
                updateStatsDisplay();
                updatePetAppearance();
                
                // Close modal and show pet customization
                petShopModal.style.display = "none";
                createPetCustomizationModal();
            } else {
                alert("Not enough XP to purchase this pet!");
            }
        });
    });
}

// Pet customization modal
function createPetCustomizationModal() {
    // Only show if pet is unlocked
    if (!userData.pet.unlocked) {
        createPetShopModal();
        return;
    }
    
    const modal = document.getElementById("customization-modal");
    const modalContent = modal.querySelector(".modal-content");
    
    modalContent.innerHTML = `
        <span class="close">&times;</span>
        <h2>Pet Customization</h2>
        
        <div class="pet-preview-large">
            <div id="pet-preview-container" class="pet-container">
                <div id="pet-preview-body" class="pet-layer"></div>
                <div id="pet-preview-head" class="pet-layer"></div>
                <div id="pet-preview-face" class="pet-layer">
                    <div id="pet-preview-mouth"></div>
                </div>
                <div id="pet-preview-accessory" class="pet-layer"></div>
            </div>
        </div>
        
        <div class="customization-section">
            <h3>Color</h3>
            <div class="options-container" id="pet-color-options"></div>
        </div>
        
        <div class="customization-section">
            <h3>Accessory</h3>
            <div class="options-container" id="pet-accessory-options"></div>
        </div>
        
        <div class="customization-section">
            <h3>Pet Abilities</h3>
            <div class="pet-abilities">
                <div class="pet-ability">
                    <span>Loyalty: ${userData.pet.abilities.loyalty}</span>
                    <div class="ability-bar">
                        <div class="ability-fill" style="width: ${userData.pet.abilities.loyalty}%"></div>
                    </div>
                </div>
                <div class="pet-ability">
                    <span>Intelligence: ${userData.pet.abilities.intelligence}</span>
                    <div class="ability-bar">
                        <div class="ability-fill" style="width: ${userData.pet.abilities.intelligence}%"></div>
                    </div>
                </div>
                <div class="pet-ability">
                    <span>Speed: ${userData.pet.abilities.speed}</span>
                    <div class="ability-bar">
                        <div class="ability-fill" style="width: ${userData.pet.abilities.speed}%"></div>
                    </div>
                </div>
                <div class="pet-ability">
                    <span>Strength: ${userData.pet.abilities.strength}</span>
                    <div class="ability-bar">
                        <div class="ability-fill" style="width: ${userData.pet.abilities.strength}%"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Populate pet customization options
    populatePetOptions("color", petOptions.color);
    populatePetOptions("accessory", petOptions.accessory);
    
    // Update preview
    updatePetPreview();
    
    // Close button functionality
    const closeButton = modalContent.querySelector(".close");
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });
    
    // Show the modal
    modal.style.display = "block";
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function() {
    // Get DOM elements
    const achievementsBtn = document.getElementById('achievements-btn');
    const characterBtn = document.getElementById('character-btn');
    const petShopBtn = document.getElementById('pet-shop-btn');
    
    // Add event listeners
    if (achievementsBtn) {
        achievementsBtn.addEventListener('click', () => {
            showAchievementsModal();
        });
    }
    
    if (characterBtn) {
        characterBtn.addEventListener('click', () => {
            createCharacterCustomizationModal();
        });
    }
    
    if (petShopBtn) {
        petShopBtn.addEventListener('click', () => {
            createPetCustomizationModal();
        });
    }
    
    // Add inventory modal event listeners
    useItemButton.addEventListener('click', useItem);
    discardItemButton.addEventListener('click', discardItem);
    closeItemButton.addEventListener('click', () => {
        inventoryModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === inventoryModal) {
            inventoryModal.style.display = 'none';
        }
    });
    
    // Load user data
    loadUserData();
    
    // Update stats display
    updateStatsDisplay();
    
    // Update inventory display
    updateInventoryDisplay();
    
    // Update character appearance
    updateCharacterAppearance();
    
    // Update pet appearance if pet is unlocked
    if (userData.pet && userData.pet.unlocked) {
        updatePetAppearance();
    }
    
    // Update achievements
    updateAchievements();
    
    // Update buffs display
    updateBuffsDisplay();
    
    // Load equipment slots
    loadEquipmentSlots();
});

// Load theme preference
function loadThemePreference() {
    const savedTheme = localStorage.getItem("preferred-theme");
    if (savedTheme) {
        document.body.className = savedTheme;
    } else {
        document.body.className = "colorful-theme";
    }
}

// Helper function to populate customization options
function populateCustomizationOptions(optionType, options) {
    const container = document.getElementById(`${optionType}-options`);
    
    options.forEach(option => {
        const optionButton = document.createElement("button");
        optionButton.className = "option-button";
        optionButton.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        
        // Mark the selected option
        if (userData.equipment[optionType] === option) {
            optionButton.classList.add("selected");
        }
        
        // Add click event
        optionButton.addEventListener("click", function() {
            // Update the selected option
            userData.equipment[optionType] = option;
            
            // Save changes
            saveUserData();
            
            // Update display
            updateCharacterAppearance();
            
            // Update selection in UI
            container.querySelectorAll(".option-button").forEach(btn => {
                btn.classList.remove("selected");
            });
            this.classList.add("selected");
        });
        
        container.appendChild(optionButton);
    });
}

// Helper function to populate pet options
function populatePetOptions(optionType, options) {
    const container = document.getElementById(`pet-${optionType}-options`);
    
    options.forEach(option => {
        const optionButton = document.createElement("button");
        optionButton.className = "option-button";
        optionButton.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        
        // Mark the selected option
        if (userData.pet[optionType] === option) {
            optionButton.classList.add("selected");
        }
        
        // Add click event
        optionButton.addEventListener("click", function() {
            // Update the selected option
            userData.pet[optionType] = option;
            
            // Save changes
            saveUserData();
            
            // Update display
            updatePetPreview();
            updatePetAppearance();
            
            // Update selection in UI
            container.querySelectorAll(".option-button").forEach(btn => {
                btn.classList.remove("selected");
            });
            this.classList.add("selected");
        });
        
        container.appendChild(optionButton);
    });
}

// Update the pet preview in customization modal
function updatePetPreview() {
    const previewContainer = document.getElementById("pet-preview-container");
    
    // Reset classes
    previewContainer.className = "pet-container";
    
    // Apply customizations
    previewContainer.classList.add(`pet-type-${userData.pet.type}`);
    previewContainer.classList.add(`pet-color-${userData.pet.color}`);
    
    if (userData.pet.accessory !== "none") {
        previewContainer.classList.add(`pet-accessory-${userData.pet.accessory}`);
    }
}

function formatItemName(itemId) {
    // Convert item ID to readable name (e.g., "health_potion" to "Health Potion")
    return itemId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateEquipmentDisplay() {
    const equipmentDisplay = document.getElementById('equipment-display');
    if (!equipmentDisplay) return;
    
    if (!userData.equipment) userData.equipment = {};
    
    let equipmentHTML = '<h3>Equipped Items</h3><ul>';
    
    for (const [slot, itemId] of Object.entries(userData.equipment)) {
        equipmentHTML += `
            <li>
                <strong>${capitalizeFirstLetter(slot)}:</strong> 
                ${formatItemName(itemId)}
            </li>
        `;
    }
    
    equipmentHTML += '</ul>';
    equipmentDisplay.innerHTML = equipmentHTML;
}

// Helper functions for item management
function formatItemName(itemId) {
    // Convert item ID to readable name (e.g., "health_potion" to "Health Potion")
    return itemId.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function applyConsumableEffect(item) {
    // Apply effect based on the item's properties
    if (item.effect) {
        if (item.effect.health) {
            userData.currentHealth = Math.min(userData.health, userData.currentHealth + item.effect.health);
        }
        if (item.effect.energy) {
            userData.currentEnergy = Math.min(userData.energy, userData.currentEnergy + item.effect.energy);
        }
        if (item.effect.buff) {
            // Apply temporary buffs
            const buffDuration = item.effect.duration || 60; // Default 60 seconds
            const buffId = `buff_${Date.now()}`;
            
            userData.buffs = userData.buffs || [];
            userData.buffs.push({
                id: buffId,
                name: item.effect.buff.name || "Unknown Buff",
                effect: item.effect.buff,
                duration: buffDuration,
                startTime: Date.now()
            });
            
            // Set timeout to remove buff after duration
            setTimeout(() => {
                userData.buffs = userData.buffs.filter(buff => buff.id !== buffId);
                saveUserData();
                updateStatsDisplay();
            }, buffDuration * 1000);
        }
    }
}

function updateEquipmentSlot(item, oldItemId = null) {
    // Update appropriate equipment slot
    const slot = item.equipSlot || "accessory";
    
    // Return old item to inventory if there was one
    if (oldItemId && oldItemId !== "none") {
        const oldItemData = ITEMS.find(i => i.id === oldItemId);
        if (oldItemData) {
            addItemToInventory(oldItemData);
        }
    }
    
    // Update equipment in userData
    userData.equipment = userData.equipment || {};
    userData.equipment[slot] = item.id;
    
    // Update character appearance if needed
    if (slot === "weapon" || slot === "armor") {
        updateCharacterAppearance();
    }
}

function updateEquipmentDisplay() {
    // Update visual representation of equipped items
    const equipmentContainer = document.getElementById('equipmentItems');
    if (!equipmentContainer) return;
    
    equipmentContainer.innerHTML = '';
    
    const equipSlots = ["weapon", "armor", "helmet", "accessory"];
    equipSlots.forEach(slot => {
        const slotElement = document.createElement('div');
        slotElement.className = 'equipment-slot';
        
        const equippedItemId = userData.equipment && userData.equipment[slot] || 'none';
        let slotContent = '';
        
        if (equippedItemId !== 'none') {
            const item = ITEMS.find(i => i.id === equippedItemId);
            if (item) {
                slotContent = `
                    <img src="images/items/${item.id}.png" onerror="this.src='images/items/default.png'" alt="${formatItemName(item.id)}">
                    <span>${formatItemName(item.id)}</span>
                `;
            }
        } else {
            slotContent = `
                <div class="empty-slot"></div>
                <span>Empty ${slot.charAt(0).toUpperCase() + slot.slice(1)}</span>
            `;
        }
        
        slotElement.innerHTML = slotContent;
        equipmentContainer.appendChild(slotElement);
    });
}

function removeItemFromInventory(itemId, quantity = 1) {
    // Find the item in inventory
    const itemIndex = userData.inventory.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        // Reduce quantity
        userData.inventory[itemIndex].quantity -= quantity;
        
        // If quantity is 0 or less, remove the item
        if (userData.inventory[itemIndex].quantity <= 0) {
            userData.inventory.splice(itemIndex, 1);
        }
        
        return true;
    }
    
    return false;
}

function addItemToInventory(item, quantity = 1) {
    // Check if item already exists in inventory
    const existingItem = userData.inventory.find(invItem => invItem.id === item.id);
    
    if (existingItem) {
        // Increment quantity
        existingItem.quantity += quantity;
    } else {
        // Add new item
        userData.inventory.push({
            ...item,
            quantity: quantity
        });
    }
}