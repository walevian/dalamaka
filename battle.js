// Save the original startBattle function to be called by the quiz system
window.originalStartBattle = startBattle;

// Modify the startBattle function to check for buffs
function startBattle() {
  if (battleInProgress) return;

  // Check if player has lives
  const userData = loadUserData();
  if (userData.lives <= 0) {
    addBattleMessage('system', 'You have no lives left! Come back tomorrow or earn more lives by completing challenges.');
    return;
  }

  // Reset battle state
  battleInProgress = true;
  playerCurrentHealth = playerMaxHealth;
  enemyCurrentHealth = enemyMaxHealth;
  battleMessages.innerHTML = '';
  battleRewards = [];
  clickCounter = 0;

  // Reset health bars
  playerHealth.style.width = '100%';
  enemyHealth.style.width = '100%';
  playerHealth.style.backgroundColor = '#27ae60';
  enemyHealth.style.backgroundColor = '#27ae60';

  // Apply buffs from quiz if available
  const battleBuffsString = localStorage.getItem('battleBuffs');
  if (battleBuffsString) {
    const battleBuffs = JSON.parse(battleBuffsString);
    // Apply buffs to player stats
    playerDamage = Math.floor(playerDamage * battleBuffs.damage);
    healAmount = Math.floor(healAmount * battleBuffs.healing);
    playerDefense = Math.floor(playerDefense * battleBuffs.defense);
    
    // Add message about buffs
    if (battleBuffs.damage > 1) {
      addBattleMessage('system', `Quiz advantage: Your damage increased by ${Math.floor((battleBuffs.damage - 1) * 100)}%!`);
    } else if (battleBuffs.damage < 1) {
      addBattleMessage('system', `Quiz penalty: Your damage decreased by ${Math.floor((1 - battleBuffs.damage) * 100)}%!`);
    }
    
    if (battleBuffs.healing > 1) {
      addBattleMessage('system', `Quiz advantage: Your healing increased by ${Math.floor((battleBuffs.healing - 1) * 100)}%!`);
    } else if (battleBuffs.healing < 1) {
      addBattleMessage('system', `Quiz penalty: Your healing decreased by ${Math.floor((1 - battleBuffs.healing) * 100)}%!`);
    }
    
    if (battleBuffs.defense > 1) {
      addBattleMessage('system', `Quiz advantage: You take ${Math.floor((1 - (1/battleBuffs.defense)) * 100)}% less damage!`);
    } else if (battleBuffs.defense < 1) {
      addBattleMessage('system', `Quiz penalty: You take ${Math.floor((1/battleBuffs.defense - 1) * 100)}% more damage!`);
    }
    
    // Clear the buffs from storage
    localStorage.removeItem('battleBuffs');
  }

  // Add battle message
  addBattleMessage('system', `Battle started! Click rapidly on the monster to attack!`);

  // Start enemy attack interval
  enemyAttackInterval = setInterval(enemyAttack, currentEnemy.attackSpeed);

  // Start healing orb interval
  healingOrbInterval = setInterval(showHealingOrb, 3000 + Math.random() * 3000);
}

// Override the original function
window.startBattle = startBattle;
// Initialize Telegram Web App compatibility
let tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
    tg.expand();
}

// DOM Elements
const startBattleButton = document.getElementById('start-battle');
const backToMenuButton = document.getElementById('back-to-menu');
const battleMessages = document.getElementById('battle-messages');
const playerHealth = document.getElementById('player-health');
const enemyHealth = document.getElementById('enemy-health');
const enemyName = document.getElementById('enemy-name');
const enemyLevel = document.getElementById('enemy-level');
const enemyType = document.getElementById('enemy-type');
const enemyCharacter = document.getElementById('enemy-character');
const playerCharacter = document.getElementById('player-character');
const healingOrb = document.getElementById('healing-orb');
const monsterImage = document.querySelector('.monster-image');
const monsterHitAnimation = document.getElementById('monster-hit-animation');

// Game variables
let battleInProgress = false;
let playerCurrentHealth = 100;
let enemyCurrentHealth = 100;
let playerMaxHealth = 100;
let enemyMaxHealth = 150; // Increased monster health for clicker gameplay
let currentEnemy = {
  name: 'Monster',
  level: 3,
  type: 'Beast',
  health: 150,
  attack: 5,
  defense: 2,
  attackSpeed: 250 // Time between attacks in milliseconds
};
let enemyAttackInterval = null;
let healingOrbInterval = null;
let playerDamage = 10;
let healAmount = 20;
let clickCooldown = false;
let clickCooldownTime = 50; // Short cooldown for rapid clicking
let battleRewards = [];
let playerDefense = 1;
let clickCounter = 0; // Track clicks for damage animation
let animationPlaying = false; // Flag to track animation status
let clicksForAnimation = 5; // Number of clicks before playing animation

// Enemy types - revised with fast attack speeds
const enemies = [
    {
        name: 'Slime',
        type: 'Normal',
        level: 1,
        health: 80,
        attack: 3,
        defense: 1,
        attackSpeed: 300, // 3+ attacks in a second
        cssClass: 'enemy-slime',
        rewards: {
            xp: 20,
            items: [
                { name: 'Slime Goo', icon: '🧪', chance: 0.7 },
                { name: 'Health Potion', icon: '❤️', chance: 0.3 }
            ]
        }
    },
    {
        name: 'Goblin',
        type: 'Forest',
        level: 2,
        health: 100,
        attack: 4,
        defense: 2,
        attackSpeed: 280, // even faster
        cssClass: 'enemy-goblin',
        rewards: {
            xp: 35,
            items: [
                { name: 'Goblin Dagger', icon: '🗡️', chance: 0.4 },
                { name: 'Gold Coins', icon: '💰', chance: 0.6 }
            ]
        }
    },
    {
        name: 'Ghost',
        type: 'Ethereal',
        level: 3,
        health: 120,
        attack: 5,
        defense: 2,
        attackSpeed: 270, // even faster
        cssClass: 'enemy-ghost',
        rewards: {
            xp: 50,
            items: [
                { name: 'Spectral Essence', icon: '👻', chance: 0.5 },
                { name: 'Magic Scroll', icon: '📜', chance: 0.3 }
            ]
        }
    },
    {
        name: 'Dragon',
        type: 'Fire',
        level: 5,
        health: 200,
        attack: 7,
        defense: 4,
        attackSpeed: 250, // very fast attacks
        cssClass: 'enemy-dragon',
        rewards: {
            xp: 100,
            items: [
                { name: 'Dragon Scale', icon: '🔥', chance: 0.6 },
                { name: 'Fire Crystal', icon: '💎', chance: 0.4 },
                { name: 'Dragon Fang', icon: '🦷', chance: 0.2 }
            ]
        }
    },
    {
        name: 'Dark Lord',
        type: 'Boss',
        level: 10,
        health: 300,
        attack: 10,
        defense: 5,
        attackSpeed: 220, // super fast attacks
        cssClass: 'enemy-boss',
        rewards: {
            xp: 200,
            items: [
                { name: 'Shadow Artifact', icon: '🔮', chance: 0.8 },
                { name: 'Dark Armor', icon: '🛡️', chance: 0.5 },
                { name: 'Legendary Weapon', icon: '⚔️', chance: 0.3 }
            ]
        }
    }
];

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('brainTrainingUserData');
    if (savedData) {
        return JSON.parse(savedData);
    } else {
        // Default user data
        return {
            level: 1,
            xp: 0,
            lives: 5,
            lastPlayed: new Date(),
            stats: {
                intelligence: 10,
                sports: 5,
                languages: 3,
                energy: 8,
                creativity: 7,
                health: 10
            },
            equipment: {
                skin: 'light',
                outfit: 'casual',
                headgear: 'none',
                weapon: 'none'
            },
            pet: {
                unlocked: false
            },
            inventory: []
        };
    }
}

// Save user data to localStorage
function saveUserData(userData) {
    localStorage.setItem('brainTrainingUserData', JSON.stringify(userData));
}

// Update the player character appearance
function updatePlayerAppearance() {
    const userData = loadUserData();
    
    // Apply character customization
    playerCharacter.className = 'character-container';
    
    // Apply skin class
    playerCharacter.classList.add(`skin-${userData.equipment.skin}`);
    
    // Apply outfit class if not none
    if (userData.equipment.outfit !== 'none') {
        playerCharacter.classList.add(`outfit-${userData.equipment.outfit}`);
    }
    
    // Apply headgear class if not none
    if (userData.equipment.headgear !== 'none') {
        playerCharacter.classList.add(`headgear-${userData.equipment.headgear}`);
    }
    
    // Apply weapon class if not none
    if (userData.equipment.weapon !== 'none') {
        playerCharacter.classList.add(`weapon-${userData.equipment.weapon}`);
    }
    
    // Create character visualization layers
    playerCharacter.innerHTML = `
        <div id="player-body" class="char-layer"></div>
        <div id="player-outfit" class="char-layer"></div>
        <div id="player-head" class="char-layer"></div>
        <div id="player-face" class="char-layer">
            <div id="player-mouth"></div>
        </div>
        <div id="player-headgear" class="char-layer"></div>
        <div id="player-weapon" class="char-layer"></div>
    `;
}

// Set up a new enemy
function setupEnemy() {
    // Select enemy based on player level
    const userData = loadUserData();
    const playerLevel = userData.level;
    
    // Filter enemies by level appropriate for player
    const availableEnemies = enemies.filter(enemy => enemy.level <= Math.max(1, playerLevel + 2));
    
    // If no appropriate enemies, use the first one
    if (availableEnemies.length === 0) {
        currentEnemy = {...enemies[0]};
    } else {
        // Randomly select from available enemies
        const randomIndex = Math.floor(Math.random() * availableEnemies.length);
        currentEnemy = {...availableEnemies[randomIndex]};
    }
    
    // Calculate player damage based on player stats and equipment
    calculatePlayerStats(userData);
    
    // Set enemy health
    enemyMaxHealth = currentEnemy.health;
    enemyCurrentHealth = enemyMaxHealth;
    
    // Update UI
    enemyName.textContent = currentEnemy.name;
    enemyLevel.textContent = 'Level: ' + currentEnemy.level;
    enemyType.textContent = 'Type: ' + currentEnemy.type;
    
    // Apply enemy appearance
    enemyCharacter.className = 'enemy-container ' + currentEnemy.cssClass;
    
    // Reset health bars
    playerHealth.style.width = '100%';
    enemyHealth.style.width = '100%';
    
    // Add battle message
    addBattleMessage('system', `A wild ${currentEnemy.name} appears! Click on the enemy to attack!`);
}

// Calculate player stats based on equipment
function calculatePlayerStats(userData) {
    // Base damage from sports stat
    playerDamage = 5 + Math.floor(userData.stats.sports / 2);
    
    // Base defense from health stat
    playerDefense = 1 + Math.floor(userData.stats.health / 5);
    
    // Apply weapon bonuses for damage
    if (userData.equipment.weapon === 'sword') {
        playerDamage += 5;
    } else if (userData.equipment.weapon === 'staff') {
        playerDamage += 3;
        playerDefense += 1;
    } else if (userData.equipment.weapon === 'bow') {
        playerDamage += 4;
    }
    
    // Apply outfit bonuses for defense
    if (userData.equipment.outfit === 'warrior') {
        playerDefense += 3;
        playerDamage += 2;
    } else if (userData.equipment.outfit === 'mage') {
        playerDefense += 1;
        playerDamage += 3;
    } else if (userData.equipment.outfit === 'formal') {
        playerDefense += 2;
    }
    
    // Apply headgear bonuses
    if (userData.equipment.headgear === 'helmet') {
        playerDefense += 2;
    } else if (userData.equipment.headgear === 'crown') {
        playerDamage += 2;
    } else if (userData.equipment.headgear === 'hat') {
        playerDefense += 1;
    }
}

// Add a message to the battle log
function addBattleMessage(type, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `battle-message ${type}-message`;
    messageElement.textContent = message;
    battleMessages.appendChild(messageElement);
    
    // Auto-scroll to bottom
    battleMessages.scrollTop = battleMessages.scrollHeight;
}

// Show damage number animation
function showDamageNumber(target, damage, isHeal = false) {
    const damageElement = document.createElement('div');
    damageElement.className = isHeal ? 'heal-number' : 'damage-number';
    damageElement.textContent = isHeal ? '+' + damage : '-' + damage;
    
    // Position the damage number
    const rect = target.getBoundingClientRect();
    const randomX = Math.random() * rect.width;
    
    damageElement.style.left = randomX + 'px';
    damageElement.style.top = (rect.height / 3) + 'px';
    
    target.appendChild(damageElement);
    
    // Remove the element after animation completes
    setTimeout(() => {
        if (damageElement.parentNode === target) {
            target.removeChild(damageElement);
        }
    }, 1000);
}

// Play damage animation video
function playDamageAnimation() {
    if (animationPlaying) return;
    
    animationPlaying = true;
    monsterImage.style.display = 'none';
    monsterHitAnimation.style.display = 'block';
    monsterHitAnimation.currentTime = 0;
    monsterHitAnimation.play();
    
    // Add shake animation to enemy container
    enemyCharacter.classList.add('shake-animation');
    
    // When video ends
    monsterHitAnimation.onended = function() {
        monsterHitAnimation.style.display = 'none';
        monsterImage.style.display = 'block';
        animationPlaying = false;
        enemyCharacter.classList.remove('shake-animation');
    };
}

// Player attack function
function playerAttack() {
    if (!battleInProgress || animationPlaying) return;
    
    // Calculate damage with some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    const damage = Math.max(1, Math.floor(playerDamage * randomFactor - (currentEnemy.defense * 0.3)));
    
    // Shake enemy on hit
    enemyCharacter.classList.add('shake-animation');
    setTimeout(() => {
        enemyCharacter.classList.remove('shake-animation');
    }, 300);
    
    // Show damage number
    showDamageNumber(enemyCharacter, damage);
    
    // Reduce enemy health
    enemyCurrentHealth = Math.max(0, enemyCurrentHealth - damage);
    const healthPercentage = (enemyCurrentHealth / enemyMaxHealth) * 100;
    enemyHealth.style.width = healthPercentage + '%';
    
    // Change health bar color based on remaining health
    if (healthPercentage < 25) {
        enemyHealth.style.backgroundColor = '#e74c3c';
    } else if (healthPercentage < 50) {
        enemyHealth.style.backgroundColor = '#f39c12';
    }
    
    // Increment click counter
    clickCounter++;
    
    // Play monster damage animation after several clicks
    if (clickCounter >= clicksForAnimation) {
        playDamageAnimation();
        clickCounter = 0;
    }
    
    // Check if enemy is defeated
    if (enemyCurrentHealth <= 0) {
        battleVictory();
    }
}

// Enemy attack function - automatic
function enemyAttack() {
    if (!battleInProgress) return;
    
    // Calculate damage with some randomness
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    // Account for player defense
    const damage = Math.max(1, Math.floor((currentEnemy.attack * randomFactor) - (playerDefense * 0.5)));
    
    // Animate player taking damage
    playerCharacter.classList.add('shake-animation');
    setTimeout(() => {
        playerCharacter.classList.remove('shake-animation');
    }, 300);
    
    // Show damage number
    showDamageNumber(playerCharacter, damage);
    
    // Reduce player health
    playerCurrentHealth = Math.max(0, playerCurrentHealth - damage);
    const healthPercentage = (playerCurrentHealth / playerMaxHealth) * 100;
    playerHealth.style.width = healthPercentage + '%';
    
    // Change health bar color based on remaining health
    if (healthPercentage < 25) {
        playerHealth.style.backgroundColor = '#e74c3c';
    } else if (healthPercentage < 50) {
        playerHealth.style.backgroundColor = '#f39c12';
    }
    
    // Check if player is defeated
    if (playerCurrentHealth <= 0) {
        battleDefeat();
    }
}

// Create and show healing orb
function showHealingOrb() {
    if (!battleInProgress) return;
    
    // Random position within the enemy container
    const container = enemyCharacter;
    const rect = container.getBoundingClientRect();
    
    const randomX = Math.floor(Math.random() * (rect.width - 40));
    const randomY = Math.floor(Math.random() * (rect.height - 40));
    
    healingOrb.style.left = (rect.left - 280 + randomX) + 'px';
    healingOrb.style.top = (rect.top - 70 + randomY) + 'px';
    healingOrb.style.display = 'flex';
    
    // Auto hide after certain time
    setTimeout(() => {
        if (healingOrb.style.display !== 'none') {
            healingOrb.style.display = 'none';
        }
    }, 2000);
}

// Handle healing orb click
function healPlayer() {
    if (!battleInProgress) return;
    
    // Hide the orb
    healingOrb.style.display = 'none';
    
    // Apply healing
    const healValue = healAmount;
    playerCurrentHealth = Math.min(playerMaxHealth, playerCurrentHealth + healValue);
    
    // Update health bar
    const healthPercentage = (playerCurrentHealth / playerMaxHealth) * 100;
    playerHealth.style.width = healthPercentage + '%';
    
    // Show healing effect
    showDamageNumber(playerCharacter, healValue, true);
    
    // Change health bar color based on remaining health
    if (healthPercentage >= 50) {
        playerHealth.style.backgroundColor = '#27ae60';
    } else if (healthPercentage >= 25) {
        playerHealth.style.backgroundColor = '#f39c12';
    }
    
    // Add message
    addBattleMessage('system', `You healed for ${healValue} health points!`);
}

// Battle victory function
function battleVictory() {
    battleInProgress = false;
    
    // Clear intervals
    clearInterval(enemyAttackInterval);
    clearInterval(healingOrbInterval);
    
    healingOrb.style.display = 'none';
    
    // Add victory message
    addBattleMessage('system', `You defeated the monster!`);
    
    // Calculate rewards
    let xpReward = 50; // Base XP
    let randomItems = [];
    
    // Random inventory items (30% chance for each)
    const possibleItems = [
        { name: 'Health Potion', icon: '❤️', chance: 0.3 },
        { name: 'Monster Fang', icon: '🦷', chance: 0.3 },
        { name: 'Monster Scale', icon: '🛡️', chance: 0.3 },
        { name: 'Gold Coins', icon: '💰', chance: 0.4 },
        { name: 'Monster Essence', icon: '✨', chance: 0.2 },
        { name: 'Weapon Part', icon: '⚔️', chance: 0.1 }
    ];
    
    // Roll for each item
    possibleItems.forEach(item => {
        if (Math.random() < item.chance) {
            randomItems.push(item);
        }
    });
    
    // Update user data
    const userData = loadUserData();
    
    // Add XP
    userData.xp += xpReward;
    addBattleMessage('reward', `🏆 Gained ${xpReward} XP`);
    
    // Check for level up
    const xpForNextLevel = userData.level * 100;
    if (userData.xp >= xpForNextLevel) {
        userData.level++;
        userData.xp -= xpForNextLevel;
        addBattleMessage('system', `Level up! You are now level ${userData.level}!`);
        
        // Increase a random stat
        const stats = ['intelligence', 'sports', 'languages', 'energy', 'creativity', 'health'];
        const randomStat = stats[Math.floor(Math.random() * stats.length)];
        userData.stats[randomStat] += 1;
        addBattleMessage('system', `Your ${randomStat} increased by 1!`);
    }
    
    // Add items to inventory
    for (const item of randomItems) {
        if (!userData.inventory) {
            userData.inventory = [];
        }
        userData.inventory.push({
            name: item.name,
            icon: item.icon,
            type: 'item',
            quantity: 1
        });
        
        // Add item message
        addBattleMessage('reward', `${item.icon} Found ${item.name}`);
    }
    
    saveUserData(userData);
}

// Battle defeat function
function battleDefeat() {
    battleInProgress = false;
    
    // Clear intervals
    clearInterval(enemyAttackInterval);
    clearInterval(healingOrbInterval);
    
    healingOrb.style.display = 'none';
    
    // Add defeat message
    addBattleMessage('system', `You were defeated by the monster!`);
    
    // Reduce a life
    const userData = loadUserData();
    if (userData.lives > 0) {
        userData.lives -= 1;
        addBattleMessage('system', `You lost a life! Lives remaining: ${userData.lives}`);
    }
    saveUserData(userData);
}

// Event Listeners
enemyCharacter.addEventListener('click', playerAttack);
healingOrb.addEventListener('click', healPlayer);
startBattleButton.addEventListener('click', startBattle);

// Back to menu button event listener
backToMenuButton.addEventListener('click', function() {
    if (enemyAttackInterval) {
        clearInterval(enemyAttackInterval);
    }
    if (healingOrbInterval) {
        clearInterval(healingOrbInterval);
    }
    window.location.href = 'index.html';
});

// Handle icon clicks for navigation
document.querySelectorAll('.icon').forEach(icon => {
    icon.addEventListener('click', function() {
        const action = this.getAttribute('data-action');
        if (action === 'games') {
            window.location.href = 'index.html';
        } else if (action === 'stats') {
            window.location.href = 'stats.html';
        } else if (action === 'room') {
            window.location.href = 'room.html';
        } else if (action === 'inventory') {
            alert('Inventory is coming soon! 🎒');
        } else if (action === 'battle') {
            // Already on battle page
        }
    });
});

// Initialize the page
window.onload = function() {
    updatePlayerAppearance();
    
    // Load theme preference
    const savedTheme = localStorage.getItem("preferred-theme");
    if (savedTheme) {
        document.body.className = savedTheme + "-theme";
    } else {
        document.body.className = "colorful-theme";
    }
};

// Game initialization
document.addEventListener('DOMContentLoaded', function() {
  // Set up back button
  if (backToMenuButton) {
    backToMenuButton.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  // Setup enemy character click for attacks
  if (monsterImage) {
    monsterImage.addEventListener('click', function() {
      if (!battleInProgress) return;
      
      if (!clickCooldown) {
        clickCooldown = true;
        playerAttack();
        setTimeout(() => {
          clickCooldown = false;
        }, clickCooldownTime);
      }
    });
  }
  
  // Set up healing orb click
  if (healingOrb) {
    healingOrb.addEventListener('click', healPlayer);
  }
  
  // Update player appearance based on saved data
  updatePlayerAppearance();
});