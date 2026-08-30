// Isolates the Date.now() reads in one place — keeps the impure call out
// of component render bodies (server pages read this once per request,
// which is what we want; it's not meant to be memoized across renders).
export function isRaceLocked(qualiDate: string) {
  return new Date(qualiDate).getTime() <= Date.now();
}

export function isUpcoming(raceDate: string) {
  return new Date(raceDate).getTime() >= Date.now();
}
