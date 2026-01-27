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
  CheckCircle,
  ChevronRight,
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
    subtitle: "Chest & Triceps Focus",
    exercises: [
      {
        name: "Incline DB Press (30°)",
        sets: "3 Sets",
        reps: "10-12",
        note: "Upper Chest Armor. Keep slight arch.",
      },
      {
        name: "Standing Overhead DB Press",
        sets: "3 Sets",
        reps: "10",
        note: "Volume work. Strict form.",
      },
      {
        name: "Dips (Leaning Forward)",
        sets: "3 Sets",
        reps: "Failure",
        note: "Lower Chest & Power.",
      },
      {
        name: "Cable Lateral Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "The Cap. Constant tension.",
      },
      {
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
        name: "Pull-ups (Wide Grip)",
        sets: "4 Sets",
        reps: "Failure",
        note: "Focus on Lats. Use assist.",
      },
      {
        name: "Lat Pulldowns",
        sets: "3 Sets",
        reps: "10-12",
        note: "⚠️ Sit on edge/hover for PNS safety.",
      },
      {
        name: "Face Pulls",
        sets: "3 Sets",
        reps: "15-20",
        note: "Rear Delts & Posture.",
      },
      {
        name: "Hammer Curls",
        sets: "3 Sets",
        reps: "10-12",
        note: "Forearm thickness.",
      },
      {
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
        name: "Goblet Squats",
        sets: "3 Sets",
        reps: "12-15",
        note: "⚠️ Stop at parallel. Torso vertical.",
      },
      {
        name: "Walking Lunges",
        sets: "3 Sets",
        reps: "20 Steps",
        note: "Total steps. Control the knee.",
      },
      {
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Full stretch at bottom.",
      },
      {
        name: "Hanging Knee Raises",
        sets: "3 Sets",
        reps: "15",
        note: "Abs. Zero tailbone pressure.",
      },
    ],
  },
  Thursday: {
    title: "PUSH B",
    subtitle: "Shoulder & Power Focus",
    exercises: [
      {
        name: "Standing Barbell OHP",
        sets: "3 Sets",
        reps: "5-8",
        note: "👑 The King. Lift Heavy. Squeeze glutes.",
      },
      {
        name: "Flat DB Bench Press",
        sets: "3 Sets",
        reps: "10",
        note: "⚠️ Use thick towel. Stop if discomfort.",
      },
      {
        name: "Cable Lateral Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Hit side delts again.",
      },
      {
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
        name: "Standing Barbell Row",
        sets: "3 Sets",
        reps: "8-10",
        note: "Thickness. Keep spine neutral.",
      },
      {
        name: "Chin-ups (Underhand)",
        sets: "3 Sets",
        reps: "Failure",
        note: "Biceps & Lats.",
      },
      {
        name: "Dumbbell Shrugs",
        sets: "3 Sets",
        reps: "15",
        note: "Traps. Hold 2s at top.",
      },
      {
        name: "Barbell Bicep Curls",
        sets: "3 Sets",
        reps: "10-12",
        note: "Bicep Peak.",
      },
      {
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
        name: "Romanian Deadlifts (DB)",
        sets: "3 Sets",
        reps: "10",
        note: "Push hips back. Stop at mid-shin.",
      },
      {
        name: "Step-Ups (Weighted)",
        sets: "3 Sets",
        reps: "10/Leg",
        note: "Unilateral strength.",
      },
      {
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Don't bounce.",
      },
      {
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
        name: "Walk Outside",
        sets: "1 Session",
        reps: "8k",
        note: "Keep blood moving. No gym.",
      },
      {
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
    transition: { staggerChildren: 0.1 },
  },
};

const itemVar: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 } as const,
  },
};

// --- Components ---

const ExerciseCard = ({ ex }: { ex: Exercise }) => {
  return (
    <motion.div
      variants={itemVar}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden bg-slate-900/40 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:border-green-500/50 hover:bg-slate-800/60 transition-colors cursor-pointer backdrop-blur-sm"
    >
      {/* Decorative Glow on Hover */}
      <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex-1 relative z-10">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-green-400 transition-colors font-oswald tracking-wide flex items-center gap-2">
          {ex.name}
        </h3>
        <p className="text-slate-400 text-xs mt-1.5 flex items-start leading-relaxed font-roboto">
          <AlertTriangle
            size={12}
            className="text-yellow-500 mr-1.5 mt-0.5 flex-shrink-0"
          />
          {ex.note}
        </p>
      </div>

      <div className="relative z-10 w-full sm:w-auto mt-4 sm:mt-0 flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end pl-0 sm:pl-6 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
        <div className="text-2xl font-bold text-white font-oswald tabular-nums tracking-tight">
          {ex.reps}
        </div>
        <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded-full">
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
        className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
      >
        <ChevronRight className="rotate-180" />
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
          bg: "border-red-500/50",
          text: "If an exercise can be done standing, you MUST stand. Avoid sitting on gym benches at all costs to protect the sinus.",
        },
        {
          title: "HYGIENE PROTOCOL",
          icon: Droplets,
          color: "text-green-500",
          bg: "border-green-500/50",
          text: "1. Shower immediately.\n2. Use Medimix (Green) soap on tailbone.\n3. Dry completely using a COOL hairdryer.",
        },
        {
          title: "NUTRITION",
          icon: Utensils,
          color: "text-blue-500",
          bg: "border-blue-500/50",
          text: "• Protein: 1.8g per kg (Paneer, Soya, Eggs)\n• Creatine: 5g daily\n• Water: 4 Liters minimum",
        },
      ].map((rule, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn(
            "bg-slate-900/60 p-6 rounded-2xl border-l-4 shadow-xl backdrop-blur-md",
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
  const activeData = SCHEDULE[currentDay];

  // Auto-scroll to active day tab
  const tabsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Basic logic to scroll active tab into view if needed
  }, [currentDay]);

  return (
    <div className="min-h-screen font-roboto text-slate-200 relative">
      <div className="fog-layer" />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-slate-950/80 border-b border-slate-800/50 p-4 sticky top-0 z-50 backdrop-blur-xl"
      >
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-2 rounded-xl border border-slate-700 shadow-lg shadow-black/50">
              <Dumbbell className="text-green-500 w-6 h-6 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
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
                className="flex overflow-x-auto space-x-1.5 mb-8 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
              >
                {DAYS.map((day) => {
                  const isActive = currentDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setCurrentDay(day)}
                      className={cn(
                        "relative px-4 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors whitespace-nowrap z-10",
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
                    className="flex items-center text-green-500 font-bold uppercase tracking-wide text-xs"
                  >
                    <Activity size={14} className="mr-2" />
                    {activeData.subtitle}
                  </motion.div>
                </div>

                {/* Exercise List */}
                <div className="space-y-3">
                  {activeData.exercises.map((ex, index) => (
                    <ExerciseCard key={ex.name + index} ex={ex} />
                  ))}
                </div>

                {/* Recovery Check (Glass) */}
                <motion.div
                  variants={itemVar}
                  className="mt-8 pt-6 border-t border-slate-800/50"
                >
                  <h3 className="text-slate-500 text-[10px] font-bold uppercase mb-4 font-oswald tracking-[0.2em] text-center">
                    Post-Workout Recovery
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/40 border border-slate-800 hover:border-green-500/30 transition-colors p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 backdrop-blur-sm group">
                      <div className="p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                        <Droplets size={20} className="text-green-500" />
                      </div>
                      <span className="text-xs text-slate-300 font-bold">
                        Medimix Soap
                      </span>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 hover:border-blue-500/30 transition-colors p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 backdrop-blur-sm group">
                      <div className="p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                        <Wind size={20} className="text-blue-400" />
                      </div>
                      <span className="text-xs text-slate-300 font-bold">
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
      <footer className="fixed bottom-0 w-full z-40">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent h-24 pointer-events-none" />
        <div className="relative max-w-md mx-auto p-4 flex justify-between items-center text-[10px] font-oswald tracking-widest text-slate-500 pb-6">
          <div className="flex items-center gap-1.5">
            <CheckCircle size={12} className="text-green-900" />
            <span>PNS SAFE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={12} className="text-green-900" />
            <span>NO SITTING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
