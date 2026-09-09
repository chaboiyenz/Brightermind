/** Fisher–Yates over a copy of `items`; the input is never mutated. `random` is injectable for tests. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): readonly T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
