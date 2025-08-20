import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { Component } from './Component';

type SlideBaseProps = {
  rawData: string;
  isEditable?: boolean;
};

export class SlideBase extends Component {
  protected _rawData!: string;
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
      <button id="next">Add Next</button>
      <button id="remove">Remove</button>
    </div>
  `;

  constructor({ rawData, isEditable = false }: SlideBaseProps) {
    super();
    this._rawData = rawData;
    this._isEditable = isEditable;
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
        content.innerHTML = this.rawData;
      });
      content?.addEventListener('focusout', (e) => {
        this.rawData = content?.innerHTML || '';
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

    remove?.addEventListener('click', () => this._emit('remove'));
    prev?.addEventListener('click', () => this._emit('addPrev'));
    next?.addEventListener('click', () => this._emit('addNext'));
  }

  set rawData(value: string) {
    this._rawData = value;
    this._emit('change');
  }

  get rawData() {
    return this._rawData;
  }

  get #slideContent() {
    return parseMarkdown(this._rawData);
  }

  protected _emit(event: string) {
    this.dispatchEvent(new CustomEvent(event));
  }
}

customElements.define('slide-base', SlideBase);
