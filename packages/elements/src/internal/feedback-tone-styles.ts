import { css } from 'lit'

/** Shared ink and paper tones for feedback components. */
export const feedbackToneStyles = css`
  :host {
    --_feedback-accent: var(--cad-link, #005bac);
    --_feedback-tint: var(--cad-post-it-blue-bg, #dbeafe);
  }

  :host([variant='success']) {
    --_feedback-accent: var(--cad-success-ink, #07875f);
    --_feedback-tint: var(--cad-post-it-mint-bg, #d6f5e7);
  }

  :host([variant='tip']),
  :host([variant='warning']) {
    --_feedback-accent: var(--cad-warning-ink, #b45f00);
    --_feedback-tint: var(--cad-post-it-lemon-bg, #fff1bd);
  }

  :host([variant='danger']),
  :host([variant='error']) {
    --_feedback-accent: var(--cad-danger-ink, #d52f3f);
    --_feedback-tint: var(--cad-post-it-coral-bg, #ffe0d8);
  }

  :host([variant='neutral']) {
    --_feedback-accent: var(--cad-ink-soft, #59657e);
    --_feedback-tint: color-mix(
      in srgb,
      var(--cad-surface-raised, #fff) 78%,
      #d9dfeb
    );
  }

  :host([variant='accent']) {
    --_feedback-accent: var(--cad-violet-ink, #7131b5);
    --_feedback-tint: var(--cad-sticker-violet-bg, #eadcff);
  }
`
