export function replaceDots(url: string): string {
  return url.replace(/[.]/gi, "-");
}
