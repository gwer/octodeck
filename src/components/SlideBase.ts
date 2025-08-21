import { frontMatterToRawData, parseSlide } from '../lib/slides';
import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { Component } from './Component';

type SlideBaseCustomEvent = CustomEvent<{
  type?: string;
}>;

declare global {
  interface GlobalEventHandlersEventMap {
    'slide-change': SlideBaseCustomEvent;
    'slide-remove': SlideBaseCustomEvent;
    'slide-add-prev': SlideBaseCustomEvent;
    'slide-add-next': SlideBaseCustomEvent;
  }
}

type SlideBaseProps = {
  rawData: string;
  isEditable?: boolean;
};

export class SlideBase extends Component {
  protected _rawData!: string;
  protected _frontMatter!: Record<string, string>;
  protected _rawContent!: string;
  protected _isEditable!: boolean;
  protected _baseStyles = `
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
      overflow: hidden;
      transform: scale(var(--s-scale, 1));
      transform-origin: 0 0;
    }

    h1, h2, h3, h4, h5, h6 {
      color: var(--s-heading-color);
    }

    [contenteditable] {
      margin: 0 -1rem;
      padding: 0 1rem;
    }

    p, ol, ul {
      margin-top: 0;
    }

    hr {
      width: 100%;
    }

    .controls {
      position: absolute;
      top: 1em;
      right: 1em;
      display: flex;
      gap: 1em;
      justify-content: flex-end;
    }

    #content {
      color: var(--s-font-color);
    }

    #content:not(:focus) {
      cursor: pointer;
    }
  `;
  protected _styles = ``;

  controls = `
    <div class="controls">
      <button id="prev">Add Prev</button>
      <button id="prevShout">Add Prev Shout</button>
      <button id="nextShout">Add Next Shout</button>
      <button id="next">Add Next</button>
      <button id="remove">Remove</button>
    </div>
  `;

  constructor({ rawData, isEditable = false }: SlideBaseProps) {
    super();
    this._rawData = rawData;
    this._isEditable = isEditable;

    const { frontMatter, rawContent } = parseSlide(rawData);
    this._frontMatter = frontMatter;
    this._rawContent = rawContent;
  }

  static getNewRawData() {
    return 'New Slide';
  }

  override render() {
    this.root.innerHTML = `
      ${this.css}
      ${this.controls}
      <section id="content" contenteditable="${
        this._isEditable ? 'plaintext-only' : 'false'
      }">${this.#slideContent}</section>
    `;

    const content = this.root.querySelector('#content');

    if (this._isEditable) {
      content?.addEventListener('focusin', (e) => {
        content.innerHTML = this.rawContent;
      });
      content?.addEventListener('focusout', (e) => {
        this.rawContent = content?.innerHTML || '';
        content.innerHTML = this.#slideContent;
      });
    }

    this._initControls();
  }

  get css() {
    return `<style>
      ${this._baseStyles}
      ${this._styles}
    </style>`;
  }

  protected _initControls() {
    const remove = this.root.querySelector('#remove');
    const prev = this.root.querySelector('#prev');
    const next = this.root.querySelector('#next');
    const prevShout = this.root.querySelector('#prevShout');
    const nextShout = this.root.querySelector('#nextShout');

    remove?.addEventListener('click', () => this._emit('slide-remove'));
    prev?.addEventListener('click', () =>
      this._emit('slide-add-prev', { type: 'common' }),
    );
    next?.addEventListener('click', () =>
      this._emit('slide-add-next', { type: 'common' }),
    );
    prevShout?.addEventListener('click', () =>
      this._emit('slide-add-prev', { type: 'shout' }),
    );
    nextShout?.addEventListener('click', () =>
      this._emit('slide-add-next', { type: 'shout' }),
    );
  }

  set rawData(value: string) {
    const { frontMatter, rawContent } = parseSlide(value);
    this._frontMatter = frontMatter;
    this._rawContent = rawContent;
  }

  get rawData() {
    return `${frontMatterToRawData(this._frontMatter)}\n${this.rawContent}`;
  }

  get rawContent() {
    return this._rawContent;
  }

  set rawContent(value: string) {
    this._rawContent = value;
    this._emit('slide-change');
  }

  get #slideContent() {
    return parseMarkdown(this._rawContent);
  }

  protected _emit(event: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

customElements.define('slide-base', SlideBase);
