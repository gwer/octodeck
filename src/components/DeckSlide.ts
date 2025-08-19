import type { Slide } from '../models/SlideModel';
import { Component } from './Component';

type DeckSlideProps = {
  slide: Slide;
  isEditable?: boolean;
  onChange?: (rawData: string) => void;
};

export class DeckSlide extends Component {
  #slide: Slide;
  #isEditable: boolean;
  #onChange?: (rawData: string) => void;

  styles = `
    :host {
      width: var(--s-width, 1024px);
      height: var(--s-height, calc(1024px / (16/9)));
      display: block;
      padding: 2em;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      transform: scale(var(--s-scale, 1));
      transform-origin: 0 0;
    }
  `;

  constructor({ slide, isEditable = false, onChange }: DeckSlideProps) {
    super();
    this.#slide = slide;
    this.#isEditable = isEditable;
    this.#onChange = onChange;
  }

  override render() {
    this.root.innerHTML = `
      <style>${this.styles}</style>
      <section id="slide" contenteditable="${
        this.#isEditable ? 'plaintext-only' : 'false'
      }">${this.#slide.slide}</section>
    `;

    const slide = this.root.querySelector('#slide');

    if (this.#isEditable) {
      slide?.addEventListener('focusin', (e) => {
        slide.innerHTML = this.#slide.rawData;
      });
      slide?.addEventListener('focusout', (e) => {
        this.#onChange?.(slide?.innerHTML || '');
      });
    }
  }
}

customElements.define('deck-slide', DeckSlide);
