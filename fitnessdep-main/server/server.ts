import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- AUTHENTICATION API ---
app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    // Simple password hashing mockup for reference (in production, use bcrypt or argon2)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: password, // Note: Use hashing in production!
        name,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        xp: 100,
        level: 1,
      },
    });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== password) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }
    res.status(200).json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- USER PROFILE API ---
app.get('/api/users/:userId', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.userId },
      include: { settings: true, goals: true },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/users/:userId', async (req: Request, res: Response) => {
  const { weight, height, targetWeight, name, gender, age } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.userId },
      data: { weight, height, targetWeight, name, gender, age },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- WORKOUT TRACKER API ---
app.get('/api/users/:userId/workouts', async (req: Request, res: Response) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: { userId: req.params.userId },
      include: { exercises: { include: { sets: true } } },
      orderBy: { date: 'desc' },
    });
    res.json(workouts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:userId/workouts', async (req: Request, res: Response) => {
  const { category, durationMinutes, caloriesBurned, exercises } = req.body;
  try {
    const workout = await prisma.workout.create({
      data: {
        userId: req.params.userId,
        category,
        durationMinutes,
        caloriesBurned,
        exercises: {
          create: exercises.map((ex: any) => ({
            name: ex.name,
            sets: {
              create: ex.sets.map((s: any) => ({
                reps: s.reps,
                weight: s.weight,
                completed: s.completed || false,
              })),
            },
          })),
        },
      },
      include: { exercises: { include: { sets: true } } },
    });
    // Add XP rewards for completing workout
    await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        xp: { increment: durationMinutes * 10 + 50 },
        coins: { increment: Math.floor(durationMinutes / 5) + 5 },
      },
    });
    res.status(201).json(workout);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- NUTRITION API ---
app.get('/api/users/:userId/meals', async (req: Request, res: Response) => {
  try {
    const meals = await prisma.meal.findMany({
      where: { userId: req.params.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(meals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:userId/meals', async (req: Request, res: Response) => {
  const { name, category, calories, protein, carbs, fat, sugar, fiber } = req.body;
  try {
    const meal = await prisma.meal.create({
      data: {
        userId: req.params.userId,
        name,
        category,
        calories,
        protein,
        carbs,
        fat,
        sugar,
        fiber,
      },
    });
    res.status(201).json(meal);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- WATER INTAKE TRACKER API ---
app.post('/api/users/:userId/water', async (req: Request, res: Response) => {
  const { amountMl } = req.body;
  try {
    const log = await prisma.waterIntake.create({
      data: {
        userId: req.params.userId,
        amountMl,
      },
    });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- AI NUTRITION SCANNER API (MOCK INTELLIGENCE) ---
app.post('/api/ai/scan-food', async (req: Request, res: Response) => {
  const { base64Image } = req.body;
  // This endpoint replicates an OpenAI Vision / custom food intelligence analyzer.
  // In production, integrate this with OpenAI API or Azure Vision models.
  setTimeout(() => {
    res.json({
      foodName: "Steak & Asparagus Platter",
      calories: 520,
      protein: 42,
      carbs: 12,
      fat: 26,
      sugar: 2,
      fiber: 4,
      vitamins: ["B12", "D3", "Iron", "Zinc"],
      confidence: 0.94,
    });
  }, 1500);
});

// --- AI COACH CONVERSATION API (MOCK ORB CHAT) ---
app.post('/api/ai/coach-reply', async (req: Request, res: Response) => {
  const { messageHistory, currentStats } = req.body;
  const userMsg = messageHistory[messageHistory.length - 1].text.toLowerCase();
  
  // Custom futuristic response algorithms
  let coachReply = "I am processing your biometric telemetry. ";
  if (userMsg.includes("workout") || userMsg.includes("exercise")) {
    coachReply += "Based on your active levels, I recommend a High Intensity Interval Training (HIIT) session for 20 minutes to optimize your metabolism, followed by a core stabilizer sequence.";
  } else if (userMsg.includes("hungry") || userMsg.includes("eat") || userMsg.includes("food")) {
    coachReply += "Your current macro distribution shows room for lean protein. Try a 200g Grilled Salmon with steamed asparagus to support protein synthesis and fat recovery.";
  } else if (userMsg.includes("sleep") || userMsg.includes("tired")) {
    coachReply += "Your stress index shows high telemetry. Please drink 250ml of chamomile/water and perform 5 minutes of deep breathing exercises. Optimize for a 7.5-hour sleep cycle tonight.";
  } else {
    coachReply += "Telemetry checks complete. Your vitals show optimized performance. Keep hydrating, focus on your step goals, and let me know if you would like me to program your next gym schedule!";
  }

  res.json({ reply: coachReply });
});

app.listen(PORT, () => {
  console.log(`[Futuristic Fitness Server] Running on http://localhost:${PORT}`);
});
