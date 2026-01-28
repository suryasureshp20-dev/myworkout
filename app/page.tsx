"use client";

import React, { useState, useRef } from "react";
import {
  Dumbbell,
  Shield,
  Wind,
  Droplets,
  Footprints,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Sun,
  Flame,
  Zap,
  Info,
  Timer,
  Sword, // Icon for Combat day
  Activity,
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

// --- DATA: ELITE ATHLETE FIX (FINAL VERSION) ---
const SCHEDULE: ScheduleData = {
  Monday: {
    title: "LEGS A",
    subtitle: "Max Velocity & Power",
    exercises: [
      {
        id: "m1",
        name: "Acceleration Sprints",
        sets: "6 Sets",
        reps: "20-30m",
        note: "Max start speed. Full rest (2m).",
      },
      {
        id: "m2",
        name: "Flying Sprints",
        sets: "4 Sets",
        reps: "20m Fly",
        note: "Build up 20m, then MAX speed 20m. Upright posture.",
      },
      {
        id: "m3",
        name: "Broad Jumps",
        sets: "4 Sets",
        reps: "3 Jumps",
        note: "Explosive reset. Quality over fatigue.",
      },
      {
        id: "m4",
        name: "Zercher Squats",
        sets: "5 Sets",
        reps: "3-5",
        note: "Bar in elbows. The Knee Anchor. PNS Safe.",
      },
      {
        id: "m5",
        name: "Trap Bar Deadlift",
        sets: "3 Sets",
        reps: "5",
        note: "Secondary lift. Clean reps only. No grinding.",
      },
    ],
  },
  Tuesday: {
    title: "PULL A",
    subtitle: "Width & Grip Integrity",
    exercises: [
      {
        id: "t1",
        name: "Scapular Pull-ups",
        sets: "3 Sets",
        reps: "10",
        note: "Straight arms. Pull shoulders down. Warmup.",
      },
      {
        id: "t2",
        name: "Weighted Pull-ups",
        sets: "4 Sets",
        reps: "5-8",
        note: "Vertical power. Full hang.",
      },
      {
        id: "t3",
        name: "1-Arm DB Row",
        sets: "4 Sets",
        reps: "8-12",
        note: "Hand on rack (not bench). Heavy lat work.",
      },
      {
        id: "t4",
        name: "Face Pulls",
        sets: "3 Sets",
        reps: "20",
        note: "Rear delts & Rotator cuff health.",
      },
      {
        id: "t5",
        name: "DB Farmer's Walks",
        sets: "6 Sets",
        reps: "30m",
        note: "Heavy. Stop BEFORE posture breaks. No slouching.",
      },
      {
        id: "t6",
        name: "Extensor Band Opens",
        sets: "3 Sets",
        reps: "30",
        note: "Finger extensions. Elbow health.",
      },
    ],
  },
  Wednesday: {
    title: "PUSH A",
    subtitle: "Shoulders (Scap Control)",
    exercises: [
      {
        id: "w1",
        name: "Landmine Press",
        sets: "5 Sets",
        reps: "3-5",
        note: "Explosive. Throw the weight (controlled).",
      },
      {
        id: "w2",
        name: "Standing Overhead Press",
        sets: "3 Sets",
        reps: "4-6",
        note: "Strict strength. Reduced volume for recovery.",
      },
      {
        id: "w3",
        name: "Weighted Push-ups",
        sets: "3 Sets",
        reps: "8-12",
        note: "Backpack or vest. Deep range of motion.",
      },
      {
        id: "w4",
        name: "Cable Y-Raises",
        sets: "3 Sets",
        reps: "12-15",
        note: "Lower traps. Arms straight in Y shape.",
      },
      {
        id: "w5",
        name: "Cable Lateral Raises",
        sets: "4 Sets",
        reps: "15-20",
        note: "Side delts. Constant tension.",
      },
    ],
  },
  Thursday: {
    title: "ENGINE",
    subtitle: "Zone 2 & Recovery (Standing)",
    exercises: [
      {
        id: "th1",
        name: "Zone 2 Incline Walk/Ruck",
        sets: "45 Mins",
        reps: "Steady",
        note: "Nasal breathing only. NO SITTING/BIKING.",
      },
      {
        id: "th2",
        name: "Dead Hangs",
        sets: "3 Sets",
        reps: "Max Time",
        note: "Spine decompression. Grip endurance.",
      },
      {
        id: "th3",
        name: "Mobility Flow",
        sets: "15 Mins",
        reps: "-",
        note: "Focus on hips, ankles, and T-spine.",
      },
    ],
  },
  Friday: {
    title: "LEGS B",
    subtitle: "Hinge & Conditioning Management",
    exercises: [
      {
        id: "f1",
        name: "Romanian Deadlifts",
        sets: "3 Sets",
        reps: "6-8",
        note: "Heavy hinge. Reduced volume for recovery.",
      },
      {
        id: "f2",
        name: "Cossack Squats",
        sets: "3 Sets",
        reps: "8/Side",
        note: "Lateral strength. Adductors. Knee health.",
      },
      {
        id: "f3",
        name: "Reverse Lunges",
        sets: "2 Sets",
        reps: "8/Leg",
        note: "Maintenance volume. Perfect form.",
      },
      {
        id: "f4",
        name: "Hill Sprints",
        sets: "6-8 Rounds",
        reps: "15s Sprint",
        note: "Max speed. Walk back rest. Don't grind slow reps.",
      },
      {
        id: "f5",
        name: "Tibialis Raises",
        sets: "3 Sets",
        reps: "25",
        note: "Shin armor for running.",
      },
    ],
  },
  Saturday: {
    title: "COMBAT",
    subtitle: "Upper, Neck & Rotation",
    exercises: [
      {
        id: "s1",
        name: "Standing Barbell Row",
        sets: "4 Sets",
        reps: "6-10",
        note: "Thick back. Brace core hard.",
      },
      {
        id: "s2",
        name: "Incline DB Press",
        sets: "4 Sets",
        reps: "8-12",
        note: "Upper Chest. ⚠️ Towel under lumbar for safety.",
      },
      {
        id: "s3",
        name: "Suitcase Carries",
        sets: "4 Sets",
        reps: "30m/Side",
        note: "Anti-lateral flexion. Walk perfectly straight.",
      },
      {
        id: "s4",
        name: "Rotational Cable Chops",
        sets: "6 Sets",
        reps: "3/Side",
        note: "EXPLOSIVE power. Hip drive. Full rest.",
      },
      {
        id: "s5",
        name: "Standing Neck Training",
        sets: "3 Sets",
        reps: "15-20",
        note: "4-Way with Hand/Band. NO FLOOR WORK.",
      },
      {
        id: "s6",
        name: "Plate Pinches (Timed)",
        sets: "4 Sets",
        reps: "15s",
        note: "Stop 1s before failure. Quality holds.",
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
        sets: "1 Sess",
        reps: "10k Steps",
        note: "Flush the system. Mental reset.",
      },
    ],
  },
};

// --- DATA: MORNING RITUAL (Every Day) ---
const MORNING_RITUAL: Exercise[] = [
  {
    id: "mr1",
    name: "Fingertip Plank",
    sets: "3 Sets",
    reps: "Failure",
    note: "Toji Claw Strength. Do immediately after waking.",
  },
  {
    id: "mr2",
    name: "Sink Decompression",
    sets: "2 Mins",
    reps: "Hold",
    note: "Hold sink edge, lean back, decompress spine.",
  },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// --- Animation ---
const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVar: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

// --- Sub-Components ---
const ExerciseCard = ({
  ex,
  isCompleted,
  onToggle,
  icon,
}: {
  ex: Exercise;
  isCompleted: boolean;
  onToggle: () => void;
  icon?: React.ReactNode;
}) => {
  // Logic to open YouTube search
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents checking off the item
    const searchQuery = encodeURIComponent(`${ex.name} proper form`);
    window.open(
      `https://www.youtube.com/results?search_query=${searchQuery}`,
      "_blank",
    );
  };

  return (
    <motion.div
      variants={itemVar}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        if (typeof navigator !== "undefined" && navigator.vibrate)
          navigator.vibrate(50);
        onToggle();
      }}
      className={cn(
        "relative border p-4 rounded-2xl flex flex-row items-center gap-4 transition-all cursor-pointer backdrop-blur-md active:opacity-80",
        isCompleted
          ? "bg-green-950/30 border-green-500/50"
          : "bg-slate-900/60 border-slate-800",
      )}
    >
      {/* Check Circle */}
      <div
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
          isCompleted
            ? "border-green-500 bg-green-500 text-slate-950"
            : "border-slate-600 text-transparent",
        )}
      >
        <CheckCircle2 size={16} strokeWidth={4} />
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 overflow-hidden">
            <h3
              className={cn(
                "text-base font-bold font-oswald tracking-wide truncate",
                isCompleted
                  ? "text-green-500/70 line-through"
                  : "text-slate-100",
              )}
            >
              {ex.name}
            </h3>

            {/* THE INFO BUTTON */}
            <button
              onClick={handleInfoClick}
              className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 active:scale-90 transition-all flex-shrink-0"
            >
              <Info size={14} />
            </button>
          </div>
          {icon && <div className="text-slate-500">{icon}</div>}
        </div>

        <p
          className={cn(
            "text-xs truncate font-roboto mt-0.5",
            isCompleted ? "text-green-500/40" : "text-slate-400",
          )}
        >
          {ex.note}
        </p>
      </div>

      {/* Stats Pill */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span
          className={cn(
            "text-lg font-bold font-oswald leading-none",
            isCompleted ? "text-green-500" : "text-white",
          )}
        >
          {ex.reps}
        </span>
        <span
          className={cn(
            "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
            isCompleted
              ? "bg-green-500 text-green-950"
              : "bg-slate-800 text-slate-400",
          )}
        >
          {ex.sets}
        </span>
      </div>
    </motion.div>
  );
};

// --- Rules Section ---
const RulesSection = ({ onBack }: { onBack: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
    <button
      onClick={onBack}
      className="flex items-center text-sm text-slate-400 mb-4 font-bold font-oswald"
    >
      <ChevronRight className="rotate-180 mr-1" size={16} /> BACK TO WORKOUT
    </button>
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-red-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Footprints size={18} className="text-red-500" /> STANDING MANDATE
      </h3>
      <p className="text-sm text-slate-400 mt-2">
        Never sit in the gym. If an exercise can be done standing, stand.
      </p>
    </div>
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-green-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Droplets size={18} className="text-green-500" /> HYGIENE
      </h3>
      <p className="text-sm text-slate-400 mt-2">
        Medimix soap on tailbone. Cool dry immediately.
      </p>
    </div>
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-blue-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Zap size={18} className="text-blue-500" /> PROTOCOL
      </h3>
      <p className="text-sm text-slate-400 mt-2">
        Elite Athlete Fix: Max Velocity, Rotational Power, & Incline Press
        (Modified).
      </p>
    </div>
  </motion.div>
);

// --- Main Component ---
export default function Home() {
  const [currentDay, setCurrentDay] = useState<string>("Monday");
  const [view, setView] = useState<"workout" | "rules">("workout");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // 1. Create a reference to the Gym Section
  const gymSectionRef = useRef<HTMLDivElement>(null);

  const activeGym = SCHEDULE[currentDay];

  // Combine for total tracking
  const allExercises = [...MORNING_RITUAL, ...activeGym.exercises];
  const doneCount = allExercises.filter((ex) => completed[ex.id]).length;
  const progress = (doneCount / allExercises.length) * 100;

  const toggle = (id: string) =>
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

  // 2. Function to handle Day Click + Scroll
  const handleDayChange = (day: string) => {
    setCurrentDay(day);
    // Slight delay to allow animation to start, then scroll
    setTimeout(() => {
      gymSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen font-roboto text-slate-200 bg-slate-950 selection:bg-green-500/30">
      <div className="h-safe-top w-full bg-slate-950" />

      {/* Header */}
      <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <Dumbbell className="text-green-500 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-oswald leading-none text-white">
                SORCERER
              </h1>
              <p className="text-[9px] text-green-500 font-bold tracking-[0.2em] uppercase">
                Elite Protocol
              </p>
            </div>
          </div>
          <button
            onClick={() => setView(view === "rules" ? "workout" : "rules")}
            className={cn(
              "p-2 rounded-full border transition-all",
              view === "rules"
                ? "border-green-500 bg-green-900/20 text-green-500"
                : "border-slate-800 bg-slate-900 text-slate-400",
            )}
          >
            <Shield size={18} />
          </button>
        </div>

        {view === "workout" && (
          <div className="h-1 bg-slate-900 w-full">
            <motion.div
              className="h-full bg-green-500 shadow-[0_0_10px_#22c55e]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      <main className="px-4 pb-32 pt-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {view === "rules" ? (
            <RulesSection onBack={() => setView("workout")} />
          ) : (
            <motion.div
              key="workout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Day Selector */}
              <div className="flex overflow-x-auto gap-2 pb-4 mb-2 no-scrollbar sticky top-[65px] z-40 bg-slate-950/95 py-2 -mx-4 px-4 backdrop-blur-xl">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDayChange(day)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold font-oswald tracking-wide flex-shrink-0 border transition-all",
                      currentDay === day
                        ? "bg-green-500 text-black border-green-500 shadow-lg shadow-green-900/20"
                        : "bg-slate-900 text-slate-500 border-slate-800",
                    )}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                {/* 1. MORNING RITUAL */}
                <motion.section
                  variants={containerVar}
                  initial="hidden"
                  animate="show"
                >
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <Sun size={14} className="text-orange-400" />
                    <h2 className="text-xs font-bold font-oswald text-slate-400 uppercase tracking-widest">
                      Every Morning
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {MORNING_RITUAL.map((ex) => (
                      <ExerciseCard
                        key={ex.id}
                        ex={ex}
                        isCompleted={!!completed[ex.id]}
                        onToggle={() => toggle(ex.id)}
                      />
                    ))}
                  </div>
                </motion.section>

                {/* 2. GYM SESSION */}
                <motion.section
                  ref={gymSectionRef}
                  key={currentDay}
                  variants={containerVar}
                  initial="hidden"
                  animate="show"
                  className="scroll-mt-32"
                >
                  <div className="flex items-center justify-between mb-3 px-1 pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2">
                      {/* Dynamic Icons */}
                      {currentDay === "Thursday" ? (
                        <Timer size={14} className="text-blue-400" />
                      ) : currentDay === "Saturday" ? (
                        <Sword size={14} className="text-blue-400" />
                      ) : (
                        <Dumbbell size={14} className="text-blue-400" />
                      )}
                      <h2 className="text-xs font-bold font-oswald text-slate-400 uppercase tracking-widest">
                        {currentDay.toUpperCase()} Session
                      </h2>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {activeGym.title}
                    </span>
                  </div>

                  <div className="mb-4 px-1 flex items-center gap-2">
                    <Flame size={12} className="text-red-500" />
                    <span className="text-xs font-bold text-green-500 uppercase tracking-wide">
                      FOCUS: {activeGym.subtitle}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeGym.exercises.map((ex) => (
                      <ExerciseCard
                        key={ex.id}
                        ex={ex}
                        isCompleted={!!completed[ex.id]}
                        onToggle={() => toggle(ex.id)}
                      />
                    ))}
                  </div>
                </motion.section>

                {/* 3. RECOVERY */}
                <div className="pt-6 border-t border-slate-800/50">
                  <h3 className="text-center text-[10px] font-bold font-oswald text-slate-500 uppercase tracking-[0.2em] mb-4">
                    Recovery Protocol
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center gap-2">
                      <Droplets size={16} className="text-green-500" />
                      <span className="text-[10px] text-slate-400 font-bold">
                        MEDIMIX SOAP
                      </span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center gap-2">
                      <Wind size={16} className="text-blue-400" />
                      <span className="text-[10px] text-slate-400 font-bold">
                        COOL DRY
                      </span>
                    </div>
                  </div>
                </div>

                {doneCount === allExercises.length && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
                  >
                    <Trophy className="mx-auto text-green-500 mb-2" size={24} />
                    <h3 className="font-oswald font-bold text-white text-lg">
                      ALL CLEAR
                    </h3>
                    <p className="text-xs text-green-400">
                      Recovery started. Good work.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 w-full bg-slate-950/90 border-t border-slate-800 backdrop-blur-lg pb-6 pt-3 px-6 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center text-[10px] font-bold font-oswald tracking-widest text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-green-600" /> PNS SAFE
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-green-600" /> NO SITTING
          </div>
        </div>
      </footer>
    </div>
  );
}
