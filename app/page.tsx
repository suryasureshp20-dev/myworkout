"use client";

import React, { useState, useRef } from "react";
import {
  Dumbbell,
  Shield,
  Wind,
  Droplets,
  Footprints,
  CheckCircle2,
  X,
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
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type ProgressionType =
  | "MAIN_LIFT_TOP_BACKOFF"
  | "DOUBLE_PROGRESSION"
  | "LOAD_ONLY"
  | "TIME_ONLY";

interface ProgressionRule {
  type: ProgressionType;
  topSetTargetRPE?: number;
  addKgOnSuccess?: number;
  repRange?: [number, number];
  addKgWhenMaxRepsHit?: number;
  addSecondsOnSuccess?: number;
  ruleNote: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  note: string;
  progression?: ProgressionRule;
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
// 12-WEEK (3 MONTH) LOCKED PROGRAM
// No changes to exercises. Only increase load using progression rules.
// Deload weeks: 4, 8, 12 (same exercises, half sets, lighter effort).
// ===============================================
const PROGRAM_META = {
  name: "TOJI DENSITY - ZERO SITTING (PNS SAFE) - 12 WEEKS",
  durationWeeks: 12,
  deloadWeeks: [4, 8, 12],
  rules: [
    "Main lifts: stop 1-2 reps before failure (RPE ~8). No grinding.",
    "Rest: main lifts 3-5 min, heavy accessories 2-3 min, small work 60-90s.",
    "If form breaks, the set does not count.",
    "No sitting-based machines. No bike. No rower. Keep tailbone pressure minimal.",
    "Deload week (4, 8, 12): do half the sets and keep everything easy (RPE 6-7).",
  ],
  sessionChecklist: [
    "Warm-up 8-12 min: brisk walk + dynamic hips/shoulders + 2-4 ramp-up sets for first lift.",
    "Do explosive work first (sprints/jumps) while fresh.",
    "Do main lift next (top set + backoffs).",
    "Accessories after main lift; do not add extra exercises.",
    "Shower + keep area dry after training (PNS hygiene).",
  ],
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

// =====================================================
// LOCKED EQUIPMENT SETTINGS (SET ONCE, DO NOT CHANGE)
// =====================================================
// You said you DON'T have weighted pull-ups and you DO have a pull-up machine.
// Pick the correct type ONCE and keep it for all 12 weeks.
const PULL_MAIN_VARIANT: "ASSISTED_PULLUP_MACHINE" | "LAT_PULLDOWN" =
  "ASSISTED_PULLUP_MACHINE";

// Choose ONE row option and keep it for all 12 weeks.
const ROW_VARIANT: "LANDMINE_ROW" | "CHEST_SUPPORTED_ROW" = "LANDMINE_ROW";

// You said you have a fly machine — you can enable it (2 sets) or keep it off.
const USE_FLY_MACHINE = true;

// --- DATA: SCHEDULE (LOCKED 12 WEEKS) ---
const PROG = {
  MAIN_LOWER: (addKgOnSuccess = 5): ProgressionRule => ({
    type: "MAIN_LIFT_TOP_BACKOFF",
    topSetTargetRPE: 8,
    addKgOnSuccess,
    ruleNote:
      "Top set 3-5 reps @RPE ~8, then all backoffs 3-5 clean. If success, add +5 kg next week. If not, repeat same load.",
  }),
  MAIN_UPPER: (addKgOnSuccess = 2.5): ProgressionRule => ({
    type: "MAIN_LIFT_TOP_BACKOFF",
    topSetTargetRPE: 8,
    addKgOnSuccess,
    ruleNote:
      "Top set 3-5 reps @RPE ~8, then all backoffs 3-5 clean. If success, add +2.5 kg next week. If not, repeat same load.",
  }),
  MAIN_BODYWEIGHT_LOAD: (addKgOnSuccess = 1.25): ProgressionRule => ({
    type: "MAIN_LIFT_TOP_BACKOFF",
    topSetTargetRPE: 8,
    addKgOnSuccess,
    ruleNote:
      "Weighted top set 3-5 @RPE ~8 + backoffs 3-5. If success, add +1 to +2.5 kg next week (use smallest plates).",
  }),
  // Assisted pull-up machine: you progress by reducing assistance (kg).
  // We reuse addKgOnSuccess to mean "reduce assistance by X kg on success".
  MAIN_ASSISTED: (reduceAssistanceKg = 2.5): ProgressionRule => ({
    type: "MAIN_LIFT_TOP_BACKOFF",
    topSetTargetRPE: 8,
    addKgOnSuccess: reduceAssistanceKg,
    ruleNote:
      "Assisted pull-up machine: if all top+backoffs hit 3-5 clean, reduce assistance by ~2.5 kg next week. If not, repeat same assistance. (Less assistance = harder.)",
  }),
  DOUBLE: (
    repRange: [number, number],
    addKgWhenMaxRepsHit = 2.5,
  ): ProgressionRule => ({
    type: "DOUBLE_PROGRESSION",
    repRange,
    addKgWhenMaxRepsHit,
    ruleNote: `Keep weight until you hit ${repRange[1]} reps on all sets with clean form. Then add ~${addKgWhenMaxRepsHit} kg and go back to ${repRange[0]} reps.`,
  }),
  LOAD_ONLY: (addKgOnSuccess = 2.5): ProgressionRule => ({
    type: "LOAD_ONLY",
    addKgOnSuccess,
    ruleNote:
      "Add weight only when every set is crisp and posture is perfect. If grip or posture breaks, keep the same load.",
  }),
  TIME_ONLY: (addSecondsOnSuccess = 10): ProgressionRule => ({
    type: "TIME_ONLY",
    addSecondsOnSuccess,
    ruleNote: `Add +${addSecondsOnSuccess}s each week until you reach the top target time. Then increase difficulty (more load or plate).`,
  }),
};

// ----- Equipment-aware exercise picks (LOCKED once by constants above) -----
const TUESDAY_MAIN_PULL: Exercise =
  PULL_MAIN_VARIANT === "ASSISTED_PULLUP_MACHINE"
    ? {
        id: "t1",
        name: "Assisted Pull-up Machine (MAIN)",
        sets: "1 Top + 4 Backoff",
        reps: "3-5",
        note: "Use SAME grip every week. Top set @RPE ~8. Backoffs: slightly MORE assistance than top set so you can still hit 3-5 clean. Rest 3-5 min.",
        progression: PROG.MAIN_ASSISTED(2.5),
      }
    : {
        id: "t1",
        name: "Lat Pulldown (MAIN)",
        sets: "1 Top + 4 Backoff",
        reps: "4-6",
        note: "Heavy and strict. Pull to upper chest, full stretch at top. No jerking. Rest 2-3 min.",
        progression: PROG.MAIN_UPPER(2.5),
      };

const TUESDAY_ROW: Exercise =
  ROW_VARIANT === "LANDMINE_ROW"
    ? {
        id: "t2",
        name: "Landmine Row (Standing)",
        sets: "4 Sets",
        reps: "6-8",
        note: "Strict hinge. Pull to hip line. No cheating. Heavy and clean. No seated rows.",
        progression: PROG.DOUBLE([6, 8], 2.5),
      }
    : {
        id: "t2",
        name: "Chest-Supported Row (Prone on Incline Bench)",
        sets: "4 Sets",
        reps: "6-8",
        note: "Lie chest-down on incline bench (not seated). Full stretch, hard squeeze. Protects low back.",
        progression: PROG.DOUBLE([6, 8], 2.5),
      };

const OPTIONAL_FLY: Exercise = {
  id: "w3b",
  name: "Machine Chest Fly (Locked Optional)",
  sets: "2 Sets",
  reps: "12-15",
  note: "Slow stretch, controlled squeeze. Stop 1-2 reps before failure. If shoulders feel pinchy, set USE_FLY_MACHINE=false and keep it off for all 12 weeks.",
  progression: PROG.DOUBLE([12, 15], 2.5),
};

const SCHEDULE: ScheduleData = {
  Monday: {
    title: "LOWER POWER",
    subtitle: "Explosive Speed + Zercher Strength",
    exercises: [
      {
        id: "m1",
        name: "Wall Sprints",
        sets: "5 Sets",
        reps: "15s",
        note: "Max speed knee drives. Full rest 60-90s. Stop if speed drops. Zero tailbone pressure.",
      },
      {
        id: "m2",
        name: "Broad Jumps",
        sets: "3 Sets",
        reps: "2 Jumps",
        note: "Max distance. Full reset between jumps. Quality only (do these before heavy lifting).",
      },
      {
        id: "m3",
        name: "Zercher Squat (MAIN)",
        sets: "1 Top + 4 Backoff",
        reps: "3-5",
        note: "Bar in elbows, upright torso, hard brace. No lower-back rounding. Rest 3-5 min.",
        progression: PROG.MAIN_LOWER(5),
      },
      {
        id: "m4",
        name: "DB Walking Lunges (HEAVY)",
        sets: "3 Sets",
        reps: "6/leg",
        note: "Heavy DBs. Long stride, chest up. Rest 2-3 min. Do not turn this into cardio.",
        progression: PROG.DOUBLE([6, 8], 2.5),
      },
      {
        id: "m5",
        name: "Standing Calf Raises",
        sets: "4 Sets",
        reps: "8-12",
        note: "Full stretch at bottom, hard squeeze at top. Slow and heavy. Rest 90s.",
        progression: PROG.DOUBLE([8, 12], 5),
      },
    ],
  },

  Tuesday: {
    title: "V-TAPER PULL",
    subtitle: "Width + Grip Density (No Sitting)",
    exercises: [
      TUESDAY_MAIN_PULL,
      TUESDAY_ROW,
      {
        id: "t3",
        name: "Farmer's Walks (MAX LOAD)",
        sets: "6 Sets",
        reps: "20-30m",
        note: "Heaviest you can carry with perfect posture (no slouch). Rest 2-3 min.",
        progression: PROG.LOAD_ONLY(2.5),
      },
      {
        id: "t4",
        name: "Standing Hammer Curls (HEAVY)",
        sets: "2 Sets",
        reps: "6-8",
        note: "Go heavy. Full range. Rest 2 min. This is thickness, not pump.",
        progression: PROG.DOUBLE([6, 8], 2.5),
      },
      {
        id: "t5",
        name: "Plate Pinches",
        sets: "2 Sets",
        reps: "Max Time",
        note: "Stop before grip fully fails. Progress by time first, then heavier plates.",
        progression: PROG.TIME_ONLY(10),
      },
      {
        id: "t6",
        name: "Dead Hangs",
        sets: "2 Sets",
        reps: "Max Time",
        note: "Decompress + grip. Stop if shoulders feel irritated. Keep area ventilated.",
        progression: PROG.TIME_ONLY(10),
      },
    ],
  },

  Wednesday: {
    title: "ARMOR PUSH",
    subtitle: "Upper Chest Shelf + Pressing Power",
    exercises: [
      {
        id: "w1",
        name: "Incline DB Press (MAIN)",
        sets: "1 Top + 4 Backoff",
        reps: "3-5",
        note: "30-45 degree incline. Pick a bench setup that does not aggravate PNS. Rest 3-5 min.",
        progression: PROG.MAIN_UPPER(2.5),
      },
      {
        id: "w2",
        name: "Standing Overhead Press (SECONDARY)",
        sets: "3 Sets",
        reps: "5",
        note: "Moderate load (RPE ~7). Squeeze glutes, ribs down. Perfect reps only.",
        progression: PROG.DOUBLE([5, 6], 2.5),
      },
      {
        id: "w3",
        name: "Weighted Dips (HEAVY)",
        sets: "3 Sets",
        reps: "5-8",
        note: "Controlled depth. Add weight slowly. Stop if shoulders complain.",
        progression: PROG.DOUBLE([5, 8], 1.25),
      },
      ...(USE_FLY_MACHINE ? [OPTIONAL_FLY] : []),
      {
        id: "w4",
        name: "Cable Lateral Raises",
        sets: "3 Sets",
        reps: "12-15",
        note: "Strict. No torso swing. Controlled eccentric. Rest 60-90s.",
        progression: PROG.DOUBLE([12, 15], 1.25),
      },
      {
        id: "w5",
        name: "Hanging Leg Raises",
        sets: "3 Sets",
        reps: "8-12",
        note: "Strict hang. No swinging. If grip limits you, use straps.",
        progression: PROG.DOUBLE([8, 12], 0),
      },
      {
        id: "w6",
        name: "Overhead Cable Triceps Extension",
        sets: "2 Sets",
        reps: "10-12",
        note: "Targets triceps long head for arm density. Keep elbows stable.",
        progression: PROG.DOUBLE([10, 12], 1.25),
      },
    ],
  },

  Thursday: {
    title: "UPPER DENSITY",
    subtitle: "Traps + Neck + Rotation (Low Back Friendly)",
    exercises: [
      {
        id: "th1",
        name: "Heavy DB Shrugs (DENSITY)",
        sets: "5 Sets",
        reps: "5",
        note: "Explosive up, 2s hold at top, controlled down. No cheating.",
        progression: PROG.DOUBLE([5, 6], 2.5),
      },
      {
        id: "th2",
        name: "Standing Cable Chops (EXPLOSIVE)",
        sets: "4 Sets",
        reps: "6/side",
        note: "Power movement. Rest enough to keep speed high. Pivot foot.",
        progression: PROG.DOUBLE([6, 8], 1.25),
      },
      {
        id: "th3",
        name: "Standing Face Pulls",
        sets: "2 Sets",
        reps: "15-20",
        note: "Pull to eyes, elbows high. Shoulder health + rear delts.",
        progression: PROG.DOUBLE([15, 20], 1.25),
      },
      {
        id: "th4",
        name: "Neck 4-Way (Hands/Towel Resistance)",
        sets: "3 Sets",
        reps: "12-15",
        note: "Controlled isometric resistance. Zero ego. Never strain or jerk.",
        progression: PROG.DOUBLE([12, 15], 0),
      },
      {
        id: "th5",
        name: "Dead Hangs (Optional if already done Tuesday)",
        sets: "1 Set",
        reps: "Max Time",
        note: "Only if shoulders feel great. Otherwise skip. No pain allowed.",
        progression: PROG.TIME_ONLY(10),
      },
    ],
  },

  Friday: {
    title: "POSTERIOR CHAIN",
    subtitle: "Deadlift Power + Hamstrings",
    exercises: [
      {
        id: "f1",
        name: "Deadlift (MAIN)",
        sets: "1 Top + 4 Backoff",
        reps: "2-3",
        note: "Top set @RPE ~8, backoffs ~90%. Brace hard. Rest 3-5 min.",
        progression: PROG.MAIN_LOWER(5),
      },
      {
        id: "f2",
        name: "Romanian Deadlift (HEAVY)",
        sets: "2 Sets",
        reps: "5-6",
        note: "Long hamstring stretch, flat back, no bounce. Rest 2-3 min.",
        progression: PROG.DOUBLE([5, 6], 2.5),
      },
      {
        id: "f3",
        name: "Standing Single-Leg Curl (Cable/Machine)",
        sets: "3 Sets",
        reps: "10-12/leg",
        note: "Strict hamstring isolation. Do not use lying curl if it irritates PNS.",
        progression: PROG.DOUBLE([10, 12], 1.25),
      },
      {
        id: "f4",
        name: "Hill Sprints",
        sets: "4 Rounds",
        reps: "10-12s",
        note: "Max effort, walk-down rest. Skip if hamstrings feel tight or if recovery is poor.",
      },
    ],
  },

  Saturday: {
    title: "ENGINE",
    subtitle: "Zone 2 Recovery Cardio",
    exercises: [
      {
        id: "s1",
        name: "Incline Treadmill Walk",
        sets: "1 Sess",
        reps: "35-45 mins",
        note: "Nasal breathing. Easy pace. No bike. No rower. This is recovery.",
      },
      {
        id: "s2",
        name: "Standing Mobility",
        sets: "1 Sess",
        reps: "15 mins",
        note: "Hips + ankles + t-spine + shoulders. Keep it gentle and consistent.",
      },
    ],
  },

  Sunday: {
    title: "REST",
    subtitle: "Growth + Repair",
    exercises: [
      {
        id: "su1",
        name: "Walk Outside",
        sets: "1 Sess",
        reps: "8-10k steps",
        note: "Easy pace. Do not sit for long blocks. Stand up often.",
      },
    ],
  },
};

// --- Morning Ritual (Locked) ---
const MORNING_RITUAL: Exercise[] = [
  {
    id: "mr1",
    name: "Standing Fingertip Plank (Wall/Counter)",
    sets: "3 Sets",
    reps: "10-30s",
    note: "Do not go to failure. Stop before form breaks. Save grip for pulling.",
    progression: PROG.TIME_ONLY(5),
  },
  {
    id: "mr2",
    name: "Standing Lat Stretch (Doorframe)",
    sets: "2 Mins",
    reps: "Hold",
    note: "Gentle traction. No pain, no numbness. Breathe slowly.",
  },
];

const DELOAD_RULE_TEXT =
  "Week 4/8/12 deload: half sets, lighter weight, RPE 6-7, perfect speed + form.";

// --- Animation ---
const containerVar: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVar: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const openFormGuide = (exerciseName: string) => {
  const searchQuery = encodeURIComponent(`${exerciseName} proper form`);
  if (typeof window !== "undefined") {
    window.open(
      `https://www.youtube.com/results?search_query=${searchQuery}`,
      "_blank",
    );
  }
};

const getFocusFromNote = (note: string) => {
  const n = note.toLowerCase();
  if (n.includes("grip") || n.includes("forearm")) return "Grip & forearms";
  if (n.includes("core")) return "Core stability";
  if (n.includes("sprint") || n.includes("speed") || n.includes("power"))
    return "Speed & power";
  if (n.includes("glute")) return "Glutes";
  if (n.includes("hamstring")) return "Hamstrings";
  if (n.includes("upper chest")) return "Upper chest";
  if (n.includes("shoulder")) return "Shoulders";
  if (n.includes("triceps")) return "Triceps";
  if (n.includes("back") || n.includes("lats")) return "Back";
  if (n.includes("neck") || n.includes("traps")) return "Neck & traps";
  if (n.includes("mobility") || n.includes("stretch")) return "Mobility";
  return null;
};

// --- Sub-Components ---
const ExerciseCard = ({
  ex,
  isCompleted,
  onToggle,
  onOpen,
  icon,
}: {
  ex: Exercise;
  isCompleted: boolean;
  onToggle: () => void;
  onOpen: () => void;
  icon?: React.ReactNode;
}) => {
  return (
    <motion.div
      variants={itemVar}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        if (typeof navigator !== "undefined" && navigator.vibrate)
          navigator.vibrate(50);
        onOpen();
      }}
      className={cn(
        "relative border p-4 rounded-2xl flex flex-row items-center gap-4 transition-all cursor-pointer backdrop-blur-md active:opacity-80",
        isCompleted
          ? "bg-green-950/30 border-green-500/50"
          : "bg-slate-900/60 border-slate-800",
      )}
    >
      {/* Check Circle */}
      <button
        type="button"
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 active:scale-95",
          isCompleted
            ? "border-green-500 bg-green-500 text-slate-950"
            : "border-slate-600 text-transparent",
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (typeof navigator !== "undefined" && navigator.vibrate)
            navigator.vibrate(15);
          onToggle();
        }}
        aria-label={
          isCompleted ? "Mark exercise incomplete" : "Mark exercise complete"
        }
      >
        <CheckCircle2 size={16} strokeWidth={4} />
      </button>

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <h3
            className={cn(
              "text-base font-bold font-oswald tracking-wide leading-snug",
              isCompleted ? "text-green-500/80" : "text-slate-100",
            )}
          >
            {ex.name}
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFormGuide(ex.name);
            }}
            className="p-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 active:scale-90 transition-all flex-shrink-0"
            aria-label={`Open form guide for ${ex.name}`}
          >
            <Info size={14} />
          </button>
        </div>
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

      {icon && <div className="text-slate-500">{icon}</div>}
    </motion.div>
  );
};

const ExerciseModal = ({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) => {
  const focus = getFocusFromNote(exercise.note);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-md mx-auto bg-slate-950/90 border border-slate-800 rounded-t-3xl p-5 pb-7 backdrop-blur-xl shadow-2xl"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 800) onClose();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-700/70" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 active:scale-95"
          aria-label="Close details"
        >
          <X size={18} />
        </button>

        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-bold font-oswald text-slate-500 uppercase tracking-[0.3em]">
              Exercise Detail
            </p>
            <h3 className="mt-2 text-xl font-bold font-oswald text-white leading-snug">
              {exercise.name}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Sets
              </p>
              <p className="mt-1 text-lg font-bold text-white font-oswald">
                {exercise.sets}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Reps
              </p>
              <p className="mt-1 text-lg font-bold text-white font-oswald">
                {exercise.reps}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[10px] font-bold uppercase text-slate-400">
              Detail
            </p>
            <p className="mt-2 text-sm text-slate-200 leading-relaxed">
              {exercise.note}
            </p>
          </div>

          {exercise.progression && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Progression Rule
              </p>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                {exercise.progression.ruleNote}
              </p>
            </div>
          )}

          {focus && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">
                Focus
              </p>
              <p className="mt-2 text-sm text-slate-200">{focus}</p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openFormGuide(exercise.name)}
              className="flex-1 rounded-2xl border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-300 shadow-[0_0_18px_rgba(59,130,246,0.18)] active:scale-[0.99]"
            >
              Form Guide
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm font-bold text-slate-300 active:scale-[0.99]"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
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
      <p className="text-[11px] text-slate-500 mt-1 font-roboto">
        {PROGRAM_META.name}
      </p>

      <div className="mt-3 space-y-3">
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white font-oswald font-bold">
            <TrendingUp size={16} className="text-green-500" />
            Execution Rules
          </div>
          <ul className="mt-2 text-sm text-slate-400 list-disc pl-5 space-y-1">
            {PROGRAM_META.rules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-white font-oswald font-bold">
            <Target size={16} className="text-blue-400" />
            Session Checklist
          </div>
          <ul className="mt-2 text-sm text-slate-400 list-disc pl-5 space-y-1">
            {PROGRAM_META.sessionChecklist.map((r) => (
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
            Weeks{" "}
            <span className="text-white font-bold">
              {PROGRAM_META.deloadWeeks.join(", ")}
            </span>
            : {DELOAD_RULE_TEXT}
          </p>
        </div>
      </div>
    </div>

    {/* Locked equipment */}
    <div className="bg-slate-900/50 p-5 rounded-2xl border-l-4 border-purple-500">
      <h3 className="font-oswald font-bold text-white flex items-center gap-2">
        <Sword size={18} className="text-purple-400" /> LOCKED EQUIPMENT
      </h3>
      <p className="text-sm text-slate-400 mt-2">
        Pull main:{" "}
        <span className="text-white font-bold">{PULL_MAIN_VARIANT}</span> · Row:{" "}
        <span className="text-white font-bold">{ROW_VARIANT}</span> · Fly
        machine:{" "}
        <span className="text-white font-bold">
          {USE_FLY_MACHINE ? "ON (2 sets)" : "OFF"}
        </span>
      </p>
    </div>
  </motion.div>
);

// --- Main Component ---
export default function Home() {
  const [currentDay, setCurrentDay] = useState<DayKey>("Monday");
  const [view, setView] = useState<"workout" | "rules">("workout");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );

  const gymSectionRef = useRef<HTMLDivElement>(null);

  const activeGym = SCHEDULE[currentDay];

  const allExercises = [...MORNING_RITUAL, ...activeGym.exercises];
  const doneCount = allExercises.filter((ex) => completed[ex.id]).length;
  const progress = (doneCount / allExercises.length) * 100;

  const toggle = (id: string) =>
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDayChange = (day: DayKey) => {
    setCurrentDay(day);
    setSelectedExercise(null);
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
                        onOpen={() => setSelectedExercise(ex)}
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
                        onOpen={() => setSelectedExercise(ex)}
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

      <AnimatePresence>
        {selectedExercise && (
          <ExerciseModal
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
          />
        )}
      </AnimatePresence>

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
