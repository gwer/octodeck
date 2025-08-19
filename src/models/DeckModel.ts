import { CommonSlideModel } from './CommonSlideModel';

export class DeckModel extends EventTarget {
  #rawData!: string;
  #slidesSeparator: string = '\n+++\n+++\n';
  #newSlide = '# Heading\nContent';

  constructor(rawData: string) {
    super();
    this.rawData = rawData || this.#newSlide;
  }

  set rawData(value: string) {
    this.#rawData = value;
    this.#emit('change');
  }

  get rawData() {
    return this.#rawData;
  }

  get slides() {
    return this.#rawData.split(this.#slidesSeparator).map(
      (slide, index) =>
        new CommonSlideModel({
          rawData: slide,
          onChange: (rawData) => this.updateSlide(index, rawData),
        }),
    );
  }

  updateSlide(index: number, rawData: string) {
    this.rawData = this.#rawData
      .split(this.#slidesSeparator)
      .map((slide, i) => (i === index ? rawData : slide))
      .join(this.#slidesSeparator);
  }

  addSlide(index: number, rawData?: string) {
    const slides = this.#rawData.split(this.#slidesSeparator);
    slides.splice(index, 0, rawData || this.#newSlide);
    this.rawData = slides.join(this.#slidesSeparator);
  }

  removeSlide(index: number) {
    const slides = this.#rawData.split(this.#slidesSeparator);
    slides.splice(index, 1);
    this.rawData = slides.join(this.#slidesSeparator);
  }

  #emit(event: string) {
    this.dispatchEvent(new CustomEvent(event));
  }
}
