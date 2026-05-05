// 10-question quiz per Vipanshi's PDF spec.
// Each question maps to a tag key on the animals data.
// `weight` controls how much that question matters in scoring.

export const quizQuestions = [
  {
    id: "type",
    question: "Are you looking to adopt a dog or a cat?",
    weight: 5, // hard preference — heavily weighted
    options: [
      { value: "dog", label: "A dog" },
      { value: "cat", label: "A cat" },
    ],
  },
  {
    id: "activity",
    question: "How active is your lifestyle?",
    weight: 2,
    options: [
      { value: "couch", label: "Couch potato" },
      { value: "walks", label: "Weekend walks" },
      { value: "runner", label: "Daily runner" },
    ],
  },
  {
    id: "home",
    question: "How much space do you have at home?",
    weight: 2,
    options: [
      { value: "apartment", label: "Apartment" },
      { value: "garden", label: "House with garden" },
      { value: "large-house", label: "Large house" },
    ],
  },
  {
    id: "size",
    question: "What size of dog or cat do you prefer?",
    weight: 3,
    options: [
      { value: "large", label: "Large" },
      { value: "medium", label: "Medium" },
      { value: "small", label: "Small" },
    ],
  },
  {
    id: "experience",
    question: "Any pet experience?",
    weight: 2,
    options: [
      { value: "first-timer", label: "First timer" },
      { value: "experienced", label: "Had pets before" },
      { value: "expert", label: "Very experienced" },
    ],
  },
  {
    id: "energy",
    question: "What energy level suits you?",
    weight: 3,
    options: [
      { value: "calm", label: "Calm and cuddly" },
      { value: "playful", label: "Playful" },
      { value: "high-energy", label: "High energy" },
    ],
  },
  {
    id: "household",
    question: "Do you have children or other pets at home?",
    weight: 2,
    options: [
      { value: "children", label: "Yes, children" },
      { value: "other-pets", label: "Yes, other pets" },
      { value: "both", label: "Both" },
      { value: "neither", label: "Neither" },
    ],
  },
  {
    id: "hours",
    question: "How many hours a day can you spend with your pet?",
    weight: 1,
    options: [
      { value: "most-day", label: "Most of the day" },
      { value: "few-hours", label: "A few hours" },
      { value: "evening", label: "Often away, home by evening" },
    ],
  },
  {
    id: "grooming",
    question: "How do you feel about grooming and maintenance?",
    weight: 1,
    options: [
      { value: "love-it", label: "Love it — bonding time" },
      { value: "occasional", label: "Don't mind occasional" },
      { value: "low-maintenance", label: "Prefer low maintenance" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you in a pet?",
    weight: 2,
    options: [
      { value: "loyalty", label: "Loyalty and protectiveness" },
      { value: "playfulness", label: "Playfulness and energy" },
      { value: "affection", label: "Affection and calm" },
      { value: "independence", label: "Independence and low demand" },
    ],
  },
];

// Scoring: for each question, if the user's answer is in the animal's tag list
// (or matches the tag value), award the question's weight.
// `type` is special — if the user picks "cat" and the animal is a "dog", we
// disqualify it entirely so dog/cat preference is honored strictly.
export function findBestMatch(answers, animals) {
  let best = null;
  let bestScore = -1;

  animals.forEach((animal) => {
    // Hard filter on type
    if (answers.type && animal.tags.type !== answers.type) return;

    let score = 0;
    quizQuestions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      const tag = animal.tags[q.id];
      if (Array.isArray(tag) ? tag.includes(userAnswer) : tag === userAnswer) {
        score += q.weight;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      best = animal;
    }
  });

  return best;
}