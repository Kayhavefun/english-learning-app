import { speak } from '../lib/speech';

interface Props {
  text: string;
  label?: string; // aria-label
  title?: string; // 悬浮提示
  className?: string;
  voiceName?: string;
}

// 统一的「朗读」按钮：点击即朗读给定英文文本。
export default function SpeakButton({
  text,
  label = '朗读',
  title = '点击朗读',
  className = 'speak-btn',
  voiceName,
}: Props) {
  return (
    <button
      type="button"
      className={className}
      title={title}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        speak(text, 'en-US', voiceName);
      }}
    >
      🔊
    </button>
  );
}
