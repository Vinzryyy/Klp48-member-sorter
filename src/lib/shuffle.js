/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate input.
 * Unbiased — every permutation is equally likely.
 */
export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
