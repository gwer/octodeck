import { DeckModel } from '../models/DeckModel';
import { Component } from './Component';
import { CommonSlide } from './CommonSlide';

const css = `
  :host {
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
    `;
    for (const [index, slide] of this.#deck.slides.entries()) {
      this.root.appendChild(
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
    this.render();
  }
}

customElements.define('slides-list', Slides);
