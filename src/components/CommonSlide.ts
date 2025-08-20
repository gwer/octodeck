import type { CommonSlideModel } from '../models/CommonSlideModel';
import { Component } from './Component';

type CommonSlideProps = {
  slide: CommonSlideModel;
  isEditable?: boolean;
  addPrev: () => void;
  addNext: () => void;
  remove: () => void;
};

export class CommonSlide extends Component {
  #slide: CommonSlideModel;
  #isEditable: boolean;
  #addPrev: () => void;
  #addNext: () => void;
  #remove: () => void;
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

    #title {
      color: var(--s-heading-color);
    }

    #content {
      color: var(--s-font-color);
    }

    #content:not(:focus) {
      cursor: pointer;
    }
  `;

  constructor({
    slide,
    isEditable = false,
    addPrev,
    addNext,
    remove,
  }: CommonSlideProps) {
    super();
    this.#slide = slide;
    this.#isEditable = isEditable;
    this.#addPrev = addPrev;
    this.#addNext = addNext;
    this.#remove = remove;
  }

  override render() {
    this.root.innerHTML = `
      <style>${this.styles}</style>
      <div class="controls">
        <button id="prev">Add Prev</button>
        <button id="next">Add Next</button>
        <button id="remove">Remove</button>
      </div>
      <h1 id="title" contenteditable="${
        this.#isEditable ? 'plaintext-only' : 'false'
      }">${this.#slide.title}</h1>
      <section id="content" contenteditable="${
        this.#isEditable ? 'plaintext-only' : 'false'
      }">${this.#slide.slideContent}</section>
    `;

    const content = this.root.querySelector('#content');
    const title = this.root.querySelector('#title');
    const remove = this.root.querySelector('#remove');
    const prev = this.root.querySelector('#prev');
    const next = this.root.querySelector('#next');

    if (this.#isEditable) {
      title?.addEventListener('focusin', (e) => {
        // title.innerHTML = this.#slide.title;
      });
      title?.addEventListener('focusout', (e) => {
        this.#slide.title = title?.innerHTML || '';
      });

      content?.addEventListener('focusin', (e) => {
        content.innerHTML = this.#slide.content;
      });
      content?.addEventListener('focusout', (e) => {
        this.#slide.content = content?.innerHTML || '';
        content.innerHTML = this.#slide.slideContent;
      });
    }

    remove?.addEventListener('click', this.#remove);
    prev?.addEventListener('click', this.#addPrev);
    next?.addEventListener('click', this.#addNext);
  }

  isTheSameSlide(slide: CommonSlideModel) {
    return (
      this.#slide.title === slide.title && this.#slide.content === slide.content
    );
  }
}

customElements.define('common-slide', CommonSlide);
