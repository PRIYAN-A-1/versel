import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExerciseLog {
  id: string;
  name: string;
  sets: { reps: number; weight: number; completed: boolean }[];
}

export interface WorkoutLog {
  id: string;
  category: string;
  date: string;
  durationMinutes: number;
  caloriesBurned: number;
  exercises: ExerciseLog[];
}

export interface MealLog {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  fiber: number;
  time: string;
}

export interface Goal {
  id: string;
  title: string;
  category: 'weight' | 'workout' | 'water' | 'steps' | 'diet';
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  xpReward: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  username: string;
  avatar: string;
  image?: string;
  content: string;
  likes: number;
  hasLiked: boolean;
  comments: { id: string; username: string; text: string }[];
  time: string;
}

interface FitnessState {
  // Auth & Onboarding State
  isLoggedIn: boolean;
  userEmail: string;
  hasCompletedOnboarding: boolean;
  activeTab: string;
  
  // User Profile Stats
  profile: {
    name: string;
    avatar: string;
    weight: number;
    height: number;
    targetWeight: number;
    xp: number;
    coins: number;
    level: number;
    age: number;
    gender: string;
  };

  // Daily Tracker Counters
  stepsCount: number;
  waterIntakeMl: number;
  sleepHours: number;
  heartRateBpm: number;
  stressLevel: number; // 0-100
  recoveryScore: number; // 0-100
  oxygenSaturation: number; // %
  
  // Lists
  meals: MealLog[];
  workouts: WorkoutLog[];
  goals: Goal[];
  achievements: Achievement[];
  chatHistory: ChatMessage[];
  communityFeed: CommunityPost[];
  
  // Active Workout State
  activeWorkout: {
    inProgress: boolean;
    category: string;
    duration: number; // seconds
    caloriesBurned: number;
    exercises: ExerciseLog[];
  } | null;

  // Actions
  login: (email: string) => void;
  logout: () => void;
  completeOnboarding: (name: string, gender: string, age: number, weight: number, height: number, targetWeight: number) => void;
  setActiveTab: (tab: string) => void;
  
  // Tracker Mutators
  addSteps: (steps: number) => void;
  addWater: (ml: number) => void;
  resetWater: () => void;
  logMeal: (meal: Omit<MealLog, 'id' | 'time'>) => void;
  deleteMeal: (id: string) => void;
  updateHeartRate: (bpm: number) => void;
  logSleep: (hours: number) => void;
  
  // Workout Actions
  startWorkout: (category: string) => void;
  updateWorkoutTimer: (seconds: number) => void;
  addExerciseToActiveWorkout: (name: string) => void;
  addSetToExercise: (exerciseIndex: number, reps: number, weight: number) => void;
  toggleSetCompleted: (exerciseIndex: number, setIndex: number) => void;
  completeActiveWorkout: () => void;
  cancelActiveWorkout: () => void;
  
  // Community Actions
  addPost: (content: string, image?: string) => void;
  likePost: (postId: string) => void;
  commentPost: (postId: string, text: string) => void;
  
  // AI Coach Actions
  addChatMessage: (sender: 'user' | 'coach', text: string) => void;
  
  // Smart Goal Actions
  addXP: (amount: number) => void;
  checkGoalProgression: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: '1', title: 'Hydration Catalyst', description: 'Log your first water intake', icon: 'droplet', unlockedAt: null, xpReward: 100 },
  { id: '2', title: 'Iron Sculptor', description: 'Log your first Strength workout', icon: 'dumbbell', unlockedAt: null, xpReward: 150 },
  { id: '3', title: 'Calorie Commander', description: 'Complete a day within your calorie target', icon: 'zap', unlockedAt: null, xpReward: 200 },
  { id: '4', title: 'Master Chef AI', description: 'Scan food using AI scanner', icon: 'scan', unlockedAt: null, xpReward: 120 },
  { id: '5', title: 'Weekly Warrior', description: 'Complete 3 workouts in a week', icon: 'trophy', unlockedAt: null, xpReward: 300 },
];

const INITIAL_GOALS: Goal[] = [
  { id: '1', title: 'Daily Water Intake', category: 'water', target: 3000, current: 0, unit: 'ml', completed: false },
  { id: '2', title: 'Burn Calories', category: 'diet', target: 2200, current: 0, unit: 'kcal', completed: false },
  { id: '3', title: 'Steps Challenge', category: 'steps', target: 10000, current: 4800, unit: 'steps', completed: false },
  { id: '4', title: 'Target Weight', category: 'weight', target: 75, current: 82, unit: 'kg', completed: false },
];

const INITIAL_COMMUNITY: CommunityPost[] = [
  {
    id: 'c1',
    username: 'RippedNerd',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    content: 'Just smashed a new PR in Deadlifts today: 180kg for 5 reps! Futuristic AI tracker helped monitor rest times precisely.',
    likes: 24,
    hasLiked: false,
    comments: [
      { id: 'cc1', username: 'FitQueen', text: 'Insane lift! Keep pushing.' },
    ],
    time: '2 hours ago',
  },
  {
    id: 'c2',
    username: 'ZenMaster',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    content: 'Completed an early morning 45-minute Yoga flow. Recovery index is at 94% today. Mind connection is real.',
    likes: 12,
    hasLiked: false,
    comments: [],
    time: '5 hours ago',
  },
];

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      userEmail: '',
      hasCompletedOnboarding: false,
      activeTab: 'dashboard',
      
      profile: {
        name: 'Neo Trainee',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        weight: 82,
        height: 180,
        targetWeight: 75,
        xp: 0,
        coins: 10,
        level: 1,
        age: 26,
        gender: 'Male',
      },

      stepsCount: 4820,
      waterIntakeMl: 0,
      sleepHours: 7.2,
      heartRateBpm: 72,
      stressLevel: 35,
      recoveryScore: 82,
      oxygenSaturation: 98,

      meals: [],
      workouts: [],
      goals: INITIAL_GOALS,
      achievements: INITIAL_ACHIEVEMENTS,
      chatHistory: [
        { id: 'm1', sender: 'coach', text: 'Hello! I am your AI Fitness Coach. I can help recommend custom workouts, meal options, and analyze your posture. What is your goal today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ],
      communityFeed: INITIAL_COMMUNITY,
      activeWorkout: null,

      login: (email: string) => set({ isLoggedIn: true, userEmail: email, activeTab: 'dashboard' }),
      logout: () => set({ isLoggedIn: false, userEmail: '', hasCompletedOnboarding: false, activeTab: 'login' }),
      
      completeOnboarding: (name, gender, age, weight, height, targetWeight) => set((state) => {
        const profile = {
          ...state.profile,
          name,
          gender,
          age,
          weight,
          height,
          targetWeight,
          xp: 100, // Onboarding XP
        };
        // Update Target weight goal
        const goals = state.goals.map(g => g.category === 'weight' ? { ...g, target: targetWeight, current: weight } : g);
        return {
          profile,
          goals,
          hasCompletedOnboarding: true,
          activeTab: 'dashboard'
        };
      }),
      
      setActiveTab: (tab) => set({ activeTab: tab }),

      addSteps: (steps) => set((state) => {
        const stepsCount = state.stepsCount + steps;
        // Update steps goal
        const goals = state.goals.map(g => g.category === 'steps' ? { ...g, current: stepsCount, completed: stepsCount >= g.target } : g);
        return { stepsCount, goals };
      }),

      addWater: (ml) => set((state) => {
        const waterIntakeMl = state.waterIntakeMl + ml;
        // Update water goal
        const goals = state.goals.map(g => g.category === 'water' ? { ...g, current: waterIntakeMl, completed: waterIntakeMl >= g.target } : g);
        
        // Trigger Hydration Badge check
        let achievements = [...state.achievements];
        const badge = achievements.find(a => a.id === '1');
        let newXp = 0;
        let coinsBonus = 0;
        if (badge && !badge.unlockedAt) {
          badge.unlockedAt = new Date().toISOString();
          newXp = badge.xpReward;
          coinsBonus = 10;
        }

        return { 
          waterIntakeMl, 
          goals, 
          achievements,
          profile: {
            ...state.profile,
            xp: state.profile.xp + newXp,
            coins: state.profile.coins + coinsBonus,
            level: Math.floor((state.profile.xp + newXp) / 500) + 1
          }
        };
      }),

      resetWater: () => set((state) => {
        const goals = state.goals.map(g => g.category === 'water' ? { ...g, current: 0, completed: false } : g);
        return { waterIntakeMl: 0, goals };
      }),

      logMeal: (mealData) => set((state) => {
        const newMeal: MealLog = {
          ...mealData,
          id: 'meal_' + Math.random().toString(36).substr(2, 9),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        const meals = [...state.meals, newMeal];
        
        // Calorie total update
        const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
        const goals = state.goals.map(g => g.category === 'diet' ? { ...g, current: totalCalories, completed: totalCalories >= g.target } : g);
        
        // AI scanning achievement check if scan
        let achievements = [...state.achievements];
        let xpGained = 0;
        let coinsBonus = 0;
        const scanBadge = achievements.find(a => a.id === '4');
        if (scanBadge && !scanBadge.unlockedAt) {
          scanBadge.unlockedAt = new Date().toISOString();
          xpGained += scanBadge.xpReward;
          coinsBonus += 15;
        }

        return { 
          meals, 
          goals, 
          achievements,
          profile: {
            ...state.profile,
            xp: state.profile.xp + xpGained,
            coins: state.profile.coins + coinsBonus,
            level: Math.floor((state.profile.xp + xpGained) / 500) + 1
          }
        };
      }),

      deleteMeal: (id) => set((state) => {
        const meals = state.meals.filter(m => m.id !== id);
        const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
        const goals = state.goals.map(g => g.category === 'diet' ? { ...g, current: totalCalories, completed: totalCalories >= g.target } : g);
        return { meals, goals };
      }),

      updateHeartRate: (bpm) => set({ heartRateBpm: bpm }),

      logSleep: (hours) => set({ sleepHours: hours }),

      startWorkout: (category) => set({
        activeWorkout: {
          inProgress: true,
          category,
          duration: 0,
          caloriesBurned: 0,
          exercises: []
        }
      }),

      updateWorkoutTimer: (seconds) => set((state) => {
        if (!state.activeWorkout) return {};
        // Roughly 8 calories burned per minute for cardio, 6 for strength
        const met = state.activeWorkout.category === 'Cardio' || state.activeWorkout.category === 'HIIT' ? 8 : 5;
        const caloriesBurned = Math.floor((seconds / 60) * met);
        return {
          activeWorkout: {
            ...state.activeWorkout,
            duration: seconds,
            caloriesBurned
          }
        };
      }),

      addExerciseToActiveWorkout: (name) => set((state) => {
        if (!state.activeWorkout) return {};
        const newExercise: ExerciseLog = {
          id: 'ex_' + Math.random().toString(36).substr(2, 9),
          name,
          sets: [{ reps: 10, weight: 20, completed: false }]
        };
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises: [...state.activeWorkout.exercises, newExercise]
          }
        };
      }),

      addSetToExercise: (exerciseIndex, reps, weight) => set((state) => {
        if (!state.activeWorkout) return {};
        const exercises = [...state.activeWorkout.exercises];
        exercises[exerciseIndex] = {
          ...exercises[exerciseIndex],
          sets: [...exercises[exerciseIndex].sets, { reps, weight, completed: false }]
        };
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises
          }
        };
      }),

      toggleSetCompleted: (exerciseIndex, setIndex) => set((state) => {
        if (!state.activeWorkout) return {};
        const exercises = [...state.activeWorkout.exercises];
        const exercise = exercises[exerciseIndex];
        const sets = [...exercise.sets];
        sets[setIndex] = { ...sets[setIndex], completed: !sets[setIndex].completed };
        exercises[exerciseIndex] = { ...exercise, sets };
        return {
          activeWorkout: {
            ...state.activeWorkout,
            exercises
          }
        };
      }),

      completeActiveWorkout: () => set((state) => {
        if (!state.activeWorkout) return {};
        
        const newWorkout: WorkoutLog = {
          id: 'w_' + Math.random().toString(36).substr(2, 9),
          category: state.activeWorkout.category,
          date: new Date().toLocaleDateString(),
          durationMinutes: Math.floor(state.activeWorkout.duration / 60) || 1,
          caloriesBurned: state.activeWorkout.caloriesBurned,
          exercises: state.activeWorkout.exercises
        };

        const workouts = [...state.workouts, newWorkout];
        
        // Give XP rewards: 10 XP per minute of workout, plus 50 completion bonus
        const xpGained = newWorkout.durationMinutes * 10 + 50;
        const coinsBonus = Math.floor(newWorkout.durationMinutes / 5) + 5;

        // Check Strength Workout Badge
        let achievements = [...state.achievements];
        const strengthBadge = achievements.find(a => a.id === '2');
        let badgeXp = 0;
        if (newWorkout.category === 'Strength' && strengthBadge && !strengthBadge.unlockedAt) {
          strengthBadge.unlockedAt = new Date().toISOString();
          badgeXp = strengthBadge.xpReward;
        }

        const totalXp = state.profile.xp + xpGained + badgeXp;
        const newLevel = Math.floor(totalXp / 500) + 1;

        return {
          workouts,
          activeWorkout: null,
          achievements,
          profile: {
            ...state.profile,
            xp: totalXp,
            coins: state.profile.coins + coinsBonus,
            level: newLevel
          }
        };
      }),

      cancelActiveWorkout: () => set({ activeWorkout: null }),

      addPost: (content, image) => set((state) => {
        const newPost: CommunityPost = {
          id: 'p_' + Math.random().toString(36).substr(2, 9),
          username: state.profile.name,
          avatar: state.profile.avatar,
          content,
          image,
          likes: 0,
          hasLiked: false,
          comments: [],
          time: 'Just now'
        };
        return {
          communityFeed: [newPost, ...state.communityFeed]
        };
      }),

      likePost: (postId) => set((state) => {
        const communityFeed = state.communityFeed.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
              hasLiked: !post.hasLiked
            };
          }
          return post;
        });
        return { communityFeed };
      }),

      commentPost: (postId, text) => set((state) => {
        const communityFeed = state.communityFeed.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [...post.comments, {
                id: 'comment_' + Math.random().toString(36).substr(2, 9),
                username: state.profile.name,
                text
              }]
            };
          }
          return post;
        });
        return { communityFeed };
      }),

      addChatMessage: (sender, text) => set((state) => ({
        chatHistory: [...state.chatHistory, {
          id: 'msg_' + Math.random().toString(36).substr(2, 9),
          sender,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      })),

      addXP: (amount) => set((state) => {
        const xp = state.profile.xp + amount;
        const level = Math.floor(xp / 500) + 1;
        return {
          profile: {
            ...state.profile,
            xp,
            level
          }
        };
      }),

      checkGoalProgression: () => {
        // Run updates checks
      }
    }),
    {
      name: 'future-fitness-storage',
      // skip hydration error by returning a promise or handling it on client
    }
  )
);
