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
  Sword,
  Target,
  TrendingUp,
  AlertTriangle,
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

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type DayKey = (typeof DAYS)[number];
type ScheduleData = Record<DayKey, DaySchedule>;

// ===============================================
// FIXED 12-WEEK PROGRAM — CONCRETE, NO REDESIGN
// - Locked exercise list for 12 weeks.
// - Deload Week: 7 (same exercises, cut sets ~40–50%).
// ===============================================
const PROGRAM_META = {
  durationWeeks: 12,
  deloadWeeks: [7],
  rules: {
    lockedFor12Weeks: [
      "Squat: High-Bar Back Squat (fixed).",
      "Press: Standing Overhead Press (fixed).",
      "Chest Mass: Weighted Dips (fixed).",
      "Primary Row: Chest-Supported Row on Tuesday (fixed).",
      "Specialization Row: Machine Row on Thursday (fixed).",
      "Posterior Chain: Romanian Deadlift + Hip Thrust (fixed).",
      "Lateral/Adductor: Lateral Lunge (fixed).",
      "Core: Ab Wheel (Tuesday) + Pallof + Hanging Knee Raises (Friday) (fixed).",
      "Power: Acceleration sprints (fixed). If pilonidal irritation risk, substitute sled pushes with same slot (safety override only).",
    ],
    mainLifts: [
      "Main lifts use honest RIR. NO grinding. If form breaks or rep speed dies, stop and repeat load next week.",
      "Squat: Top 3–5 @ RIR 2 + 2 back-off sets of 5 @ ~90% of top set.",
      "RDL: Top 6–8 @ RIR 2 + 2 back-off sets of 6–8 @ ~90% of top set.",
    ],
    progression: [
      "Main lifts: add load ONLY when you hit the top of the rep range at the target RIR with clean form.",
      "Accessories: double progression (hit top reps on all sets clean → then increase next time, smallest jump).",
      "Rest times: main lifts 2–4 min, accessories 60–90 sec, carries as needed for perfect posture.",
    ],
    powerRules: [
      "Sprints: full rest 2–3 min. TIME 2 reps weekly (same distance) and record BEST.",
      "STOP power work if time drops ~2% or mechanics degrade. No fatigue reps.",
      "Broad jumps: full reset. Record best jump. No sloppy landings.",
    ],
    cardioRules: [
      "Zone 1–2 = easy-moderate. You can talk in short sentences.",
      "Standing only: incline walk/ruck. Avoid long sweaty sitting after training.",
    ],
    pilonidalNotes: [
      "If irritation occurs: swap sprints → sled pushes; keep cardio standing; shower + dry well; change into dry clothes.",
      "If pain/swelling/drainage/fever: stop high intensity and seek medical evaluation.",
    ],
    deloadRules: [
      "Week 7: same exercises, cut total sets ~40–50%. Keep intensity moderate (RIR ~4).",
      "Deload power: reduce sprint/jump volume ~30–40% but keep quality crisp.",
    ],
  },
} as const;

const WARMUP_BLOCKS = {
  sprintWarmup: [
    "3–5 min easy walk",
    "Leg swings + hip openers + ankle bounces",
    "2×20m build-ups @ ~60–70%",
    "1×20m build-up @ ~85–90%",
    "Then start working sprints (full rest)",
  ],
  liftingWarmup: [
    "2–4 ramp sets before the first main lift",
    "Warm-up sets stay fast and clean; never fatigue in warm-up",
  ],
} as const;

// --- DATA: SCHEDULE (FIXED 12 WEEKS, CONCRETE) ---
// FINAL 12-WEEK LOCKED SCHEDULE (no redesign)
// Change made: Tuesday core -> Hanging Knee Raises (replacing Ab Wheel)
// Core is now: Pallof (Fri) + Hanging Knee Raises (Tue + Fri)

const SCHEDULE: ScheduleData = {
  Monday: {
    title: "LOWER A",
    subtitle: "Acceleration + Jumps + Squat (QUALITY > VOLUME)",
    exercises: [
      {
        id: "m0",
        name: "Acceleration Sprints (Outdoors)",
        sets: "5 Sets",
        reps: "10–20m",
        note: "Full rest 2–3 min. TIME 2 reps weekly (same distance) and record BEST. Stop if time drops ~2% or mechanics degrade. Safety override: if pilonidal irritation risk, do sled pushes same slot.",
      },
      {
        id: "m1",
        name: "Broad Jumps",
        sets: "3 Sets",
        reps: "2 Jumps",
        note: "Full reset. Record best jump. Crisp takeoff + landing only. No fatigue reps.",
      },
      {
        id: "m2",
        name: "High-Bar Back Squat (Main Lift) — LOCKED 12 weeks",
        sets: "1 Top + 2 Back-off",
        reps: "Top: 3–5 | Back-off: 5",
        note: "Top set @ RIR 2. Back-offs ~90% of top set. No grinding. Keep speed quality intact.",
      },
      {
        id: "m3",
        name: "Bulgarian Split Squat",
        sets: "2 Sets",
        reps: "8–12 / Leg",
        note: "Controlled. RIR 1–2. Perfect knee tracking. No knee cave.",
      },
      {
        id: "m4",
        name: "Hamstring Curl",
        sets: "3 Sets",
        reps: "8–12",
        note: "Full ROM. Controlled eccentric. No hip lift/cheating.",
      },
      {
        id: "m5",
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "2×6–10 + 2×12–20",
        note: "Pause at top + deep stretch. No bouncing. Full ROM every rep.",
      },
      {
        id: "m6",
        name: "Tibialis Raises",
        sets: "2 Sets",
        reps: "20–30",
        note: "Full ROM for shin/ankle durability.",
      },
    ],
  },

  Tuesday: {
    title: "PULL (HEAVY)",
    subtitle: "Width + Thickness + Arms + Anterior Core",
    exercises: [
      {
        id: "t0",
        name: "Scapular Pull-ups (Primer)",
        sets: "2 Sets",
        reps: "5–8",
        note: "Warm-up only (easy). Straight arms. Depress scapula and hold 1–2s. DO NOT fatigue.",
      },
      {
        id: "t1",
        name: "Weighted Pull-ups",
        sets: "4 Sets",
        reps: "4–7",
        note: "Full hang. RIR 1–2. Add load only when all sets hit 7 clean with same ROM.",
      },
      {
        id: "t2",
        name: "Chest-Supported Row",
        sets: "3 Sets",
        reps: "6–10",
        note: "Strict. Same ROM every rep. RIR 1–2. Progress in logbook.",
      },
      {
        id: "t3",
        name: "Neutral-Grip Pulldown (Lat Stretch Focus)",
        sets: "2 Sets",
        reps: "10–15",
        note: "Full overhead stretch; drive elbows down. No swinging.",
      },
      {
        id: "t4",
        name: "Face Pulls",
        sets: "2 Sets",
        reps: "15–25",
        note: "Rear delts + shoulder health. Control and pause.",
      },
      {
        id: "t5",
        name: "Incline DB Curls",
        sets: "2 Sets",
        reps: "8–12",
        note: "Full stretch. No cheating. Stop 1–2 reps before failure.",
      },
      {
        id: "t6",
        name: "Hammer Curls",
        sets: "2 Sets",
        reps: "8–12",
        note: "Brachialis + forearm thickness. Neutral grip. Clean reps only.",
      },
      {
        id: "t7",
        name: "Hanging Knee Raises",
        sets: "2 Sets",
        reps: "8–12",
        note: "Strict. ZERO swinging. Dead hang each rep. Posterior pelvic tilt at top. 2–3s controlled descent.",
      },
    ],
  },

  Wednesday: {
    title: "PUSH (HEAVY)",
    subtitle: "Upper Chest + Delts + Triceps",
    exercises: [
      {
        id: "w1",
        name: "Incline DB Press",
        sets: "4 Sets",
        reps: "6–10",
        note: "Priority press for upper chest. Controlled eccentric. RIR 1–2. Add load only when all sets hit 10 clean.",
      },
      {
        id: "w2",
        name: "Standing Overhead Press — LOCKED 12 weeks",
        sets: "3 Sets",
        reps: "4–8",
        note: "Strict. No layback. RIR 2. Add load when all sets hit 8 clean.",
      },
      {
        id: "w3",
        name: "Weighted Dips — LOCKED 12 weeks",
        sets: "3 Sets",
        reps: "6–10",
        note: "Smooth reps. RIR 1–2. Add load when all sets hit 10 clean. If dips cause pain, swap ONCE to DB Bench and lock it (safety override only).",
      },
      {
        id: "w4",
        name: "Cable Lateral Raises",
        sets: "3 Sets",
        reps: "12–20",
        note: "Side delts for shirt width. Strict. Constant tension. No swing.",
      },
      {
        id: "w5",
        name: "Overhead Cable Triceps Extension",
        sets: "3 Sets",
        reps: "10–15",
        note: "Direct triceps (long head). Full stretch. No elbow pain.",
      },
    ],
  },

  Thursday: {
    title: "UPPER SPECIALIZATION (DENSE LOOK)",
    subtitle: "Traps + Delts + Back + Arms + Carries + Neck",
    exercises: [
      {
        id: "th1",
        name: "Shrugs (DB or Barbell)",
        sets: "4 Sets",
        reps: "6–10",
        note: "Priority. Heavy. 2-sec squeeze at top. No bouncing. Full ROM.",
      },
      {
        id: "th2",
        name: "Machine Row — LOCKED 12 weeks",
        sets: "3 Sets",
        reps: "6–10",
        note: "Brace hard. No heaving. RIR 1–2. Progress in logbook.",
      },
      {
        id: "th3",
        name: "Leaning Cable Lateral Raises",
        sets: "3 Sets",
        reps: "12–20",
        note: "Strict, no swing. Different angle than Wednesday. Constant tension.",
      },
      {
        id: "th4",
        name: "Rear Delt Fly (Cable or Reverse Pec Deck)",
        sets: "2 Sets",
        reps: "15–25",
        note: "Rear delts. Controlled. Don’t let traps dominate.",
      },
      {
        id: "th5",
        name: "Cable Curl",
        sets: "2 Sets",
        reps: "8–12",
        note: "No swinging. Full ROM. RIR 1–2.",
      },
      {
        id: "th6",
        name: "Rope Pressdowns",
        sets: "2 Sets",
        reps: "10–15",
        note: "Direct triceps. Elbows pinned. Full lockout. Clean reps.",
      },
      {
        id: "th7",
        name: "Suitcase Carries",
        sets: "3 Sets",
        reps: "30–40m / Side",
        note: "Anti-lateral flexion. Walk tall. Stop before posture breaks.",
      },
      {
        id: "th8",
        name: "Standing Neck Training (4-Way Band/Hand)",
        sets: "2 Sets",
        reps: "15–25",
        note: "Easy-moderate. No pain. Controlled reps only. Never grind neck work.",
      },
    ],
  },

  Friday: {
    title: "LOWER B",
    subtitle: "RDL + Legs + Calves + Trunk + Short Zone 1–2 (Standing)",
    exercises: [
      {
        id: "f1",
        name: "Romanian Deadlift (Main Lift) — LOCKED 12 weeks",
        sets: "1 Top + 2 Back-off",
        reps: "Top: 6–8 | Back-off: 6–8",
        note: "Top set @ RIR 2. Back-offs ~90%. Perfect hinge. No grinding.",
      },
      {
        id: "f2",
        name: "Hip Thrust — LOCKED 12 weeks",
        sets: "3 Sets",
        reps: "8–12",
        note: "Controlled reps. Strong lockout. RIR 1–2.",
      },
      {
        id: "f3",
        name: "Lateral Lunge — LOCKED 12 weeks",
        sets: "2 Sets",
        reps: "8–10 / Side",
        note: "Adductors + lateral strength. Smooth depth, knee tracking.",
      },
      {
        id: "f4",
        name: "Hamstring Curl",
        sets: "2 Sets",
        reps: "8–12",
        note: "Second weekly knee-flexion exposure (reduced volume). Full ROM, controlled eccentric.",
      },
      {
        id: "f5",
        name: "Seated Calf Raises",
        sets: "3 Sets",
        reps: "10–15",
        note: "Deep stretch + pause. No bouncing.",
      },
      {
        id: "f6",
        name: "Pallof Press (Anti-Rotation)",
        sets: "2 Sets",
        reps: "10–15 / Side",
        note: "Brace hard. Ribs down. No torso twist. Control the return.",
      },
      {
        id: "f7",
        name: "Hanging Knee Raises",
        sets: "2 Sets",
        reps: "8–12",
        note: "Strict. ZERO swinging. Dead hang each rep. Posterior pelvic tilt at top. 2–3s controlled descent.",
      },
      {
        id: "f8",
        name: "Zone 1–2 Incline Walk / Ruck (Standing)",
        sets: "1 Session",
        reps: "20–30 mins",
        note: "Easy-moderate. Standing only. Shower + dry well after.",
      },
    ],
  },

  Saturday: {
    title: "CARDIO",
    subtitle: "Zone 1–2 + Mobility (Standing)",
    exercises: [
      {
        id: "sa1",
        name: "Zone 1–2 Incline Walk / Ruck (Standing)",
        sets: "1 Session",
        reps: "60 mins",
        note: "Steady pace. Low joint stress. Standing only.",
      },
      {
        id: "sa2",
        name: "Mobility Flow",
        sets: "1 Session",
        reps: "10–15 mins",
        note: "Focus on hips, ankles, and T-spine. Smooth, not aggressive.",
      },
    ],
  },

  Sunday: {
    title: "REST",
    subtitle: "Steps + Recovery",
    exercises: [
      {
        id: "su1",
        name: "Walk (Steps)",
        sets: "1 Session",
        reps: "8k–12k steps",
        note: "Keep weekly step average high for leanness. Easy pace.",
      },
    ],
  },
};

// --- DATA: MORNING RITUAL (fixed) ---
const MORNING_RITUAL: Exercise[] = [
  {
    id: "mr1",
    name: "Fingertip Plank (Submax)",
    sets: "2–3 Sets",
    reps: "RPE 7–8",
    note: "2–3×/week only. Leave 2–3 reps/seconds in reserve. Do NOT daily-fail.",
  },
  {
    id: "mr2",
    name: "Sink Decompression",
    sets: "1–2 mins",
    reps: "Hold",
    note: "Gentle spinal decompression. No pain.",
  },
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
  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

            <button
              onClick={handleInfoClick}
              className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 active:scale-90 transition-all flex-shrink-0"
              aria-label={`Open form guide for ${ex.name}`}
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

    {/* Standing mandate */}
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-red-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Footprints size={18} className="text-red-500" /> STANDING MANDATE
      </h3>
      <p className="text-sm text-slate-400 mt-2">
        Prefer standing work. Avoid long sitting after training. Cardio stays
        standing (incline walk/ruck).
      </p>
    </div>

    {/* Hygiene */}
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-green-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Droplets size={18} className="text-green-500" /> HYGIENE
        (PILONIDAL-SAFE)
      </h3>
      <p className="text-sm text-slate-400 mt-2">
        Shower after sweaty sessions, dry well, don’t stay in sweaty clothes,
        avoid long sitting blocks.
      </p>
    </div>

    {/* Program meta */}
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-blue-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Target size={18} className="text-blue-500" /> PROGRAM RULES
      </h3>

      <div className="mt-3 space-y-3">
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white font-oswald font-bold">
            <TrendingUp size={16} className="text-green-500" />
            Progression
          </div>
          <ul className="mt-2 text-sm text-slate-400 list-disc pl-5 space-y-1">
            {PROGRAM_META.rules.mainLifts.map((r) => (
              <li key={r}>{r}</li>
            ))}
            {PROGRAM_META.rules.progression.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white font-oswald font-bold">
            <Zap size={16} className="text-blue-400" />
            Power Quality
          </div>
          <ul className="mt-2 text-sm text-slate-400 list-disc pl-5 space-y-1">
            {PROGRAM_META.rules.powerRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white font-oswald font-bold">
            <Timer size={16} className="text-orange-400" />
            Deload
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Week{" "}
            <span className="text-white font-bold">
              {PROGRAM_META.deloadWeeks.join(", ")}
            </span>
            : cut sets ~40–50%. Same exercises. Keep quality high.
          </p>
          <ul className="mt-2 text-sm text-slate-400 list-disc pl-5 space-y-1">
            {PROGRAM_META.rules.deloadRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white font-oswald font-bold">
            <AlertTriangle size={16} className="text-yellow-400" />
            Locked (12 weeks)
          </div>
          <ul className="mt-2 text-sm text-slate-400 list-disc pl-5 space-y-1">
            {PROGRAM_META.rules.lockedFor12Weeks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main Component ---
export default function Home() {
  const [currentDay, setCurrentDay] = useState<DayKey>("Monday");
  const [view, setView] = useState<"workout" | "rules">("workout");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const gymSectionRef = useRef<HTMLDivElement>(null);

  const activeGym = SCHEDULE[currentDay];

  const allExercises = [...MORNING_RITUAL, ...activeGym.exercises];
  const doneCount = allExercises.filter((ex) => completed[ex.id]).length;
  const progress = (doneCount / allExercises.length) * 100;

  const toggle = (id: string) =>
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDayChange = (day: DayKey) => {
    setCurrentDay(day);
    setTimeout(() => {
      gymSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const getDayIcon = (day: DayKey) => {
    if (day === "Monday") return <Zap size={14} className="text-blue-400" />;
    if (day === "Thursday")
      return <Sword size={14} className="text-blue-400" />;
    if (day === "Saturday")
      return <Timer size={14} className="text-blue-400" />;
    if (day === "Sunday") return <Sun size={14} className="text-blue-400" />;
    return <Dumbbell size={14} className="text-blue-400" />;
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
                12-WEEK LOCKED PROTOCOL
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
            aria-label={view === "rules" ? "Back to workout" : "Open rules"}
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
                      {getDayIcon(currentDay)}
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
                        SHOWER + DRY
                      </span>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-xl flex flex-col items-center text-center gap-2">
                      <Wind size={16} className="text-blue-400" />
                      <span className="text-[10px] text-slate-400 font-bold">
                        COOL DRY CLOTHES
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
                      Recovery started. Logged.
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
