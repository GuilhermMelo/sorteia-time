<div align="center">

<img src="./assets/logo-racha-1024.png" width="140" alt="M&M Sorteia Time" />

# M&M Sorteia Time

**Sorteie times de futebol na pelada de forma rápida e divertida.**

100% offline · sem login · dados só no seu aparelho

[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000?logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=black)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Plataforma](https://img.shields.io/badge/Android-APK-3DDC84?logo=android&logoColor=white)](#-gerar-o-apk-eas)
[![Testes](https://img.shields.io/badge/testes-15%20passando-2FA05A)](#-testes)

</div>

---

## ⚽ O que é

App Android para sortear times em peladas e rachas. Três modos de sorteio,
histórico dos últimos jogos e uma identidade visual escura com gradiente
verde→azul. Tudo funciona **sem internet** e **sem cadastro** — abre e usa.

## ✨ Funcionalidades

- **Modo Toque** — cada jogador toca a tela e a tela inteira vira a cor do seu
  time, com o número grande da ordem do time. Calcula o nº de times a partir do
  total de jogadores e de quantos por time; avisa em vermelho quando a divisão
  não fecha (o último time fica de próximo).
- **Modo Nomes** — digite a lista (com goleiros 🧤) e sorteie times equilibrados,
  1 goleiro por time. Re-sorteie sem perder a lista.
- **Sorteio de Goleiros** — 1 goleiro para cada time; excedentes vão para a
  reserva; faltas aparecem com aviso vermelho.
- **Histórico** — guarda os últimos 10 sorteios (FIFO), expansível e com data/hora
  no nome. Persiste ao fechar o app.
- **Offline de verdade** — nenhuma chamada de rede, nenhum backend. Tudo em
  `AsyncStorage`, no aparelho.

## 📱 Telas

| | |
|---|---|
| **Home** | logo flutuante, atalhos para os 3 modos e histórico |
| **Modo Toque** | configuração → tela de toque → resumo dos times |
| **Modo Nomes** | lista de jogadores → cards por time |
| **Goleiros** | lista de goleiros → 1 por time + reserva |
| **Histórico** | últimos 10 sorteios, expansíveis |

> 📸 _Rode no Expo Go (abaixo) e adicione seus próprios screenshots em `docs/`._

## 🚀 Rodar em desenvolvimento

Pré-requisitos: [Node.js 18+](https://nodejs.org) e o app **Expo Go** no celular
(Play Store).

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go. O app abre no celular com recarga automática.

## 📦 Gerar o APK (EAS)

O APK final (instalável sem o Expo Go) é gerado na nuvem do Expo:

```bash
npm install -g eas-cli
eas login                 # conta grátis em expo.dev
eas build -p android --profile preview
```

O profile **`preview`** produz um **APK** (o `production` gera `.aab` para a Play
Store). Ao terminar, o EAS devolve um link para baixar e instalar o APK.

> Alternativa **offline** (sem nuvem): `npx expo prebuild -p android` e depois
> `cd android && ./gradlew assembleRelease` — requer o Android SDK instalado.

## 🧪 Testes

A lógica de sorteio é pura e coberta por testes (Jest):

```bash
npm test
```

## 🎨 Assets

O logo (camisa + bola, gradiente verde→azul) é **gerado por código** e
reproduzível:

```bash
node scripts/gen-assets.mjs
```

Isso monta o SVG vetorial (`assets/logo-racha.svg`) e rasteriza o ícone, o
adaptive-icon, a splash e o recorte transparente.

## 🧱 Estrutura

```
mm-sorteia-time/
├── App.tsx                 # raiz: fontes, splash, providers
├── app.json                # config Expo (ícone, splash, package)
├── eas.json                # perfis de build (preview = APK)
├── scripts/gen-assets.mjs  # gerador do logo/ícone/splash
└── src/
    ├── theme.ts            # paleta, gradiente, cores dos times, fontes
    ├── storage.ts          # AsyncStorage (histórico FIFO 10, listas, config)
    ├── sorteio.ts          # regras + Fisher-Yates (puro, testável)
    ├── store.tsx           # estado global (Context)
    ├── navigation.tsx      # navegação por pilha (sem libs)
    ├── Router.tsx          # mapeia rota → tela
    ├── components/         # Botões, Card, Stepper, CardTime, animações…
    └── screens/            # Home, Config, Tap*, Names, Goleiros, History
```

## 🛠️ Stack

- **Expo SDK 57** · **React Native 0.86** · **TypeScript** (strict)
- `react-native-reanimated` — animações (pop na revelação, cascata, transições)
- `expo-linear-gradient` — gradiente da marca e véu de fundo
- `@react-native-async-storage/async-storage` — persistência local
- `@expo-google-fonts` — Bebas Neue + Inter

## 📄 Licença

MIT — veja [LICENSE](./LICENSE).

<div align="center">
<sub>Feito para a pelada de quinta ⚽</sub>
</div>
