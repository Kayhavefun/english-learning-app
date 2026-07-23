// 浏览器原生语音能力封装：TTS 朗读 + 语音识别（口语评测）。
// 语音识别在 Chrome / Edge 支持最好，其他浏览器自动降级。

export function speak(text: string, lang = 'en-US', voiceName?: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    if (voiceName) {
      const v = window.speechSynthesis.getVoices().find((x) => x.name === voiceName);
      if (v) u.voice = v;
    }
    window.speechSynthesis.speak(u);
  } catch {
    /* 忽略朗读失败 */
  }
}

export function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
}

export function isRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export interface RecognitionHandle {
  stop: () => void;
}

// 启动一次语音识别，结果通过 onResult 返回；出错走 onError
export function recognize(
  lang: string,
  onResult: (transcript: string) => void,
  onError?: (message: string) => void
): RecognitionHandle | null {
  if (typeof window === 'undefined') return null;
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) {
    onError?.('当前浏览器不支持语音识别，建议使用 Chrome 或 Edge。');
    return null;
  }
  try {
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript as string;
      onResult(transcript);
    };
    rec.onerror = (e: any) => {
      onError?.(e?.error ? String(e.error) : '语音识别出错');
    };
    rec.start();
    return {
      stop: () => {
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
      },
    };
  } catch {
    onError?.('无法启动语音识别');
    return null;
  }
}
