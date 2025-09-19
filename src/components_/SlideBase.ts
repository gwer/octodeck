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
    'slide-clone': SlideBaseCustomEvent;
    'slide-cut': SlideBaseCustomEvent;
    'slide-paste': SlideBaseCustomEvent;
  }
}

type SlideBaseProps = {
  rawData: string;
  isEditable?: boolean;
  isClipboardHasItems?: boolean;
};

export class SlideBase extends Component {
  protected _rawData!: string;
  protected _frontMatter!: Record<string, string>;
  protected _rawContent!: string;
  protected _isEditable!: boolean;
  protected _isClipboardHasItems!: boolean;
  protected _baseStyles = `
    :host {
      width: var(--s-width, 1024px);
      height: var(--s-height, calc(1024px / (16/9)));
      display: block;
      font-size: var(--s-font-size, 25px);
      line-height: var(--s-line-height, 2);
      padding: 2em;
      background-color: var(--s-bg-color, #fff);
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

    ol, ul {
      margin-top: 0;
    }

    p {
      margin-bottom: 0;
    }

    p:first-child {
      margin-top: 0;
    }

    hr {
      width: 100%;
    }

    table {
      border-collapse: collapse;
    }

    td, th {
      border: 1px solid var(--s-font-color);
      padding: 0.5em;
    }

    .controls {
      position: absolute;
      top: 1em;
      right: 1em;
      display: flex;
      gap: 0.5em;
      justify-content: flex-end;
    }

    :host([editable="false"]) .controls {
      display: none;
    }

    #content {
      color: var(--s-font-color);
    }

    :host([editable="true"]) #content:not(:focus) {
      cursor: pointer;
    }


    select {
      padding: 0.5em 1em;
      border-radius: 4px;
      box-sizing: border-box;
      background-color: #eee;
      height: 2.5em;
      color: #000;
      border: 1px solid #999;
      cursor: pointer;
    }

    select:hover {
      background-color: #ddd;
    }

    select:active {
      background-color: #ccc;
    }

    option {
      background-color: #fff;
    }
  `;
  protected _styles = ``;

  controls = `
    <div class="controls">
      <octodeck-button id="clone">Clone</octodeck-button>
      <octodeck-button id="cut">Cut</octodeck-button>
      <octodeck-button id="remove">Remove</octodeck-button>
      <select id="addBefore">
        <option value="" style="color: #666; font-weight: bold;">Add Before</option>
        <option value="common">New Common</option>
        <option value="shout">New Shout</option>
        <option value="paste" data-paste-option ${
          this.isClipboardHasItems ? '' : 'disabled'
        }>Paste</option>
      </select>
      <select id="addAfter">
        <option value="" style="color: #666; font-weight: bold;">Add After</option>
        <option value="common">New Common</option>
        <option value="shout">New Shout</option>
        <option value="paste" data-paste-option ${
          this.isClipboardHasItems ? '' : 'disabled'
        }>Paste</option>
      </select>
    </div>
  `;

  constructor({
    rawData,
    isEditable = false,
    isClipboardHasItems = false,
  }: SlideBaseProps) {
    super();
    this._rawData = rawData;
    this._isEditable = isEditable;
    this.setAttribute('editable', isEditable ? 'true' : 'false');
    this._isClipboardHasItems = isClipboardHasItems;
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
        this._isEditable ? 'true' : 'false'
      }">${this.#slideContent}</section>
    `;

    const content = this.root.querySelector('#content');

    if (this._isEditable) {
      content?.addEventListener('focusin', (e) => {
        content.innerHTML = this.rawContent;
        content.setAttribute('contenteditable', 'plaintext-only');
      });
      content?.addEventListener('focusout', (e) => {
        this.rawContent = content?.innerHTML || '';
        content.innerHTML = this.#slideContent;
        content.setAttribute('contenteditable', 'true');
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
    const clone = this.root.querySelector('#clone');
    const cut = this.root.querySelector('#cut');
    const remove = this.root.querySelector('#remove');
    const addBefore = this.root.querySelector('#addBefore');
    const addAfter = this.root.querySelector('#addAfter');

    clone?.addEventListener('click', () => this._emit('slide-clone'));
    cut?.addEventListener('click', () => this._emit('slide-cut'));
    remove?.addEventListener('click', () => this._emit('slide-remove'));
    addBefore?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const value = target.value;

      if (['common', 'shout'].includes(value)) {
        this._emit('slide-add-prev', { type: value });
      } else if (value === 'paste') {
        this._emit('slide-paste', { type: 'prev' });
      }

      target.value = '';
    });
    addAfter?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      const value = target.value;

      if (['common', 'shout'].includes(value)) {
        this._emit('slide-add-next', { type: value });
      } else if (value === 'paste') {
        this._emit('slide-paste', { type: 'next' });
      }

      target.value = '';
    });
  }

  set isClipboardHasItems(value: boolean) {
    this._isClipboardHasItems = value;
    const pasteOptions = this.root.querySelectorAll(
      'option[data-paste-option]',
    ) as NodeListOf<HTMLOptionElement>;

    pasteOptions.forEach((option) => {
      option.disabled = !value;
    });
  }

  get isClipboardHasItems() {
    return this._isClipboardHasItems;
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
