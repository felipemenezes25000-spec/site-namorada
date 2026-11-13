// Tipos das importações de imagem (`import x from "…/arquivo.png"`).
// O `next-env.d.ts` traz a mesma referência, mas é gerado pelo Next e fica fora do Git;
// sem esta cópia versionada, `npm run typecheck` falha numa cópia limpa do repositório (CI).
/// <reference types="next/image-types/global" />
