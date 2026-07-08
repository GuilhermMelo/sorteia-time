/**
 * Renderiza a tela da rota atual da pilha de navegação.
 */
import { useNav } from './navigation';
import { Config, Goleiros, History, Home, Names, Tap, TapSetup, TapSummary } from './screens';

export function Router() {
  const { rota } = useNav();
  switch (rota.nome) {
    case 'home':
      return <Home />;
    case 'config':
      return <Config />;
    case 'tapSetup':
      return <TapSetup />;
    case 'tap':
      return <Tap plano={rota.plano} />;
    case 'tapSummary':
      return <TapSummary registro={rota.registro} />;
    case 'names':
      return <Names />;
    case 'gkSetup':
      return <Goleiros />;
    case 'history':
      return <History />;
  }
}
