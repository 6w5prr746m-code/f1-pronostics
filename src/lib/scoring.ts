// Barème V1 (cahier des charges section 5), ajustable ici.
export const SCORING = {
  exactPodiumBonus: 25,
  driverCorrectPosition: 10,
  driverOnPodiumWrongPosition: 5,
  safetyCarCorrect: 5,
};

export interface PodiumOutcome {
  podium_1: string;
  podium_2: string;
  podium_3: string;
  safety_car: boolean;
}

export function calculatePoints(
  prediction: PodiumOutcome,
  result: PodiumOutcome,
): number {
  const predicted = [prediction.podium_1, prediction.podium_2, prediction.podium_3];
  const actual = [result.podium_1, result.podium_2, result.podium_3];

  let points = 0;
  const exact = predicted.every((driverId, i) => driverId === actual[i]);

  for (let i = 0; i < 3; i++) {
    if (predicted[i] === actual[i]) {
      points += SCORING.driverCorrectPosition;
    } else if (actual.includes(predicted[i])) {
      points += SCORING.driverOnPodiumWrongPosition;
    }
  }

  if (exact) points += SCORING.exactPodiumBonus;
  if (prediction.safety_car === result.safety_car) points += SCORING.safetyCarCorrect;

  return points;
}
