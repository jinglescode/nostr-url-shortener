export function getSupportedImageFormatClientSide(): 'avif' | 'webp' | 'jpeg' {
  const formatMap: Record<string, 'avif' | 'webp' | 'jpeg'> = {
    'image/avif': 'avif',
    'image/webp': 'webp'
  };

  for (let mime in formatMap) {
    if (window?.document?.createElement?.('canvas')?.toDataURL?.(mime)?.startsWith?.('data:' + mime)) {
      return formatMap[mime];
    }
  }

  return 'jpeg';  // default
}
