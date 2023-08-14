import { headers } from 'next/headers';

export function getSupportedImageFormat(): 'avif' | 'webp' | 'jpeg' {
  const headersInstance = headers();
  const accept = headersInstance.get("accept") || '';

  const formatMap: Record<string, 'avif' | 'webp' | 'jpeg'> = {
    'image/avif': 'avif',
    'image/webp': 'webp'
  };

  for (let mime in formatMap) {
    if (accept.includes(mime)) {
      return formatMap[mime];
    }
  }

  return 'jpeg';  // default
}
