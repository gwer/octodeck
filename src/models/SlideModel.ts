import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';

export class Slide extends EventTarget {
  #rawData!: string;

  constructor(rawData: string) {
    super();
    this.rawData = rawData || '';
  }

  set rawData(value: string) {
    this.#rawData = value;
    this.#emit('change');
  }

  get rawData() {
    return this.#rawData;
  }

  get slide() {
    return parseMarkdown(this.#rawData);
  }

  #emit(event: string) {
    this.dispatchEvent(new CustomEvent(event));
  }
}
