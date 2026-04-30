/**
 * Splits a title into per-letter spans (class="letter") for GSAP
 * char-stagger animations, while keeping each word non-breaking so
 * narrow screens wrap on word boundaries — never mid-word.
 */
export default function SplitTitle({ text }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, ci) => (
            <span key={ci} className="letter inline-block">{ch}</span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}
