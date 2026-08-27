import { css } from 'lit'

/** Shared ink and paper tones for feedback components. */
export const feedbackToneStyles = css`
  :host {
    --_feedback-accent: var(--cad-link, #005bac);
    --_feedback-tint: var(--cad-post-it-blue-bg, #dbeafe);
  }

  :host([variant='success']) {
    --_feedback-accent: #07875f;
    --_feedback-tint: var(--cad-post-it-mint-bg, #d6f5e7);
  }

  :host([variant='tip']),
  :host([variant='warning']) {
    --_feedback-accent: #e98212;
    --_feedback-tint: var(--cad-post-it-lemon-bg, #fff1bd);
  }

  :host([variant='danger']),
  :host([variant='error']) {
    --_feedback-accent: #f03c4f;
    --_feedback-tint: var(--cad-post-it-coral-bg, #ffe0d8);
  }

  :host([variant='neutral']) {
    --_feedback-accent: #6d7d9f;
    --_feedback-tint: color-mix(
      in srgb,
      var(--cad-surface-raised, #fff) 78%,
      #d9dfeb
    );
  }

  :host([variant='accent']) {
    --_feedback-accent: #7131b5;
    --_feedback-tint: var(--cad-sticker-violet-bg, #eadcff);
  }
`
