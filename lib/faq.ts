export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "Preciso saber usar IA para aproveitar a plataforma?",
    a: "Não. Cada módulo tem um modo Iniciante com poucos campos e linguagem simples. O modo Avançado libera mais controle quando você quiser.",
  },
  {
    q: "A plataforma gera as imagens e vídeos direto?",
    a: "Nesta versão ela gera o prompt profissional. Você leva esse prompt para a ferramenta indicada (Google Flow, Midjourney, Runway…) e faz a geração lá.",
  },
  {
    q: "Qual a diferença entre prompt de imagem e de vídeo?",
    a: "São estruturas diferentes. Use o prompt de imagem só para gerar imagens e o de vídeo só para vídeos — não misture os dois no mesmo campo da ferramenta.",
  },
  {
    q: "Que foto devo enviar como referência?",
    a: "Uma foto real, bem enquadrada e com boa luz do imóvel, cômodo ou terreno. Ângulos retos preservam melhor a arquitetura no resultado.",
  },
  {
    q: "Meus favoritos e histórico ficam salvos onde?",
    a: "Nesta versão, apenas no seu navegador. Trocar de dispositivo ou limpar os dados do site apaga a lista.",
  },
  {
    q: "Posso usar um módulo depois do outro?",
    a: "Sim, e é recomendado. Vários módulos indicam o próximo passo — por exemplo, gerar a casa no terreno e depois transformá-la em vídeo.",
  },
  {
    q: "O que é o modo JSON no prompt?",
    a: "Um formato estruturado, com parâmetros separados (câmera, animação, fidelidade, negativos). Útil em ferramentas que lidam bem com instruções organizadas.",
  },
  {
    q: "Os planos Pro e Premium mudam o quê?",
    a: "Liberam módulos marcados como Pro/Premium — geralmente os de vídeo e os cinematográficos. Os módulos de imagem essenciais são abertos.",
  },
  {
    q: "A IA vai inventar cômodos ou mudar meu terreno?",
    a: "Os módulos que usam foto de referência aplicam regras de fidelidade para preservar estrutura, perspectiva e limites. Ainda assim, revise o resultado antes de publicar.",
  },
  {
    q: "Como peço ajuda com um resultado ruim?",
    a: "Use o Assistente IA, opção ‘Corrigir resultado’. Descreva o que saiu errado e o que esperava — ele devolve um prompt corretivo.",
  },
];
