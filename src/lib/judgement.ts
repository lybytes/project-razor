// Tallies for steps 2 and 3 of the two-step judgement cards.

export interface JudgedTally {
  /** Step 2: verdicts answered correctly / verdicts shown. */
  verdictCorrect: number;
  verdictTotal: number;
  /** Step 3: "what would you check" answered correctly. */
  checkCorrect: number;
}

export const EMPTY_TALLY: JudgedTally = { verdictCorrect: 0, verdictTotal: 0, checkCorrect: 0 };

export const addToTally = (tally: JudgedTally, step: "verdict" | "check", correct: boolean): JudgedTally =>
  step === "verdict"
    ? { ...tally, verdictTotal: tally.verdictTotal + 1, verdictCorrect: tally.verdictCorrect + (correct ? 1 : 0) }
    : { ...tally, checkCorrect: tally.checkCorrect + (correct ? 1 : 0) };

/** "You spotted 7/9 moves, judged 5/6 correctly, and caught the fair follow-up on 3." */
export const describeTallies = (movesCorrect: number, movesTotal: number, tally: JudgedTally): string => {
  const moves = `You spotted ${movesCorrect}/${movesTotal} move${movesTotal === 1 ? "" : "s"}`;
  if (tally.verdictTotal === 0) return `${moves}.`;
  const judged = `judged ${tally.verdictCorrect}/${tally.verdictTotal} correctly`;
  if (tally.checkCorrect === 0) return `${moves} and ${judged}.`;
  return `${moves}, ${judged}, and caught the fair follow-up on ${tally.checkCorrect}.`;
};
