import Image from 'next/image';
import s from './marujo.module.css';

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

const ALT: Record<Pose, string> = {
  neutro: 'Marujo de braços na cintura',
  aprovando: 'Marujo fazendo joinha',
  orgulhoso: 'Marujo orgulhoso de braços cruzados',
  cetico: 'Marujo desconfiado, sobrancelha levantada',
  bravo: 'Marujo bravo, soltando fumaça pelas orelhas',
  triste: 'Marujo triste sentado numa âncora',
  comemorando: 'Marujo pulando de alegria',
  assustado: 'Marujo assustado',
  dormindo: 'Marujo cochilando',
  ensinando: 'Marujo apontando, ensinando',
  pensando: 'Marujo pensando',
  continencia: 'Marujo batendo continência',
  apito: 'Marujo soprando o apito',
};

type Animacao = 'pula' | 'balanca' | 'treme' | 'nenhuma';

/** Animação padrão de cada pose — reforça a emoção. */
const ANIM: Partial<Record<Pose, Animacao>> = {
  aprovando: 'pula',
  orgulhoso: 'pula',
  comemorando: 'pula',
  bravo: 'treme',
  assustado: 'treme',
  cetico: 'balanca',
  pensando: 'balanca',
  dormindo: 'balanca',
  triste: 'balanca',
  ensinando: 'balanca',
};

export function Marujo({
  pose,
  altura = 120,
  animacao,
  className,
  prioridade = false,
}: {
  pose: Pose;
  altura?: number;
  animacao?: Animacao;
  className?: string;
  prioridade?: boolean;
}) {
  const [w, h] = POSES[pose];
  const anim = animacao ?? ANIM[pose] ?? 'nenhuma';
  return (
    <span className={`${s.marujo} ${s[anim] ?? ''} ${className ?? ''}`} style={{ height: altura, width: (altura * w) / h }}>
      <Image src={`/marujo/${pose}.webp`} alt={ALT[pose]} width={w} height={h} priority={prioridade} draggable={false} />
    </span>
  );
}
