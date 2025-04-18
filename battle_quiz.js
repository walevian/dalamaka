// Initialize Telegram Web App compatibility
let tg = window.Telegram && window.Telegram.WebApp;
if (tg) {
  tg.expand();
}

// Quiz questions database
const quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2 // Paris (index 2)
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1 // Mars (index 1)
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3 // Pacific Ocean (index 3)
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
    correctAnswer: 1 // Oxygen (index 1)
  },
  {
    question: "Which animal is known as the 'King of the Jungle'?",
    options: ["Tiger", "Lion", "Elephant", "Giraffe"],
    correctAnswer: 1 // Lion (index 1)
  },
  {
    question: "What's the smallest prime number?",
    options: ["0", "1", "2", "3"],
    correctAnswer: 2 // 2 (index 2)
  },
  {
    question: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2 // 7 (index 2)
  },
  {
    question: "Which planet has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    correctAnswer: 1 // Saturn (index 1)
  },
  {
    question: "What's the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Platinum"],
    correctAnswer: 2 // Diamond (index 2)
  },
  {
    question: "Which of these is not a primary color?",
    options: ["Red", "Blue", "Green", "Yellow"],
    correctAnswer: 3 // Yellow (index 3)
  }
];

// DOM Elements
const battleStartOverlay = document.getElementById('battle-start-overlay');
const quizContainer = document.getElementById('battle-quiz-container');
const questionElement = document.getElementById('battle-quiz-question');
const optionsContainer = document.getElementById('battle-quiz-options');
const battleContainer = document.getElementById('battle-container');
const quizResultElement = document.getElementById('quiz-result');
const backToMenuButton = document.getElementById('back-to-menu');

// Variables to store quiz state
let currentQuiz = null;
let userBuffs = {
  damage: 1,
  healing: 1,
  defense: 1
};

// Battle buffs/debuffs - more random now
const battleBuffsTypes = {
  correctBuffs: [
    {
      name: "Damage boost",
      effect: {
        damage: 1.5,
        healing: 1.0,
        defense: 1.0
      },
      message: "Your attacks deal 50% more damage!"
    },
    {
      name: "Healing boost",
      effect: {
        damage: 1.0,
        healing: 1.8,
        defense: 1.0
      },
      message: "Your healing is 80% more effective!"
    },
    {
      name: "Defense boost",
      effect: {
        damage: 1.0,
        healing: 1.0,
        defense: 1.6
      },
      message: "You take 40% less damage from attacks!"
    },
    {
      name: "All stats boost",
      effect: {
        damage: 1.2,
        healing: 1.2,
        defense: 1.2
      },
      message: "All your combat abilities are enhanced by 20%!"
    }
  ],
  incorrectDebuffs: [
    {
      name: "Damage reduction",
      effect: {
        damage: 0.7,
        healing: 1.0,
        defense: 1.0
      },
      message: "Your attacks deal 30% less damage!"
    },
    {
      name: "Healing reduction",
      effect: {
        damage: 1.0,
        healing: 0.6,
        defense: 1.0
      },
      message: "Your healing is 40% less effective!"
    },
    {
      name: "Defense reduction",
      effect: {
        damage: 1.0,
        healing: 1.0,
        defense: 0.7
      },
      message: "You take 30% more damage from attacks!"
    },
    {
      name: "All stats reduction",
      effect: {
        damage: 0.8,
        healing: 0.8,
        defense: 0.8
      },
      message: "All your combat abilities are reduced by 20%!"
    }
  ]
};

// Get random unique questions from the quiz bank
function getRandomQuestions(count) {
  // Create a copy of the questions array to avoid modifying the original
  const availableQuestions = [...quizQuestions];
  const selectedQuestions = [];
  
  // Get the requested number of random questions
  for (let i = 0; i < count && availableQuestions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    selectedQuestions.push(availableQuestions[randomIndex]);
    availableQuestions.splice(randomIndex, 1);
  }
  
  return selectedQuestions;
}

// Get a random buff or debuff
function getRandomBuff(isCorrect) {
  const buffList = isCorrect ? battleBuffsTypes.correctBuffs : battleBuffsTypes.incorrectDebuffs;
  const randomIndex = Math.floor(Math.random() * buffList.length);
  return buffList[randomIndex];
}

// Show a single quiz question
function showQuizQuestion(quiz) {
  // Display question
  questionElement.textContent = quiz.question;
  
  // Clear previous options
  optionsContainer.innerHTML = '';
  
  // Add options
  quiz.options.forEach((option, index) => {
    const optionButton = document.createElement('div');
    optionButton.className = 'battle-quiz-option';
    optionButton.textContent = option;
    optionButton.dataset.index = index;
    
    optionButton.addEventListener('click', function() {
      // Check if correct
      const selectedIndex = parseInt(this.dataset.index);
      const isCorrect = selectedIndex === quiz.correctAnswer;
      
      // Get random buff or debuff
      const buffEffect = getRandomBuff(isCorrect);
      
      // Apply visual feedback
      if (isCorrect) {
        this.classList.add('correct');
        quizResultElement.textContent = `Correct! ${buffEffect.message}`;
        // Apply random buff
        userBuffs = buffEffect.effect;
      } else {
        this.classList.add('incorrect');
        document.querySelectorAll('.battle-quiz-option')[quiz.correctAnswer].classList.add('correct');
        quizResultElement.textContent = `Incorrect! ${buffEffect.message}`;
        // Apply random debuff
        userBuffs = buffEffect.effect;
      }
      
      // Disable all options
      document.querySelectorAll('.battle-quiz-option').forEach(opt => {
        opt.style.pointerEvents = 'none';
      });
      
      // Start battle after a delay
      setTimeout(() => {
        startBattle();
      }, 2000);
    });
    
    optionsContainer.appendChild(optionButton);
  });
}

// Display battle quiz when overlay is clicked
function startBattleQuiz() {
  // Hide overlay
  battleStartOverlay.style.display = 'none';
  
  // Show quiz
  quizContainer.style.display = 'block';
  
  // Get a random quiz question
  currentQuiz = getRandomQuestions(1)[0];
  
  // Display the question
  showQuizQuestion(currentQuiz);
  
  // Clear result element
  quizResultElement.textContent = '';
}

// Start the actual battle
function startBattle() {
  // Save buffs to localStorage for battle.js to use
  localStorage.setItem('battleBuffs', JSON.stringify(userBuffs));
  
  // Hide quiz, show battle
  quizContainer.style.display = 'none';
  battleContainer.style.display = 'flex';
  
  // Call the original startBattle function from battle.js
  if (typeof window.originalStartBattle === 'function') {
    window.originalStartBattle();
  } else {
    console.error('originalStartBattle function not found');
  }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Add click event to battle overlay
  if (battleStartOverlay) {
    battleStartOverlay.addEventListener('click', startBattleQuiz);
  }
  
  // Set up back to menu button
  if (backToMenuButton) {
    backToMenuButton.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  // Load theme preference
  const savedTheme = localStorage.getItem("preferred-theme");
  if (savedTheme) {
    document.body.className = savedTheme;
  } else {
    document.body.className = "colorful-theme";
  }
  
  // Hide battle container and quiz container initially
  if (battleContainer) {
    battleContainer.style.display = 'none';
  }
  
  if (quizContainer) {
    quizContainer.style.display = 'none';
  }
});

// Handle icon clicks for navigation
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll(".icon").forEach(icon => {
    icon.addEventListener("click", function() {
      const action = this.getAttribute("data-action");
      if (action === "games") {
        window.location.href = "index.html";
      } else if (action === "stats") {
        window.location.href = "stats.html";
      } else if (action === "room") {
        window.location.href = "room.html";
      } else if (action === "inventory") {
        alert("Inventory is coming soon! 🎒");
      } else if (action === "battle") {
        window.location.href = "battle.html";
      }
    });
  });
});