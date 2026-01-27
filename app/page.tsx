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

// --- DATA: GOD MODE PROTOCOL (10/10) ---
const SCHEDULE: ScheduleData = {
  Monday: {
    title: "PUSH A",
    subtitle: "Explosive Shoulders + V-Taper (PNS-SAFE)",
    exercises: [
      {
        id: "m1",
        name: "Landmine Press",
        sets: "5 Sets",
        reps: "3-5",
        note: "Explosive reps. Full reset each rep. Stop 1-2 reps before failure (RIR 1-2).",
      },
      {
        id: "m2",
        name: "Standing Overhead Press",
        sets: "4 Sets",
        reps: "4-6",
        note: "Heavy strength. Brace hard. No backbend. RIR 1-2.",
      },
      {
        id: "m3",
        name: "Backpack Push-ups (Weighted)",
        sets: "4 Sets",
        reps: "6-12",
        note: "Tight backpack. Hands on DB handles/hex DBs for deeper ROM if possible. RIR 1-2.",
      },
      {
        id: "m4",
        name: "Cable Lateral Raises",
        sets: "4 Sets",
        reps: "12-20",
        note: "Pure delts. 2s control down. No swing. Last set can be near-failure.",
      },
      {
        id: "m5",
        name: "Scap Push-ups / Serratus Push-up Plus",
        sets: "3 Sets",
        reps: "12-20",
        note: "Shoulder armor. Protract hard at top. Keep ribs down.",
      },
    ],
  },

  Tuesday: {
    title: "PULL A",
    subtitle: "Back Width + Grip (PNS-SAFE)",
    exercises: [
      {
        id: "t1",
        name: "Weighted Pull-ups",
        sets: "5 Sets",
        reps: "3-6",
        note: "Clean reps. Full hang. No kipping. Stop before grind (RIR 1-2).",
      },
      {
        id: "t2",
        name: "1-Arm DB Row (Rack-Braced / Hand-On-Upright)",
        sets: "4 Sets",
        reps: "8-12/Side",
        note: "No bench. Hinge. Pull elbow to hip. Hard lat squeeze.",
      },
      {
        id: "t3",
        name: "Straight-Arm Cable Pulldown",
        sets: "3 Sets",
        reps: "10-15",
        note: "Lat isolation for V-taper. Arms long. Hips locked. No torso swing.",
      },
      {
        id: "t4",
        name: "Face Pulls",
        sets: "3 Sets",
        reps: "15-25",
        note: "Pull to forehead + external rotation. Rear delts + rotator cuff.",
      },
      {
        id: "t5",
        name: "Farmer Carries (Heavy, Timed Sets)",
        sets: "6 Sets",
        reps: "20-40m",
        note: "Do NOT go to failure. Stop when posture breaks. Rest 60-120s.",
      },
      {
        id: "t6",
        name: "Extensor Band Opens (or Rubber Band Finger Opens)",
        sets: "3 Sets",
        reps: "25-40",
        note: "Elbow insurance. Balance the forearms. Don’t skip.",
      },
    ],
  },

  Wednesday: {
    title: "LEGS A",
    subtitle: "Speed + Power + Max Strength (PNS-SAFE)",
    exercises: [
      {
        id: "w1",
        name: "Acceleration Sprints",
        sets: "8 Sets",
        reps: "20-40m",
        note: "Full rest (2-3 min). Perfect reps only. Stop if speed drops.",
      },
      {
        id: "w2",
        name: "Broad Jumps",
        sets: "4 Sets",
        reps: "2-3 Jumps",
        note: "MAX intent. Full reset between jumps. Quality > fatigue.",
      },
      {
        id: "w3",
        name: "Barbell Deadlift (Conventional OR Sumo)",
        sets: "5 Sets",
        reps: "3-5",
        note: "Choose the style you can keep clean. No grinders. RIR 1-2. Reset each rep.",
      },
      {
        id: "w4",
        name: "Front-Foot Elevated Split Squats",
        sets: "3 Sets",
        reps: "6-10/Leg",
        note: "Quad + glute. Knee tracks over toes. Slow eccentric.",
      },
      {
        id: "w5",
        name: "Pallof Press (Cable) - Anti-Rotation",
        sets: "3 Sets",
        reps: "20-30s Hold/Side",
        note: "Ribs down. Glutes tight. Do not twist.",
      },
      {
        id: "w6",
        name: "Wall Tib Raises",
        sets: "4 Sets",
        reps: "20-40",
        note: "Back to wall. Toes up hard. Control down. Shin armor.",
      },
      {
        id: "w7",
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "8-15",
        note: "2s pause at top + deep stretch at bottom. Build elastic ankles.",
      },
    ],
  },

  Thursday: {
    title: "PUSH B",
    subtitle: "Chest + Stability + Triceps (PNS-SAFE)",
    exercises: [
      {
        id: "th1",
        name: "Landmine Chest Press (Standing)",
        sets: "4 Sets",
        reps: "6-10",
        note: "Split stance. Press slightly up and in. RIR 1-2.",
      },
      {
        id: "th2",
        name: "Standing DB Overhead Press (Volume)",
        sets: "3 Sets",
        reps: "8-12",
        note: "Strict. No leanback. Controlled lowering.",
      },
      {
        id: "th3",
        name: "Single-Arm Overhead Carry",
        sets: "4 Sets",
        reps: "20-40m/Side",
        note: "Walk tall. Biceps by ear. Core locked. Serratus + obliques.",
      },
      {
        id: "th4",
        name: "Cable Fly (High-to-Low) - Standing",
        sets: "3 Sets",
        reps: "10-15",
        note: "Chest squeeze. Slight forward lean. No shrugging.",
      },
      {
        id: "th5",
        name: "Cable Pushdowns (Standing)",
        sets: "3 Sets",
        reps: "8-12",
        note: "Heavy triceps. Elbows pinned. Full lockout.",
      },
      {
        id: "th6",
        name: "Overhead Cable Triceps Extension (Standing)",
        sets: "2 Sets",
        reps: "12-20",
        note: "Long head focus. Smooth reps. Don’t flare ribs.",
      },
    ],
  },

  Friday: {
    title: "PULL B",
    subtitle: "Thickness + Yoke + Rotational Power (PNS-SAFE)",
    exercises: [
      {
        id: "f1",
        name: "Standing Barbell Row",
        sets: "4 Sets",
        reps: "5-8",
        note: "Brace hard. Pull to lower ribs. No torso heave. RIR 1-2.",
      },
      {
        id: "f2",
        name: "Weighted Chin-ups",
        sets: "4 Sets",
        reps: "4-8",
        note: "No failure. Leave 1 rep in the tank. Full hang every rep.",
      },
      {
        id: "f3",
        name: "Dumbbell Shrugs",
        sets: "4 Sets",
        reps: "8-12",
        note: "2s squeeze at top. No rolling. Heavy yoke.",
      },
      {
        id: "f4",
        name: "Cable Rear Delt Fly (Standing)",
        sets: "3 Sets",
        reps: "15-25",
        note: "Arms wide. Scapula moves. Rear delts burn.",
      },
      {
        id: "f5",
        name: "Cable Chops (POWER)",
        sets: "5 Sets",
        reps: "5/Side",
        note: "Explosive rotation. Full rest (60-90s). This is athletic power.",
      },
      {
        id: "f6",
        name: "Plate Pinches (Timed)",
        sets: "5 Sets",
        reps: "10-25s",
        note: "Clean holds. Stop before the plates slip. Rest 60-90s.",
      },
    ],
  },

  Saturday: {
    title: "LEGS B",
    subtitle: "Hinge + Lateral Strength + Conditioning (PNS-SAFE)",
    exercises: [
      {
        id: "s1",
        name: "Romanian Deadlifts",
        sets: "4 Sets",
        reps: "6-10",
        note: "Hips back. Long spine. Feel hamstrings. RIR 1-2.",
      },
      {
        id: "s2",
        name: "Cossack Squats (or Lateral Lunges)",
        sets: "3 Sets",
        reps: "6-10/Side",
        note: "Adductors + lateral base. Control depth. Knee tracks.",
      },
      {
        id: "s3",
        name: "Reverse Lunges",
        sets: "3 Sets",
        reps: "8-12/Leg",
        note: "Drive through front heel. Torso tall. No bounce.",
      },
      {
        id: "s4",
        name: "Cable Pull-Throughs",
        sets: "3 Sets",
        reps: "10-15",
        note: "Glutes snap. Neutral spine. Don’t turn it into a squat.",
      },
      {
        id: "s5",
        name: "Ab Wheel (Kneeling)",
        sets: "3 Sets",
        reps: "8-15",
        note: "Ribs down. Glutes tight. No low-back sag.",
      },
      {
        id: "s6",
        name: "Conditioning: Hill Sprints OR Run Intervals",
        sets: "1 Session",
        reps: "Option A: 8-12×8-12s Hill Sprints (full walk-back rest) | Option B: 10 Rounds: 20s hard + 100s easy",
        note: "Pick ONE option. This is what separates athletes from lifters.",
      },
      {
        id: "s7",
        name: "Heel Walks (Tibialis Finisher)",
        sets: "6 Sets",
        reps: "20-40m",
        note: "Toes up the whole time. Short rests. Shin armor.",
      },
    ],
  },

  Sunday: {
    title: "REST",
    subtitle: "Active Recovery (Mandatory for Performance)",
    exercises: [
      {
        id: "su1",
        name: "Walk Outside",
        sets: "1 Sess",
        reps: "8k-12k Steps",
        note: "Low intensity. Nasal breathing if possible. Restore, don’t fatigue.",
      },
      {
        id: "su2",
        name: "Mobility/Stretching",
        sets: "15-25 Min",
        reps: "-",
        note: "Hips (flexors/adductors/ankles) + shoulders (T-spine/serratus).",
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
    note: "Claw Strength. Do immediately after waking.",
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
    e.stopPropagation(); // Prevents the card from checking off when clicking 'i'
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
        Elite Version: Landmine Press, Trap Bar, & Explosive movements
        prioritized.
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
                Killer Protocol
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

                {/* 2. GYM SESSION (This is where we scroll to) */}
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
                      <Dumbbell size={14} className="text-blue-400" />
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
