/** Prefixa caminhos de /public com o basePath (GitHub Pages serve em /<repo>). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (p: string) => `${BASE_PATH}${p}`;
