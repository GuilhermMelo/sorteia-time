/**
 * Design system do M&M Sorteia Time (manifesto, seção 2).
 * Paleta, gradiente da marca, cores dos coletes e escala tipográfica.
 */
import type { LinearGradientProps } from 'expo-linear-gradient';

// ---- Paleta oficial (2.2) ----
export const cores = {
  pitch: '#0A0C10', // fundo
  pitchLight: '#161C25', // superfícies / cards / inputs
  chalk: '#F2F2F0', // texto principal
  chalkDim: '#9FAAB5', // texto secundário
  verde: '#34E389', // acento
  teal: '#1FB5B2', // meio do gradiente
  azul: '#2E6FE4', // acento 2
  azulClaro: '#4A8DF0', // wordmark "SORTEIA TIME"
  warnRed: '#FF3B30', // avisos obrigatórios
  onGradient: '#04150E', // texto sobre o gradiente da marca
} as const;

// ---- Gradiente da marca (100deg): usar em botões primários e divisores ----
export const marcaGradient = {
  colors: [cores.verde, cores.teal, cores.azul] as const,
  locations: [0, 0.55, 1] as const,
  // 100deg ≈ quase horizontal, levemente inclinado pra baixo
  start: { x: 0, y: 0.15 },
  end: { x: 1, y: 0.85 },
} satisfies Partial<LinearGradientProps>;

// ---- Véu de fundo de todas as telas (sobre pitch) ----
export const veuGradient = {
  colors: ['rgba(52,227,137,0.14)', 'rgba(31,181,178,0.05)', 'rgba(46,111,228,0.11)'] as const,
  locations: [0, 0.55, 1] as const,
  start: { x: 0, y: 1 }, // verde embaixo/esquerda
  end: { x: 1, y: 0 }, // azul topo/direita
} satisfies Partial<LinearGradientProps>;

// ---- Cores dos times / coletes (2.3): ordem fixa, máx. 10 ----
export type CorTime = { nome: string; bg: string; fg: string };
export const CORES_TIMES: CorTime[] = [
  { nome: 'Vermelho', bg: '#E4442E', fg: '#FFFFFF' },
  { nome: 'Azul', bg: '#2E6FE4', fg: '#FFFFFF' },
  { nome: 'Amarelo', bg: '#F2C230', fg: '#1A1A1A' },
  { nome: 'Preto', bg: '#23272B', fg: '#FFFFFF' },
  { nome: 'Verde', bg: '#2FA05A', fg: '#FFFFFF' },
  { nome: 'Laranja', bg: '#F07C2E', fg: '#FFFFFF' },
  { nome: 'Roxo', bg: '#7B3FE4', fg: '#FFFFFF' },
  { nome: 'Branco', bg: '#EDEAE0', fg: '#1A1A1A' },
  { nome: 'Rosa', bg: '#E44FA0', fg: '#FFFFFF' },
  { nome: 'Ciano', bg: '#2EC7D6', fg: '#1A1A1A' },
];
export const MAX_TIMES = 10;

// ---- Tipografia (2.4) ----
// Famílias registradas em App.tsx via @expo-google-fonts.
export const fontes = {
  display: 'BebasNeue_400Regular', // títulos, números grandes
  corpo: 'Inter_400Regular',
  corpoMed: 'Inter_600SemiBold',
  corpoBold: 'Inter_700Bold',
} as const;

// ---- Espaçamentos e raios recorrentes ----
export const raio = { card: 14, botao: 14, ghost: 12, chip: 20 } as const;
