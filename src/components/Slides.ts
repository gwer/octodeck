import { DeckModel } from '../models/DeckModel';
import { Component } from './Component';
import { CommonSlide } from './CommonSlide';

const css = `
  .slides {
    display: grid;
    grid-template-columns: repeat(auto-fill, calc(var(--s-width) * var(--s-scale)));
    grid-template-rows: repeat(auto-fill, calc(var(--s-height) * var(--s-scale)));
    gap: calc(2em * var(--s-scale));
    padding: 1em;
    overflow: auto;
  }
`;

type SlidesProps = {
  deck: DeckModel;
};

export class Slides extends Component {
  #deck: DeckModel;

  constructor({ deck }: SlidesProps) {
    super();
    this.#deck = deck;
    this.#deck.addEventListener('change', this.update.bind(this));
  }

  override render() {
    this.root.innerHTML = `
      <style>${css}</style>
      <div class="slides"></div>
    `;

    const slidesEl = this.root.querySelector('.slides')!;
    for (const [index, slide] of this.#deck.slides.entries()) {
      slidesEl.appendChild(
        new CommonSlide({
          slide,
          isEditable: true,
          addPrev: () => this.#deck.addSlide(index),
          addNext: () => this.#deck.addSlide(index + 1),
          remove: () => this.#deck.removeSlide(index),
        }),
      );
    }
  }

  update() {
    const slidesEl = this.root.querySelector('.slides')!;
    if (slidesEl.children.length !== this.#deck.slides.length) {
      this.render();
      return;
    }

    for (const [index, slide] of this.#deck.slides.entries()) {
      if (!(slidesEl.children[index] as CommonSlide).isTheSameSlide(slide)) {
        slidesEl.replaceChild(
          new CommonSlide({
            slide,
            isEditable: true,
            addPrev: () => this.#deck.addSlide(index),
            addNext: () => this.#deck.addSlide(index + 1),
            remove: () => this.#deck.removeSlide(index),
          }),
          slidesEl.children[index]!,
        );
      }
    }
  }
}

customElements.define('slides-list', Slides);
