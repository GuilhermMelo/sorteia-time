/**
 * Regras de sorteio (manifesto, seção 3). Puro e testável — sem UI.
 * Embaralhamento por Fisher-Yates.
 */
import { MAX_TIMES } from './theme';
import type { Jogador } from './storage';

/** Fisher-Yates: embaralha uma cópia do array. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================
// 3.1 — MODO TOQUE (cor e número)
// ============================================================
export const TOQUE_LIMITES = { totalMin: 2, totalMax: 110, porTimeMin: 1, porTimeMax: 11 };

export type PlanoToque = {
  total: number;
  porTime: number;
  numTimes: number;
  distribuicao: number[]; // jogadores por time; índice = ordem-1
  fecha: boolean; // divisão exata?
  incompletoIndex: number; // -1 se fecha, senão índice do último time
  valido: boolean; // numTimes dentro de 1..MAX_TIMES
  excedeMax: boolean; // numTimes > MAX_TIMES
};

/**
 * Calcula a divisão do modo toque. numTimes = teto(total / porTime).
 * Quando não fecha redondo, o ÚLTIMO time fica com menos jogadores.
 */
export function planejarToque(total: number, porTime: number): PlanoToque {
  const numTimes = Math.max(1, Math.ceil(total / porTime));
  const excedeMax = numTimes > MAX_TIMES;
  // Os primeiros times ficam cheios (porTime); o último recebe o restante.
  const distribuicao: number[] = [];
  let restante = total;
  for (let i = 0; i < numTimes; i++) {
    const cheio = i < numTimes - 1 ? porTime : restante;
    distribuicao.push(cheio);
    restante -= cheio;
  }
  const fecha = total % porTime === 0;
  const incompletoIndex = fecha ? -1 : numTimes - 1;
  const valido =
    total >= TOQUE_LIMITES.totalMin &&
    total <= TOQUE_LIMITES.totalMax &&
    porTime >= TOQUE_LIMITES.porTimeMin &&
    porTime <= TOQUE_LIMITES.porTimeMax &&
    numTimes >= 1 &&
    !excedeMax;
  return { total, porTime, numTimes, distribuicao, fecha, incompletoIndex, valido, excedeMax };
}

/**
 * Cria e embaralha o "pool" de vagas do modo toque: uma entrada por jogador,
 * contendo o índice (0-based) do time daquele jogador. Cada toque na tela
 * consome a próxima vaga.
 */
export function montarPoolToque(plano: PlanoToque): number[] {
  const pool: number[] = [];
  plano.distribuicao.forEach((qtd, timeIndex) => {
    for (let i = 0; i < qtd; i++) pool.push(timeIndex);
  });
  return shuffle(pool);
}

// ============================================================
// 3.2 — MODO NOMES (jogadores e goleiros)
// ============================================================
export type TimeNomes = { goleiros: Jogador[]; linha: Jogador[] };

/**
 * Distribui jogadores em `numTimes`: goleiros embaralhados 1 por time
 * (round-robin) e jogadores de linha embaralhados round-robin.
 */
export function sortearNomes(jogadores: Jogador[], numTimes: number): TimeNomes[] {
  const times: TimeNomes[] = Array.from({ length: numTimes }, () => ({ goleiros: [], linha: [] }));
  const goleiros = shuffle(jogadores.filter((j) => j.goleiro));
  const linha = shuffle(jogadores.filter((j) => !j.goleiro));
  goleiros.forEach((g, i) => times[i % numTimes].goleiros.push(g));
  linha.forEach((p, i) => times[i % numTimes].linha.push(p));
  return times;
}

// ============================================================
// 3.3 — SORTEIO DE GOLEIROS
// ============================================================
export type ResultadoGoleiros = {
  times: (string | null)[]; // 1 goleiro (ou null) por time, em ordem
  reserva: string[]; // goleiros excedentes
  faltando: number; // times sem goleiro fixo
};

/** Sorteia 1 goleiro por time; extras vão para a reserva; faltas = null. */
export function sortearGoleiros(nomes: string[], numTimes: number): ResultadoGoleiros {
  const emb = shuffle(nomes.map((n) => n.trim()).filter(Boolean));
  const times: (string | null)[] = [];
  for (let i = 0; i < numTimes; i++) times.push(i < emb.length ? emb[i] : null);
  const reserva = emb.slice(numTimes);
  const faltando = Math.max(0, numTimes - emb.length);
  return { times, reserva, faltando };
}
