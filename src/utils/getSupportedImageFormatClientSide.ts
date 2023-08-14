function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function detectImageSupport(dataUri: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isBrowser()) {
      resolve(false);
      return;
    }

    const image = new Image();
    image.onerror = () => resolve(false);
    image.onload = () => resolve(true);
    image.src = dataUri;
  });
}

export async function getSupportedImageFormatClientSide(): Promise<'avif' | 'webp' | 'jpeg'> {
  const formatMap: Record<string, 'avif' | 'webp' | 'jpeg'> = {
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=": "avif",
    "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA": "webp"
  };

  const tests: Array<Promise<'avif' | 'webp' | 'jpeg'>> = [];
  for (let dataUri in formatMap) {
    tests.push(
      detectImageSupport(dataUri).then((supported) => supported ? formatMap[dataUri] : 'jpeg')
    );
  }

  // Use Promise.race to get the first resolved promise
  const format = await Promise.race(tests);

  // If neither format is supported, default to jpeg
  return format || 'jpeg';
}
