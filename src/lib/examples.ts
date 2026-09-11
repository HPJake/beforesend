import type { Goal, Relationship } from "./schemas";

export interface ExampleMessage {
  message: string;
  relationship: Relationship;
  goal: Goal;
  label: string;
  emoji: string;
}

export const EXAMPLES: ExampleMessage[] = [
  {
    label: "指责同事",
    emoji: "😤",
    message: "这个问题我上周已经说过了，为什么你们就是没人听？",
    relationship: "coworker",
    goal: "solve_problem",
  },
  {
    label: "阴阳怪气",
    emoji: "🙄",
    message: "行，你说什么就是什么。",
    relationship: "partner",
    goal: "express_dissatisfaction",
  },
  {
    label: "正常约见",
    emoji: "🙂",
    message: "下午三点图书馆见？",
    relationship: "friend",
    goal: "solve_problem",
  },
  {
    label: "想被认真对待",
    emoji: "💼",
    message: "这个方案我反复推演过，能给我十分钟讲完吗？",
    relationship: "boss",
    goal: "persuade",
  },
];