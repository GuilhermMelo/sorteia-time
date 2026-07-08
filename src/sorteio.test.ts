/**
 * Testes da lógica de sorteio (regras do manifesto, seção 3).
 * Foco em invariantes — não na ordem exata, já que o embaralhamento é aleatório.
 */
import { describe, expect, it } from '@jest/globals';
import {
  montarPoolToque,
  planejarToque,
  shuffle,
  sortearGoleiros,
  sortearNomes,
} from './sorteio';
import type { Jogador } from './storage';

const jogador = (nome: string, goleiro = false): Jogador => ({ id: nome, nome, goleiro });

const conta = (arr: number[]): Record<number, number> =>
  arr.reduce<Record<number, number>>((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {});

describe('shuffle (Fisher-Yates)', () => {
  it('mantém o tamanho e os mesmos elementos', () => {
    const orig = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(orig);
    expect(out).toHaveLength(orig.length);
    expect([...out].sort((a, b) => a - b)).toEqual(orig);
  });

  it('não muta o array original', () => {
    const orig = [1, 2, 3];
    const copia = [...orig];
    shuffle(orig);
    expect(orig).toEqual(copia);
  });
});

describe('planejarToque', () => {
  it('divisão exata: 10 jogadores, 5 por time -> 2 times cheios', () => {
    const p = planejarToque(10, 5);
    expect(p.numTimes).toBe(2);
    expect(p.distribuicao).toEqual([5, 5]);
    expect(p.fecha).toBe(true);
    expect(p.incompletoIndex).toBe(-1);
    expect(p.valido).toBe(true);
  });

  it('divisão que não fecha: 13 jogadores, 5 por time -> [5,5,3], último incompleto', () => {
    const p = planejarToque(13, 5);
    expect(p.numTimes).toBe(3);
    expect(p.distribuicao).toEqual([5, 5, 3]);
    expect(p.fecha).toBe(false);
    expect(p.incompletoIndex).toBe(2);
    expect(p.valido).toBe(true);
  });

  it('o incompleto é sempre o último e os anteriores ficam cheios', () => {
    const p = planejarToque(11, 4);
    expect(p.distribuicao).toEqual([4, 4, 3]);
    expect(p.distribuicao.slice(0, -1).every((q) => q === 4)).toBe(true);
  });

  it('a soma da distribuição é sempre igual ao total', () => {
    for (const [total, porTime] of [
      [7, 2],
      [22, 4],
      [30, 7],
      [2, 1],
      [99, 11],
    ]) {
      const p = planejarToque(total, porTime);
      expect(p.distribuicao.reduce((a, b) => a + b, 0)).toBe(total);
    }
  });

  it('acima de 10 times marca excedeMax e invalida', () => {
    const p = planejarToque(100, 5); // 20 times
    expect(p.numTimes).toBe(20);
    expect(p.excedeMax).toBe(true);
    expect(p.valido).toBe(false);
  });

  it('exatamente 10 times ainda é válido', () => {
    const p = planejarToque(50, 5);
    expect(p.numTimes).toBe(10);
    expect(p.excedeMax).toBe(false);
    expect(p.valido).toBe(true);
  });
});

describe('montarPoolToque', () => {
  it('cria uma vaga por jogador e respeita a contagem por time', () => {
    const plano = planejarToque(13, 5); // [5,5,3]
    const pool = montarPoolToque(plano);
    expect(pool).toHaveLength(13);
    const c = conta(pool);
    expect(c[0]).toBe(5);
    expect(c[1]).toBe(5);
    expect(c[2]).toBe(3);
  });
});

describe('sortearNomes', () => {
  const jogadores = [
    jogador('G1', true),
    jogador('G2', true),
    jogador('A'),
    jogador('B'),
    jogador('C'),
    jogador('D'),
    jogador('E'),
    jogador('F'),
  ];

  it('aloca todos os jogadores exatamente uma vez', () => {
    const times = sortearNomes(jogadores, 2);
    const nomes = times.flatMap((t) => [...t.goleiros, ...t.linha]).map((j) => j.nome);
    expect(nomes.sort()).toEqual(jogadores.map((j) => j.nome).sort());
  });

  it('distribui 1 goleiro por time quando há goleiros suficientes', () => {
    const times = sortearNomes(jogadores, 2);
    times.forEach((t) => expect(t.goleiros).toHaveLength(1));
  });

  it('mantém os times de linha equilibrados (diferença <= 1)', () => {
    const times = sortearNomes(jogadores, 2);
    const tam = times.map((t) => t.linha.length);
    expect(Math.max(...tam) - Math.min(...tam)).toBeLessThanOrEqual(1);
  });
});

describe('sortearGoleiros', () => {
  it('1 goleiro por time e excedentes na reserva', () => {
    const r = sortearGoleiros(['Léo', 'Cássio', 'Weverton', 'Ederson'], 2);
    expect(r.times).toHaveLength(2);
    expect(r.times.every((g) => g !== null)).toBe(true);
    expect(r.reserva).toHaveLength(2);
    expect(r.faltando).toBe(0);
    // sem repetição entre titulares
    expect(new Set(r.times as string[]).size).toBe(2);
  });

  it('sinaliza faltas quando há menos goleiros que times', () => {
    const r = sortearGoleiros(['Léo'], 3);
    expect(r.times).toHaveLength(3);
    expect(r.times.filter((g) => g === null)).toHaveLength(2);
    expect(r.reserva).toHaveLength(0);
    expect(r.faltando).toBe(2);
  });

  it('ignora nomes em branco', () => {
    const r = sortearGoleiros(['Léo', '  ', ''], 2);
    expect(r.times.filter(Boolean)).toHaveLength(1);
    expect(r.faltando).toBe(1);
  });
});
