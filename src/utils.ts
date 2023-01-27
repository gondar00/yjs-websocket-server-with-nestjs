export const getCookie = (cookie: string, n: string): string => {
  if (!cookie) return '';
  const a = `; ${cookie}`.match(`;\\s*${n}=([^;]+)`);
  return a ? a[1] : '';
};
