/**
 * Persistência local (AsyncStorage) — seção 3.4/3.5 do manifesto.
 * Nada sai do aparelho. Guarda: jogadores, goleiros, config global e o
 * histórico dos últimos 10 sorteios (FIFO).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Tipos de domínio ----
export type Jogador = { id: string; nome: string; goleiro: boolean };

export type Config = {
  qtdTimes: number; // 2..10 (usado por Nomes e Goleiros)
  porTime: number; // 1..11
};

export type TipoSorteio = 'toque' | 'nomes' | 'goleiros';

export type LinhaDetalhe = {
  ordem: number; // 1-based; ordem do time
  corIndex: number; // índice em CORES_TIMES
  titulo: string; // ex.: "1 · TIME AZUL"
  itens: string[]; // nomes / descrição
  incompleto?: boolean; // time incompleto (fica de próximo)
  comecaJogando?: boolean;
  semGoleiro?: boolean;
};

export type Registro = {
  id: string;
  name: string; // sorteio-{tipo}_{DD}-{MM}-{AAAA}_{HH}h{mm}
  tipo: TipoSorteio;
  resumo: string; // ex.: "3 times · 13 jogadores"
  detalhe: LinhaDetalhe[];
  reserva?: string[]; // goleiros/jogadores na reserva
  aviso?: string; // aviso vermelho (ex.: time incompleto)
};

const K = {
  historico: '@mmsorteia/historico',
  jogadores: '@mmsorteia/jogadores',
  goleiros: '@mmsorteia/goleiros',
  config: '@mmsorteia/config',
} as const;

export const MAX_HISTORICO = 10;
export const CONFIG_PADRAO: Config = { qtdTimes: 2, porTime: 5 };

// ---- Helpers ----
async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
async function writeJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silencioso: app é offline e não deve quebrar por falha de disco
  }
}

/** id simples e único o bastante para uso local (sem libs externas). */
let _seq = 0;
export function novoId(): string {
  _seq = (_seq + 1) % 1e6;
  return `${Date.now().toString(36)}-${_seq.toString(36)}`;
}

/** Nome padronizado do registro: sorteio-{tipo}_{DD}-{MM}-{AAAA}_{HH}h{mm} */
export function nomeRegistro(tipo: TipoSorteio, d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `sorteio-${tipo}_${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}_${p(
    d.getHours()
  )}h${p(d.getMinutes())}`;
}

// ---- Config global ----
export const carregarConfig = () => readJSON<Config>(K.config, CONFIG_PADRAO);
export const salvarConfig = (c: Config) => writeJSON(K.config, c);

// ---- Jogadores (modo Nomes) ----
export const carregarJogadores = () => readJSON<Jogador[]>(K.jogadores, []);
export const salvarJogadores = (js: Jogador[]) => writeJSON(K.jogadores, js);

// ---- Goleiros (sorteio de goleiros): lista de nomes ----
export const carregarGoleiros = () => readJSON<string[]>(K.goleiros, []);
export const salvarGoleiros = (gs: string[]) => writeJSON(K.goleiros, gs);

// ---- Histórico (FIFO, máx. 10) ----
export const carregarHistorico = () => readJSON<Registro[]>(K.historico, []);

/**
 * Adiciona um registro ao histórico. Mantém no máximo MAX_HISTORICO itens;
 * ao inserir o 11º, o mais antigo é descartado (FIFO). Mais recente primeiro.
 */
export async function adicionarHistorico(
  reg: Omit<Registro, 'id' | 'name'> & { name?: string }
): Promise<Registro[]> {
  const atual = await carregarHistorico();
  const registro: Registro = {
    id: novoId(),
    name: reg.name ?? nomeRegistro(reg.tipo),
    tipo: reg.tipo,
    resumo: reg.resumo,
    detalhe: reg.detalhe,
    reserva: reg.reserva,
    aviso: reg.aviso,
  };
  const novo = [registro, ...atual].slice(0, MAX_HISTORICO);
  await writeJSON(K.historico, novo);
  return novo;
}

export async function removerHistorico(id: string): Promise<Registro[]> {
  const atual = await carregarHistorico();
  const novo = atual.filter((r) => r.id !== id);
  await writeJSON(K.historico, novo);
  return novo;
}
