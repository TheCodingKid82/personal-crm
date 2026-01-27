#!/usr/bin/env node

/**
 * AP World History Quiz Program
 * 
 * Usage:
 *   node quiz.js                    # Quiz on everything
 *   node quiz.js --category terms   # Quiz on key terms only
 *   node quiz.js --category dates   # Quiz on key dates only
 *   node quiz.js --category figures # Quiz on key figures only
 *   node quiz.js --unit 3           # Quiz on Unit 3 content only
 *   node quiz.js --count 10         # Quiz with 10 questions
 *   node quiz.js --help             # Show help
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Configuration
const FLASHCARD_DIR = path.join(__dirname, 'flashcards');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    category: null,    // 'terms', 'dates', 'figures', or null for all
    unit: null,        // Unit number (1-9) or null for all
    count: 15,         // Number of questions
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--category':
      case '-c':
        options.category = args[++i];
        break;
      case '--unit':
      case '-u':
        options.unit = parseInt(args[++i]);
        break;
      case '--count':
      case '-n':
        options.count = parseInt(args[++i]);
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

function showHelp() {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           AP World History Quiz Program                        ║
╚════════════════════════════════════════════════════════════════╝

Usage: node quiz.js [options]

Options:
  --category, -c <type>   Filter by category: terms, dates, figures
  --unit, -u <number>     Filter by unit (1-9)
  --count, -n <number>    Number of questions (default: 15)
  --help, -h              Show this help message

Examples:
  node quiz.js                        # Quiz on everything
  node quiz.js --category terms       # Key terms only
  node quiz.js --category dates       # Important dates only
  node quiz.js --unit 3               # Unit 3 content only
  node quiz.js -c figures -n 20       # 20 questions on key figures
  node quiz.js --unit 5 --count 10    # 10 questions from Unit 5

Categories:
  terms   - Vocabulary and definitions
  dates   - Important dates and events
  figures - Historical figures and their significance
`);
}

// Unit keywords for filtering
const unitKeywords = {
  1: ['1200-1450', 'mongol', 'song', 'yuan', 'mali', 'delhi', 'aztec', 'inca', 'ming', 'genghis', 'kublai', 'mansa musa', 'zheng he', 'ibn battuta', 'marco polo'],
  2: ['1200-1450', 'silk road', 'indian ocean', 'trans-saharan', 'trade route', 'caravan', 'dhow', 'monsoon', 'diasporic', 'black death', 'pax mongolica'],
  3: ['1450-1750', 'ottoman', 'safavid', 'mughal', 'qing', 'ming', 'tokugawa', 'gunpowder empire', 'suleiman', 'akbar', 'shah abbas', 'devshirme', 'janissary', 'millet'],
  4: ['1450-1750', 'columbian exchange', 'atlantic', 'slave trade', 'encomienda', 'hacienda', 'columbus', 'cortés', 'pizarro', 'conquistador', 'mercantilism', 'triangle trade', 'silver', 'potosí'],
  5: ['1750-1900', 'enlightenment', 'revolution', 'french revolution', 'american revolution', 'haitian', 'latin american', 'napoleon', 'locke', 'rousseau', 'nationalism', 'bolívar', 'toussaint'],
  6: ['1750-1900', 'industrial', 'imperialism', 'factory', 'steam', 'capitalism', 'socialism', 'marx', 'opium war', 'berlin conference', 'scramble for africa', 'british raj', 'meiji'],
  7: ['1900-present', 'world war', 'wwi', 'wwii', 'total war', 'trench', 'fascism', 'nazi', 'holocaust', 'hitler', 'stalin', 'mussolini', 'versailles', 'great depression'],
  8: ['1900-present', 'cold war', 'decolonization', 'containment', 'proxy war', 'non-aligned', 'gandhi', 'nehru', 'nasser', 'mandela', 'apartheid', 'vietnam', 'korean war'],
  9: ['1900-present', 'globalization', 'multinational', 'free trade', 'wto', 'united nations', 'climate change', 'pandemic', 'internet', 'migration']
};

// Parse flashcard file
function parseFlashcardFile(filename) {
  const filepath = path.join(FLASHCARD_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    return [];
  }

  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  const cards = [];

  for (const line of lines) {
    // Skip headers, empty lines, and non-card lines
    if (line.startsWith('#') || line.startsWith('|') || line.startsWith('-') || line.trim() === '') {
      continue;
    }

    // Parse "**Term** | Definition" format
    const match = line.match(/\*\*(.+?)\*\*\s*\|\s*(.+)/);
    if (match) {
      cards.push({
        term: match[1].trim(),
        definition: match[2].trim(),
        originalLine: line
      });
    }
  }

  return cards;
}

// Load all flashcards
function loadFlashcards(options) {
  const files = {
    terms: 'key-terms.md',
    dates: 'key-dates.md',
    figures: 'key-figures.md'
  };

  let allCards = [];

  // Load specified category or all
  const categoriesToLoad = options.category ? [options.category] : Object.keys(files);

  for (const category of categoriesToLoad) {
    if (!files[category]) {
      console.error(`Unknown category: ${category}`);
      console.log('Valid categories: terms, dates, figures');
      process.exit(1);
    }

    const cards = parseFlashcardFile(files[category]);
    cards.forEach(card => {
      card.category = category;
    });
    allCards = allCards.concat(cards);
  }

  // Filter by unit if specified
  if (options.unit) {
    if (options.unit < 1 || options.unit > 9) {
      console.error(`Invalid unit: ${options.unit}. Must be 1-9.`);
      process.exit(1);
    }

    const keywords = unitKeywords[options.unit];
    allCards = allCards.filter(card => {
      const searchText = (card.term + ' ' + card.definition).toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
    });
  }

  return allCards;
}

// Shuffle array
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Calculate similarity between two strings (for fuzzy matching)
function similarity(s1, s2) {
  s1 = s1.toLowerCase().trim();
  s2 = s2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  // Check if answer contains key parts
  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  
  let matches = 0;
  for (const word of words1) {
    if (word.length > 3 && words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  }
  
  return matches / Math.max(words1.length, 1);
}

// Main quiz function
async function runQuiz(options) {
  const cards = loadFlashcards(options);
  
  if (cards.length === 0) {
    console.log('\n❌ No flashcards found matching your criteria.');
    console.log('   Try different options or check that flashcard files exist.');
    process.exit(1);
  }

  const questionCount = Math.min(options.count, cards.length);
  const questions = shuffle(cards).slice(0, questionCount);

  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║           AP World History Quiz                                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(`\n📚 ${questionCount} questions from ${cards.length} available cards`);
  if (options.category) console.log(`📁 Category: ${options.category}`);
  if (options.unit) console.log(`📖 Unit: ${options.unit}`);
  console.log('\nType your answer and press Enter. Type "skip" to skip, "quit" to exit.\n');
  console.log('─'.repeat(65));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let score = 0;
  let attempted = 0;
  let skipped = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const questionNum = i + 1;
    
    // Randomly decide whether to show term or definition
    const showTerm = Math.random() > 0.5;
    
    let prompt, correctAnswer;
    if (showTerm || q.category === 'dates') {
      // Show term, ask for definition/significance
      console.log(`\n[${questionNum}/${questionCount}] ${q.category.toUpperCase()}`);
      console.log(`\n   📌 ${q.term}`);
      prompt = '\n   Your answer: ';
      correctAnswer = q.definition;
    } else {
      // Show definition, ask for term
      console.log(`\n[${questionNum}/${questionCount}] ${q.category.toUpperCase()}`);
      console.log(`\n   📌 ${q.definition}`);
      prompt = '\n   What is this? ';
      correctAnswer = q.term;
    }

    const answer = await new Promise(resolve => {
      rl.question(prompt, resolve);
    });

    if (answer.toLowerCase() === 'quit') {
      console.log('\n👋 Quiz ended early.');
      break;
    }

    if (answer.toLowerCase() === 'skip') {
      skipped++;
      console.log(`   ⏭️  Skipped. Answer: ${correctAnswer}`);
      continue;
    }

    attempted++;

    // Check answer with fuzzy matching
    const sim = similarity(answer, correctAnswer);
    
    if (sim > 0.6 || answer.toLowerCase().includes(correctAnswer.toLowerCase().split(' ')[0])) {
      score++;
      console.log(`   ✅ Correct!`);
      if (sim < 1) {
        console.log(`   📝 Full answer: ${correctAnswer}`);
      }
    } else {
      console.log(`   ❌ Not quite.`);
      console.log(`   📝 Answer: ${correctAnswer}`);
    }
  }

  rl.close();

  // Final score
  console.log('\n' + '═'.repeat(65));
  console.log('\n📊 FINAL SCORE\n');
  console.log(`   Correct:  ${score}/${attempted}`);
  console.log(`   Skipped:  ${skipped}`);
  
  const percentage = attempted > 0 ? Math.round((score / attempted) * 100) : 0;
  console.log(`   Accuracy: ${percentage}%`);
  
  let message;
  if (percentage >= 90) {
    message = '🏆 Excellent! You\'re ready for the exam!';
  } else if (percentage >= 75) {
    message = '👍 Good job! Keep practicing!';
  } else if (percentage >= 60) {
    message = '📚 Getting there! Review the units you struggled with.';
  } else {
    message = '💪 Keep studying! Focus on your weak areas.';
  }
  
  console.log(`\n   ${message}\n`);
  console.log('═'.repeat(65) + '\n');
}

// Main
const options = parseArgs();

if (options.help) {
  showHelp();
} else {
  runQuiz(options).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
