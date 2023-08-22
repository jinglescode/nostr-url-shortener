export default function removeHttp(url) {
  return url.replace(/^https?:\/\//, '');
}