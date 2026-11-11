/** Poses do Marujo (geradas por scripts/recortar-marujo.py → public/marujo). */
export const POSES = {
  neutro: [420, 640],
  aprovando: [467, 640],
  orgulhoso: [396, 640],
  cetico: [381, 640],
  bravo: [547, 640],
  triste: [480, 621],
  comemorando: [528, 640],
  assustado: [419, 635],
  dormindo: [521, 640],
  ensinando: [548, 629],
  pensando: [459, 631],
  continencia: [439, 624],
  apito: [459, 628],
} as const satisfies Record<string, readonly [number, number]>;

export type Pose = keyof typeof POSES;
