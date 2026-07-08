/**
 * Navegação simples por pilha (sem react-navigation, conforme o manifesto
 * permite). Cada rota carrega seus próprios params tipados.
 */
import { createContext, useContext, useState } from 'react';
import type { PlanoToque } from './sorteio';
import type { Registro } from './storage';

export type Rota =
  | { nome: 'home' }
  | { nome: 'config' }
  | { nome: 'tapSetup' }
  | { nome: 'tap'; plano: PlanoToque }
  | { nome: 'tapSummary'; registro: Registro }
  | { nome: 'names' }
  | { nome: 'gkSetup' }
  | { nome: 'history' };

export type NomeRota = Rota['nome'];

type Nav = {
  rota: Rota;
  ir: (r: Rota) => void;
  voltar: () => void;
  inicio: () => void;
  profundidade: number;
};

const Ctx = createContext<Nav | null>(null);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [pilha, setPilha] = useState<Rota[]>([{ nome: 'home' }]);
  const ir = (r: Rota) => setPilha((p) => [...p, r]);
  const voltar = () => setPilha((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const inicio = () => setPilha([{ nome: 'home' }]);
  const rota = pilha[pilha.length - 1];
  return (
    <Ctx.Provider value={{ rota, ir, voltar, inicio, profundidade: pilha.length }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNav(): Nav {
  const n = useContext(Ctx);
  if (!n) throw new Error('useNav fora do NavProvider');
  return n;
}
