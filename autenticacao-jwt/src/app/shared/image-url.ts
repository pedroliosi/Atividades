const PLACEHOLDER_PRODUTO = 'https://placehold.co/320x240/eef3f8/52606d?text=Produto';
const PLACEHOLDER_CATEGORIA = 'https://placehold.co/500x360/eef3f8/52606d?text=Categoria';

export function imagemProdutoUrl(imagens: string[] | null | undefined): string {
  return normalizarImagem(imagens ?? [], PLACEHOLDER_PRODUTO);
}

export function imagemCategoriaUrl(imagem: string | null | undefined): string {
  return normalizarImagem([imagem ?? ''], PLACEHOLDER_CATEGORIA);
}

function normalizarImagem(imagens: string[], fallback: string): string {
  const valor = imagens.find(Boolean)?.trim();

  if (!valor) {
    return fallback;
  }

  const url = extrairUrl(valor);
  return /^https?:\/\//i.test(url) ? url : fallback;
}

function extrairUrl(valor: string): string {
  try {
    const parsed = JSON.parse(valor);
    if (Array.isArray(parsed)) {
      return String(parsed.find(Boolean) ?? '').trim();
    }
  } catch {
    // A API pode retornar uma string simples; nesse caso limpamos abaixo.
  }

  return valor
    .replace(/^\[+/, '')
    .replace(/\]+$/, '')
    .replace(/^["']+/, '')
    .replace(/["']+$/, '')
    .trim();
}
