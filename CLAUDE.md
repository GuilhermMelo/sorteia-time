# CLAUDE.md

Guia para o Claude Code trabalhar neste repositório.

## O que é

**M&M Sorteia Time** — app Android (Expo + React Native + TypeScript) que sorteia
times de futebol em peladas. **100% offline, sem login, sem backend**: tudo é
persistido localmente com AsyncStorage. Toda a UI e os textos são em pt-BR.

## Comandos

```bash
npm install          # instala dependências
npx expo start       # dev (abra no Expo Go via QR)
npm test             # Jest (lógica de sorteio)
npx tsc --noEmit     # checagem de tipos
npx expo-doctor      # valida config do projeto
node scripts/gen-assets.mjs   # regenera logo/ícone/splash a partir do SVG
```

APK (nuvem): `eas build -p android --profile preview` (perfil `preview` = APK;
`production` = `.aab`). Build local offline: `npx expo prebuild -p android` +
`gradlew assembleRelease`.

## Arquitetura

- `App.tsx` — carrega fontes (Bebas Neue + Inter), splash e providers.
- `src/theme.ts` — **fonte única** de paleta, gradiente, cores dos coletes e fontes.
  Sempre puxar cores/estilos daqui, nunca hardcodar hex nas telas.
- `src/storage.ts` — AsyncStorage: histórico FIFO de 10, jogadores, goleiros, config.
- `src/sorteio.ts` — **regras puras + Fisher-Yates**. Sem UI, sem side effects →
  é aqui que a lógica é testada (`src/sorteio.test.ts`). Mudou regra? Atualize o teste.
- `src/store.tsx` — estado global via Context (carrega/persiste tudo).
- `src/navigation.tsx` + `src/Router.tsx` — navegação por pilha própria (sem libs).
- `src/components/` — design system (Botões, Card, Stepper, CardTime, animações…).
- `src/screens/` — Home, Config, TapSetup, Tap, TapSummary, Names, Goleiros, History.

## Convenções

- Código e comentários em **português**; nomes de símbolos em português quando fizer
  sentido (`sortearGoleiros`, `planejarToque`).
- Animações com `react-native-reanimated` e sempre respeitando `useReducedMotion()`.
- Avisos obrigatórios (divisão que não fecha, falta de goleiro) usam `cores.warnRed`
  com borda + negrito (componente `Aviso`).
- As regras de negócio (nº de times, incompleto sempre por último, 1 goleiro por
  time, histórico FIFO 10) são fixas — não alterar sem pedido explícito.

## Antes de commitar

Rode `npx tsc --noEmit` e `npm test`. O CI (GitHub Actions) roda os dois em cada push.
