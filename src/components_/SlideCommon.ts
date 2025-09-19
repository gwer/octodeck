import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { SlideBase } from './SlideBase';

type SlideCommonProps = {
  rawData: string;
  isEditable?: boolean;
};

export class SlideCommon extends SlideBase {
  #heading!: string;
  #content!: string;
  override _styles = `
    #heading {
      color: var(--s-heading-color);
    }
  `;

  constructor({ rawData, isEditable = false }: SlideCommonProps) {
    super({ rawData, isEditable });
    this.rawContent = this._rawContent;
  }

  static override getNewRawData() {
    return '---\ntype: common\n---\n# Heading\nContent';
  }

  override render() {
    this.root.innerHTML = `
      ${this.css}
      ${this.controls}
      <h1 id="heading" contenteditable="${
        this._isEditable ? 'plaintext-only' : 'false'
      }">${this.#heading}</h1>
      <section id="content" contenteditable="${
        this._isEditable ? 'true' : 'false'
      }">${this.#slideContent}</section>
    `;

    const content = this.root.querySelector('#content');
    const heading = this.root.querySelector('#heading');

    if (this._isEditable) {
      heading?.addEventListener('focusout', (e) => {
        this.heading = heading?.innerHTML || '';
      });

      content?.addEventListener('focusin', (e) => {
        content.innerHTML = this.content;
        content.setAttribute('contenteditable', 'plaintext-only');
      });
      content?.addEventListener('focusout', (e) => {
        this.content = content?.innerHTML || '';
        content.innerHTML = this.#slideContent;
        content.setAttribute('contenteditable', 'true');
      });
    }

    this._initControls();
  }

  set heading(value: string) {
    this.#heading = value.trim();
    this._emit('slide-change');
  }

  get heading() {
    return this.#heading;
  }

  set content(value: string) {
    this.#content = value.trim();
    this._emit('slide-change');
  }

  get content() {
    return this.#content;
  }

  override set rawContent(value: string) {
    if (value.startsWith('# ')) {
      this.#heading = value.split('\n')[0]?.slice(2) || '';
      this.#content = value.split('\n').slice(1).join('\n') || '';
    } else {
      this.#content = value || '';
    }
  }

  override get rawContent() {
    return `# ${this.#heading}\n${this.#content}`;
  }

  get #slideContent() {
    return parseMarkdown(this.#content);
  }
}

customElements.define('slide-common', SlideCommon);
