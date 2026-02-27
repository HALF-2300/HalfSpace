// WebGL detection utility
export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

export function getWebGLInfo(): {
  supported: boolean;
  renderer?: string;
  vendor?: string;
} {
  if (typeof window === 'undefined') {
    return { supported: false };
  }
  
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false };
    }
    
    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo
      ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : 'Unknown';
    const vendor = debugInfo
      ? (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      : 'Unknown';
    
    return {
      supported: true,
      renderer,
      vendor,
    };
  } catch (e) {
    return { supported: false };
  }
}
