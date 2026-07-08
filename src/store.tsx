/**
 * Estado global do app carregado do AsyncStorage: config, jogadores, goleiros
 * e histórico. Cada setter persiste automaticamente. 100% local.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import {
  CONFIG_PADRAO,
  adicionarHistorico,
  carregarConfig,
  carregarGoleiros,
  carregarHistorico,
  carregarJogadores,
  removerHistorico,
  salvarConfig,
  salvarGoleiros,
  salvarJogadores,
  type Config,
  type Jogador,
  type Registro,
} from './storage';

type Store = {
  pronto: boolean;
  config: Config;
  setConfig: (c: Config) => void;
  jogadores: Jogador[];
  setJogadores: (js: Jogador[]) => void;
  goleiros: string[];
  setGoleiros: (gs: string[]) => void;
  historico: Registro[];
  salvarSorteio: (reg: Parameters<typeof adicionarHistorico>[0]) => Promise<void>;
  apagarSorteio: (id: string) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [config, setConfigState] = useState<Config>(CONFIG_PADRAO);
  const [jogadores, setJogadoresState] = useState<Jogador[]>([]);
  const [goleiros, setGoleirosState] = useState<string[]>([]);
  const [historico, setHistorico] = useState<Registro[]>([]);

  useEffect(() => {
    (async () => {
      const [c, j, g, h] = await Promise.all([
        carregarConfig(),
        carregarJogadores(),
        carregarGoleiros(),
        carregarHistorico(),
      ]);
      setConfigState(c);
      setJogadoresState(j);
      setGoleirosState(g);
      setHistorico(h);
      setPronto(true);
    })();
  }, []);

  const setConfig = (c: Config) => {
    setConfigState(c);
    salvarConfig(c);
  };
  const setJogadores = (js: Jogador[]) => {
    setJogadoresState(js);
    salvarJogadores(js);
  };
  const setGoleiros = (gs: string[]) => {
    setGoleirosState(gs);
    salvarGoleiros(gs);
  };
  const salvarSorteio: Store['salvarSorteio'] = async (reg) => {
    setHistorico(await adicionarHistorico(reg));
  };
  const apagarSorteio = async (id: string) => {
    setHistorico(await removerHistorico(id));
  };

  return (
    <Ctx.Provider
      value={{
        pronto,
        config,
        setConfig,
        jogadores,
        setJogadores,
        goleiros,
        setGoleiros,
        historico,
        salvarSorteio,
        apagarSorteio,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore fora do AppProvider');
  return s;
}
