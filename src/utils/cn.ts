// src/utils/cn.ts
export function cn(...xs: Array<string | false | undefined | null>) {
  return xs.filter(Boolean).join(' ');
}
