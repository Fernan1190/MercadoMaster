
export interface UserStats {
  xp: number;
  level: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Master';
  streak: number;
  balance: number; // Virtual money for paper trading
  hearts: number; // Current lives (max 5)
  maxHearts: number;
  masterCoins: number; // Gamified currency
  completedLessons: string[]; // Keep for legacy compatibility or achievements
  levelRatings: { [lessonId: string]: 1 | 2 | 3 }; // NEW: Stars per level (1-3)
  pathProgress: {
    [key in PathId]?: number; // Current level index per path
  };
  inventory: {
    hint5050: number;
    timeFreeze: number;
    skip: number;
    streakFreeze: number;
    doubleXp: number;
  };
  bookmarks: string[]; // Saved terms
  dailyQuests: DailyQuest[];
  lastLogin?: string;
  openedChests: string[]; // NEW: Track opened chests
  
  // NEW FEATURES
  theme: 'default' | 'cyberpunk' | 'terminal';
  prestige: number;
  stakedCoins: number; // Coins locked in safe
  minedCoins: number; // Coins from clicker
  quickNotes: string; // Persistent notepad
}

export enum PathId {
  STOCKS = 'stocks',
  CRYPTO = 'crypto'
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  color: string; // Tailwind color class base (e.g. 'blue', 'purple')
  totalLevels: number;
  biome?: 'neon' | 'forest' | 'ocean' | 'volcano' | 'space'; // NEW: Visual theme
}

export interface LearningPath {
  id: PathId;
  title: string;
  description: string;
  icon: string;
  themeColor: string;
  units: Unit[];
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching' | 'ordering' | 'binary_prediction' | 'candle_chart' | 'word_construction' | 'risk_slider' | 'portfolio_balancing' | 'sentiment_swipe' | 'chart_point';

export interface QuizQuestion {
  type: QuestionType;
  question: string; // The main instruction or scenario
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Pedagogical Fields (NEW)
  pedagogicalGoal?: string; // What skill is being tested?
  bloomLevel?: 'remember' | 'understand' | 'apply' | 'analyze';
  scenarioContext?: string; // Background info for the question

  // For multiple_choice / true_false / binary_prediction
  options?: string[]; 
  correctIndex?: number;
  correctAnswerText?: string; // CRITICAL for validation
  
  // For matching (Pairs)
  pairs?: { left: string; right: string }[]; 

  // For ordering (Sequence)
  correctOrder?: string[]; 

  // For Candle Chart (Simulated Data)
  chartData?: { 
    trend: 'up' | 'down' | 'volatile' | 'doji_reversal';
    indicatorHint?: string; // e.g., "RSI is Overbought"
  }; 

  // For Word Construction
  sentenceParts?: string[]; 

  // For Risk Slider
  riskScenario?: { correctValue: number; tolerance: number; minLabel: string; maxLabel: string };

  // For Portfolio Balancing
  portfolioAssets?: { name: string; type: 'stock' | 'bond' | 'crypto'; riskScore: number }[]; // Max 3 assets
  portfolioTargetRisk?: number; // Target avg risk score (0-100)

  // For Sentiment Swipe
  sentimentCards?: { text: string; sentiment: 'bullish' | 'bearish' }[];

  // For Chart Point (Stop Loss)
  chartPointConfig?: { entryPrice: number; trend: 'up' | 'down'; idealStopLoss: number };

  explanation: string;
  relatedSlideIndex?: number; // Link back to theory
}

export interface TheorySlide {
  title: string;
  content: string; // Markdown
  simplifiedContent?: string; // "Explain like I'm 5" version (can be generated on fly or pre-gen)
  analogy: string; // "Think of it like..."
  realWorldExample?: string; // "For example, Apple in 2020..."
  icon: string; // Emoji suggestion
  visualType?: 'chart_line' | 'chart_pie' | 'diagram_flow' | 'none';
  keyTerms?: string[]; // Terms to add to glossary
  
  // New Pedagogical Elements
  deepDive?: { title: string; content: string }; // Accordion for advanced info
  commonPitfall?: string; // Warning box
  proTip?: string; // Expert advice
  checkpointQuestion?: { question: string; answer: boolean }; // Mini interaction
}

export interface LessonContent {
  id?: string; // Unique ID for caching/stars (pathId-unitId-levelIndex)
  title: string;
  isBossLevel: boolean;
  slides: TheorySlide[]; // NEW: Theory content before quiz
  quiz: QuizQuestion[];
  generatedBy?: 'ai' | 'fallback' | 'static'; // Track source
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MarketData {
  time: string;
  price: number;
}

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string; // Icon name reference
  condition: (stats: UserStats) => boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  avatar: string; // Emoji or URL
  isCurrentUser?: boolean;
  league: string;
}

export interface DailyQuest {
  id: string;
  text: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: number;
  type: 'xp' | 'lessons' | 'perfect';
}

export interface Order {
  id: string;
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  timestamp: number;
  asset: string;
  leverage: number; // NEW
  pl?: number; // Profit/Loss if closed
  commission?: number; // NEW
}

// NEW INTERFACES
export type GameMode = 'standard' | 'survival' | 'time_trial';

export type AIPersona = 'standard' | 'warren' | 'wolf' | 'socrates';

export interface SimSettings {
   leverage: number; // 1, 5, 10, 50
   showRSI: boolean;
   showSMA: boolean;
}