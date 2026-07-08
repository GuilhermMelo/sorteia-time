---
description: Roda a verificação de tipos e os testes (o mesmo que o CI)
---

Rode a verificação completa do projeto, na ordem:

1. `npx tsc --noEmit` — checagem de tipos
2. `npm test` — testes (Jest)

É exatamente o que o CI (GitHub Actions) roda. Reporte falhas de forma objetiva,
com o trecho relevante da saída, e não diga que está tudo certo se algum passo
falhar.
