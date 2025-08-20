import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { SlideBase } from './SlideBase';

type SlideShoutProps = {
  rawData: string;
  isEditable?: boolean;
};

export class SlideShout extends SlideBase {
  override _styles = `
    #content {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
      justify-content: center;
      color: var(--s-heading-color);
      font-size: 3em;
      font-weight: bold;
    }
  `;

  constructor({ rawData, isEditable = false }: SlideShoutProps) {
    super({ rawData, isEditable });
  }

  static override getNewRawData() {
    return `
      ---
      type: shout
      ---
      New Slide
    `;
  }
}

customElements.define('slide-shout', SlideShout);
