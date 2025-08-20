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

type SlidesListProps = {
  rawData: string;
};

export class SlidesList extends Component {
  #isEditable: boolean = true;
  #rawData!: string;
  #slidesSeparator: string = '\n+++\n+++\n';
  #newSlide = '# Heading\nContent';

  constructor({ rawData }: SlidesListProps) {
    super();
    this.rawData = rawData || this.#newSlide;
  }

  set rawData(value: string) {
    this.#rawData = value;

    this.render();
    this.#emit('change');
  }

  get rawData() {
    return this.#rawData;
  }

  override render() {
    this.root.innerHTML = `
      <style>${css}</style>
      <div class="slides"></div>
    `;

    const slidesEl = this.root.querySelector('.slides')!;
    const slides = this.#rawData
      .split(this.#slidesSeparator)
      .map((slide) => this.createSlide(slide));

    for (const slide of slides) {
      slidesEl.appendChild(slide);
    }
  }

  createSlide(rawData: string) {
    const slide = new CommonSlide({
      rawData: rawData,
      isEditable: this.#isEditable,
    });

    slide.addEventListener('change', this.updateSlide.bind(this));
    slide.addEventListener('addPrev', (e) => this.addSlideBefore(e));
    slide.addEventListener('addNext', (e) => this.addSlideAfter(e));
    slide.addEventListener('remove', (e) => this.removeSlide(e));

    return slide;
  }

  updateSlide(e: Event) {
    this.#updateRawDataFromSlides();
  }

  addSlideBefore(e: Event, rawData?: string) {
    const target = e.target as CommonSlide;
    const newSlide = new CommonSlide({
      rawData: rawData || this.#newSlide,
      isEditable: this.#isEditable,
    });

    target.parentElement?.insertBefore(newSlide, target);

    this.#updateRawDataFromSlides();
  }

  addSlideAfter(e: Event, rawData?: string) {
    const target = e.target as CommonSlide;
    const newSlide = new CommonSlide({
      rawData: rawData || this.#newSlide,
      isEditable: this.#isEditable,
    });

    target.parentElement?.insertBefore(newSlide, target.nextSibling);

    this.#updateRawDataFromSlides();
  }

  removeSlide(e: Event) {
    const target = e.target as CommonSlide;
    target.parentElement?.removeChild(target);

    this.#updateRawDataFromSlides();
  }

  get slides() {
    return Array.from(
      this.root.querySelectorAll('common-slide') as NodeListOf<CommonSlide>,
    );
  }

  #updateRawDataFromSlides() {
    this.#rawData = this.slides
      .map((slide) => slide.rawData)
      .join(this.#slidesSeparator);

    if (this.slides.length === 0) {
      this.rawData = this.#newSlide;
      this.render();
    }

    this.#emit('change');
  }

  #emit(event: string) {
    this.dispatchEvent(new CustomEvent(event));
  }
}

customElements.define('slides-list', SlidesList);
