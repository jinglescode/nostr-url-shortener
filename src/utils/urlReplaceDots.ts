export function urlReplaceDots(url: string): string {
  return url.replace(/[.]/gi, "-");
}
