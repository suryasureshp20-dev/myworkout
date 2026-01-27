"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Dumbbell,
  Shield,
  AlertTriangle,
  Wind,
  Droplets,
  Utensils,
  Footprints,
  Activity,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  note: string;
}

interface DaySchedule {
  title: string;
  subtitle: string;
  exercises: Exercise[];
}

type ScheduleData = {
  [key: string]: DaySchedule;
};

// --- Data ---
const SCHEDULE: ScheduleData = {
  Monday: {
    title: "PUSH A",
    subtitle: "Shoulder & Upper Chest Focus",
    exercises: [
      {
        id: "m1",
        name: "Standing Overhead Press (Barbell)",
        sets: "3 Sets",
        reps: "8-10",
        note: "The King. Clear the chin. Core tight.",
      },
      {
        id: "m2",
        name: "Incline DB Press (30°)",
        sets: "3 Sets",
        reps: "10-12",
        note: "Upper Chest Armor. Keep slight arch.",
      },
      {
        id: "m3",
        name: "Dips (Leaning Forward)",
        sets: "3 Sets",
        reps: "Failure",
        note: "Lower Chest & Power. Elbows tucked.",
      },
      {
        id: "m4",
        name: "Cable Lateral Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "The Cap. Constant tension.",
      },
      {
        id: "m5",
        name: "Tricep Pushdowns",
        sets: "3 Sets",
        reps: "12-15",
        note: "Use Rope attachment.",
      },
    ],
  },
  Tuesday: {
    title: "PULL A",
    subtitle: "Width & Grip Focus",
    exercises: [
      {
        id: "t1",
        name: "Pull-ups (Wide Grip)",
        sets: "4 Sets",
        reps: "Failure",
        note: "Focus on Lats. Use assist if needed.",
      },
      {
        id: "t2",
        name: "Lat Pulldowns",
        sets: "3 Sets",
        reps: "10-12",
        note: "⚠️ Sit on edge/hover for PNS safety.",
      },
      {
        id: "t3",
        name: "Face Pulls",
        sets: "3 Sets",
        reps: "15-20",
        note: "Rear Delts & Posture.",
      },
      {
        id: "t4",
        name: "Hammer Curls",
        sets: "3 Sets",
        reps: "10-12",
        note: "Forearm thickness.",
      },
      {
        id: "t5",
        name: "Hand Gripper",
        sets: "3 Sets",
        reps: "Max",
        note: "Do this between sets.",
      },
    ],
  },
  Wednesday: {
    title: "LEGS A",
    subtitle: "Squat Pattern",
    exercises: [
      {
        id: "w1",
        name: "Goblet Squats",
        sets: "3 Sets",
        reps: "12-15",
        note: "⚠️ Stop at parallel. Torso vertical.",
      },
      {
        id: "w2",
        name: "Walking Lunges",
        sets: "3 Sets",
        reps: "20 Steps",
        note: "Total steps. Control the knee.",
      },
      {
        id: "w3",
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Full stretch at bottom.",
      },
      {
        id: "w4",
        name: "Hanging Knee Raises",
        sets: "3 Sets",
        reps: "15",
        note: "Abs. Zero tailbone pressure.",
      },
    ],
  },
  Thursday: {
    title: "PUSH B",
    subtitle: "Power & Triceps Focus",
    exercises: [
      {
        id: "th1",
        name: "Standing Barbell OHP",
        sets: "3 Sets",
        reps: "5-8",
        note: "Lift Heavy. Squeeze glutes.",
      },
      {
        id: "th2",
        name: "Flat DB Bench Press",
        sets: "3 Sets",
        reps: "10",
        note: "⚠️ Use thick towel. Stop if discomfort.",
      },
      {
        id: "th3",
        name: "Cable Lateral Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Hit side delts again.",
      },
      {
        id: "th4",
        name: "Skullcrushers (EZ Bar)",
        sets: "3 Sets",
        reps: "12",
        note: "Tricep Mass.",
      },
    ],
  },
  Friday: {
    title: "PULL B",
    subtitle: "Thickness & Traps Focus",
    exercises: [
      {
        id: "f1",
        name: "Standing Barbell Row",
        sets: "3 Sets",
        reps: "8-10",
        note: "Thickness. Keep spine neutral.",
      },
      {
        id: "f2",
        name: "Chin-ups (Underhand)",
        sets: "3 Sets",
        reps: "Failure",
        note: "Biceps & Lats.",
      },
      {
        id: "f3",
        name: "Dumbbell Shrugs",
        sets: "3 Sets",
        reps: "15",
        note: "Traps. Hold 2s at top.",
      },
      {
        id: "f4",
        name: "Barbell Bicep Curls",
        sets: "3 Sets",
        reps: "10-12",
        note: "Bicep Peak.",
      },
      {
        id: "f5",
        name: "Hand Gripper",
        sets: "3 Sets",
        reps: "Max",
        note: "Finish strong.",
      },
    ],
  },
  Saturday: {
    title: "LEGS B",
    subtitle: "Hinge Pattern",
    exercises: [
      {
        id: "s1",
        name: "Romanian Deadlifts (DB)",
        sets: "3 Sets",
        reps: "10",
        note: "Push hips back. Stop at mid-shin.",
      },
      {
        id: "s2",
        name: "Step-Ups (Weighted)",
        sets: "3 Sets",
        reps: "10/Leg",
        note: "Unilateral strength.",
      },
      {
        id: "s3",
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Don't bounce.",
      },
      {
        id: "s4",
        name: "Plank (High Position)",
        sets: "3 Sets",
        reps: "60s",
        note: "Core stability. No crunches.",
      },
    ],
  },
  Sunday: {
    title: "REST",
    subtitle: "Active Recovery",
    exercises: [
      {
        id: "su1",
        name: "Walk Outside",
        sets: "1 Session",
        reps: "8k",
        note: "Keep blood moving. No gym.",
      },
      {
        id: "su2",
        name: "Mobility",
        sets: "10 Mins",
        reps: "-",
        note: "Light stretching only.",
      },
    ],
  },
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// --- Animation Variants ---
const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 250, damping: 20 },
  },
};

// --- Components ---

const ExerciseCard = ({
  ex,
  isCompleted,
  onToggle,
}: {
  ex: Exercise;
  isCompleted: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      variants={itemVar}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={cn(
        "relative overflow-hidden border p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all cursor-pointer backdrop-blur-md",
        isCompleted
          ? "bg-green-950/20 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          : "bg-slate-900/40 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60",
      )}
    >
      {/* Decorative Glow on Hover/Active */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity pointer-events-none duration-500",
          isCompleted
            ? "bg-green-500/5 opacity-100"
            : "bg-white/5 opacity-0 group-hover:opacity-100",
        )}
      />

      <div className="flex-1 relative z-10 pr-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
              isCompleted
                ? "border-green-500 bg-green-500 text-slate-950"
                : "border-slate-600 text-transparent",
            )}
          >
            <CheckCircle2 size={14} strokeWidth={4} />
          </div>
          <h3
            className={cn(
              "text-lg font-bold transition-all font-oswald tracking-wide",
              isCompleted
                ? "text-green-500/70 line-through decoration-2 decoration-green-500/50"
                : "text-slate-100",
            )}
          >
            {ex.name}
          </h3>
        </div>

        <p
          className={cn(
            "text-xs mt-2 flex items-start leading-relaxed font-roboto ml-9 transition-colors",
            isCompleted ? "text-green-500/40" : "text-slate-400",
          )}
        >
          {!isCompleted && (
            <AlertTriangle
              size={12}
              className="text-yellow-500 mr-1.5 mt-0.5 flex-shrink-0"
            />
          )}
          {ex.note}
        </p>
      </div>

      <div className="relative z-10 w-full sm:w-auto mt-4 sm:mt-0 flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end pl-0 sm:pl-6 border-t sm:border-t-0 border-slate-800/50 pt-3 sm:pt-0">
        <div
          className={cn(
            "text-2xl font-bold font-oswald tabular-nums tracking-tight transition-colors",
            isCompleted ? "text-green-500" : "text-white",
          )}
        >
          {ex.reps}
        </div>
        <div
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors",
            isCompleted
              ? "text-green-900 bg-green-500"
              : "text-green-500 bg-green-500/10",
          )}
        >
          {ex.sets}
        </div>
      </div>
    </motion.div>
  );
};

const RulesSection = ({ onBack }: { onBack: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
    className="space-y-6 pb-24"
  >
    <div className="flex items-center gap-3 mb-8">
      <button
        onClick={onBack}
        className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition group"
      >
        <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" />
      </button>
      <h2 className="text-3xl font-bold text-white font-oswald tracking-wide">
        THE IRON RULES
      </h2>
    </div>

    <div className="grid gap-4">
      {[
        {
          title: "THE STANDING MANDATE",
          icon: Footprints,
          color: "text-red-500",
          bg: "border-red-500/20 bg-red-950/10",
          text: "If an exercise can be done standing, you MUST stand. Avoid sitting on gym benches at all costs to protect the sinus.",
        },
        {
          title: "HYGIENE PROTOCOL",
          icon: Droplets,
          color: "text-green-500",
          bg: "border-green-500/20 bg-green-950/10",
          text: "1. Shower immediately.\n2. Use Medimix (Green) soap on tailbone.\n3. Dry completely using a COOL hairdryer.",
        },
        {
          title: "NUTRITION",
          icon: Utensils,
          color: "text-blue-500",
          bg: "border-blue-500/20 bg-blue-950/10",
          text: "• Protein: 1.8g per kg (Paneer, Soya, Eggs)\n• Creatine: 5g daily\n• Water: 4 Liters minimum",
        },
      ].map((rule, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "p-6 rounded-2xl border-l-4 shadow-lg backdrop-blur-md",
            rule.bg,
          )}
        >
          <h3 className="text-white font-bold text-lg mb-3 flex items-center font-oswald tracking-wide">
            <rule.icon className={cn("mr-3", rule.color)} size={20} />
            {rule.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line font-roboto">
            {rule.text}
          </p>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// --- Main Page Component ---

export default function Home() {
  const [currentDay, setCurrentDay] = useState<string>("Monday");
  const [view, setView] = useState<"workout" | "rules">("workout");

  // State for tracked exercises
  const [completedExercises, setCompletedExercises] = useState<
    Record<string, boolean>
  >({});

  const activeData = SCHEDULE[currentDay];

  // Progress Calculation
  const totalExercises = activeData.exercises.length;
  const completedCount = activeData.exercises.filter(
    (ex) => completedExercises[ex.id],
  ).length;
  const progressPercentage = (completedCount / totalExercises) * 100;

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen font-roboto text-slate-200 relative selection:bg-green-500/30 selection:text-green-200">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05),transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-slate-950/80 border-b border-slate-800/50 pt-4 pb-0 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-md mx-auto px-4 sm:px-6 flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl border border-slate-700 shadow-lg shadow-black/50 group">
              <Dumbbell className="text-green-500 w-6 h-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-wider text-white font-oswald leading-none">
                SORCERER
              </h1>
              <span className="text-[10px] text-green-500 font-bold tracking-[0.25em] font-oswald uppercase opacity-80 mt-1">
                Killer Protocol
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setView(view === "rules" ? "workout" : "rules")}
            className={cn(
              "p-2.5 rounded-full transition-all border",
              view === "rules"
                ? "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                : "bg-slate-800/50 border-transparent text-slate-400 hover:text-white",
            )}
          >
            <Shield
              className="w-5 h-5"
              fill={view === "rules" ? "currentColor" : "none"}
            />
          </motion.button>
        </div>

        {/* Live Progress Line */}
        {view === "workout" && (
          <div className="h-1 w-full bg-slate-800 relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        )}
      </motion.header>

      {/* Main Content */}
      <main className="max-w-md mx-auto w-full p-4 sm:p-6 pb-28">
        <AnimatePresence mode="wait">
          {view === "rules" ? (
            <RulesSection key="rules" onBack={() => setView("workout")} />
          ) : (
            <motion.div
              key="workout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* iOS Style Day Selector */}
              <div
                ref={tabsRef}
                className="flex overflow-x-auto space-x-1.5 mb-8 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
              >
                {DAYS.map((day) => {
                  const isActive = currentDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setCurrentDay(day)}
                      className={cn(
                        "relative px-4 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors whitespace-nowrap z-10 flex-shrink-0",
                        isActive
                          ? "text-slate-950"
                          : "text-slate-500 hover:text-slate-300",
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-green-500 rounded-full z-[-1] shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.6,
                          }}
                        />
                      )}
                      {day.substring(0, 3)}
                    </button>
                  );
                })}
              </div>

              {/* Workout Cards */}
              <motion.div
                key={currentDay}
                variants={containerVar}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {/* Day Header */}
                <div className="flex flex-col gap-1">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold text-white font-oswald tracking-tight drop-shadow-md"
                  >
                    {activeData.title}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between text-green-500 font-bold uppercase tracking-wide text-xs"
                  >
                    <div className="flex items-center">
                      <Activity size={14} className="mr-2" />
                      {activeData.subtitle}
                    </div>

                    {/* Progress Badge */}
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded border transition-all",
                        completedCount === totalExercises
                          ? "bg-green-500 text-slate-950 border-green-500 animate-pulse"
                          : "bg-slate-900 border-slate-800 text-slate-400",
                      )}
                    >
                      {completedCount} / {totalExercises} DONE
                    </div>
                  </motion.div>
                </div>

                {/* Exercise List */}
                <div className="space-y-3">
                  {activeData.exercises.map((ex, index) => (
                    <ExerciseCard
                      key={ex.id}
                      ex={ex}
                      isCompleted={!!completedExercises[ex.id]}
                      onToggle={() => toggleExercise(ex.id)}
                    />
                  ))}
                </div>

                {/* Completion Celebration Message */}
                {completedCount === totalExercises && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-center"
                  >
                    <Trophy className="mx-auto text-green-500 mb-2 w-8 h-8" />
                    <h3 className="text-white font-oswald text-xl uppercase">
                      Protocol Complete
                    </h3>
                    <p className="text-green-500/80 text-xs">
                      Recover well. See you tomorrow.
                    </p>
                  </motion.div>
                )}

                {/* Recovery Check (Glass) */}
                <motion.div
                  variants={itemVar}
                  className="mt-8 pt-6 border-t border-slate-800/50"
                >
                  <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-4 font-oswald tracking-[0.2em] text-center flex items-center justify-center gap-2">
                    <Zap size={10} /> Recovery Protocol <Zap size={10} />
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/40 border border-slate-800 hover:border-green-500/30 transition-colors p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 backdrop-blur-sm group">
                      <div className="p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                        <Droplets size={20} className="text-green-500" />
                      </div>
                      <span className="text-xs text-slate-300 font-bold group-hover:text-green-400 transition-colors">
                        Medimix Soap
                      </span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 hover:border-blue-500/30 transition-colors p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 backdrop-blur-sm group">
                      <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                        <Wind size={20} className="text-blue-400" />
                      </div>
                      <span className="text-xs text-slate-300 font-bold group-hover:text-blue-400 transition-colors">
                        Cool Hairdryer
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 w-full z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent h-28" />
        <div className="relative max-w-md mx-auto p-4 flex justify-between items-center text-[10px] font-oswald tracking-widest text-slate-500 pb-6 pt-10">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 backdrop-blur">
            <CheckCircle2 size={12} className="text-green-500" />
            <span className="text-slate-300">PNS SAFE</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 backdrop-blur">
            <CheckCircle2 size={12} className="text-green-500" />
            <span className="text-slate-300">NO SITTING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
