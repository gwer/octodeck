import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { Component } from './Component';

type CommonSlideProps = {
  rawData: string;
  isEditable?: boolean;
};

export class CommonSlide extends Component {
  #isEditable: boolean;
  #heading!: string;
  #content!: string;
  styles = `
    :host {
      width: var(--s-width, 1024px);
      height: var(--s-height, calc(1024px / (16/9)));
      display: block;
      font-size: var(--s-font-size, 25px);
      line-height: var(--s-line-height, 2);
      padding: 2em;
      background-color: var(--s-background-color, #fff);
      border: 1px solid #ccc;
      border-radius: 2px;
      box-sizing: border-box;
      box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.3);
      transform: scale(var(--s-scale, 1));
      transform-origin: 0 0;
    }

    [contenteditable] {
      margin: 0 -1rem;
      padding: 0 1rem;
    }

    p, ol, ul {
      margin-top: 0;
    }

    .controls {
      position: absolute;
      top: 1em;
      right: 1em;
      display: flex;
      gap: 1em;
      justify-content: flex-end;
    }

    #heading {
      color: var(--s-heading-color);
    }

    #content {
      color: var(--s-font-color);
    }

    #content:not(:focus) {
      cursor: pointer;
    }
  `;

  constructor({ rawData, isEditable = false }: CommonSlideProps) {
    super();
    this.rawData = rawData;
    this.#isEditable = isEditable;
  }

  override render() {
    this.root.innerHTML = `
      <style>${this.styles}</style>
      <div class="controls">
        <button id="prev">Add Prev</button>
        <button id="next">Add Next</button>
        <button id="remove">Remove</button>
      </div>
      <h1 id="heading" contenteditable="${
        this.#isEditable ? 'plaintext-only' : 'false'
      }">${this.#heading}</h1>
      <section id="content" contenteditable="${
        this.#isEditable ? 'plaintext-only' : 'false'
      }">${this.#slideContent}</section>
    `;

    const content = this.root.querySelector('#content');
    const heading = this.root.querySelector('#heading');
    const remove = this.root.querySelector('#remove');
    const prev = this.root.querySelector('#prev');
    const next = this.root.querySelector('#next');

    if (this.#isEditable) {
      heading?.addEventListener('focusin', (e) => {
        // heading.innerHTML = this.#heading;
      });
      heading?.addEventListener('focusout', (e) => {
        this.heading = heading?.innerHTML || '';
      });

      content?.addEventListener('focusin', (e) => {
        content.innerHTML = this.content;
      });
      content?.addEventListener('focusout', (e) => {
        this.content = content?.innerHTML || '';
        content.innerHTML = this.#slideContent;
      });
    }

    remove?.addEventListener('click', () => this.#emit('remove'));
    prev?.addEventListener('click', () => this.#emit('addPrev'));
    next?.addEventListener('click', () => this.#emit('addNext'));
  }

  set heading(value: string) {
    this.#heading = value.trim();
    this.#emit('change');
  }

  get heading() {
    return this.#heading;
  }

  set content(value: string) {
    this.#content = value.trim();
    this.#emit('change');
  }

  get content() {
    return this.#content;
  }

  set rawData(value: string) {
    if (value.startsWith('# ')) {
      this.#heading = value.split('\n')[0]?.slice(2) || '';
      this.#content = value.split('\n').slice(1).join('\n') || '';
    } else {
      this.#content = value || '';
    }
  }

  get rawData() {
    return `# ${this.#heading}\n${this.#content}`;
  }

  get #slideContent() {
    return parseMarkdown(this.#content);
  }

  #emit(event: string) {
    this.dispatchEvent(new CustomEvent(event));
  }
}

customElements.define('common-slide', CommonSlide);
