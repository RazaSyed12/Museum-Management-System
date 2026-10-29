export type Tone = 'olive' | 'green' | 'sand' | 'stone';

const TONES: readonly Tone[] = ['olive', 'green', 'sand', 'stone'];

/** Cycles card tones for visual variety in a grid — purely a rendering
 *  choice, not data: the real Collection/Event schema has no "tone" field. */
export function toneForIndex(index: number): Tone {
  return TONES[((index % TONES.length) + TONES.length) % TONES.length]!;
}
