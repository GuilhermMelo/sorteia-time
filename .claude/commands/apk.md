---
description: Gera o APK Android via EAS Build (perfil preview)
---

Gere o APK do app com `eas build -p android --profile preview` (o perfil
`preview` produz um APK instalável; `production` gera `.aab`).

Antes: confira se o `eas-cli` está instalado (`eas --version`). Se não estiver,
oriente `npm install -g eas-cli` e `eas login`. Como o login e o build são
interativos, peça para o usuário rodá-los ele mesmo (dica: prefixo `!` no prompt
do Claude Code). Ao terminar, o EAS devolve um link para baixar o APK.

Alternativa offline (sem nuvem): `npx expo prebuild -p android` e
`cd android && ./gradlew assembleRelease`.
