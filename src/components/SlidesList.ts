import {
  frontMatterParse,
  frontMatterToRawData,
  parseSlide,
} from '../lib/slides';
import { Component } from './Component';
import { SlideBase } from './SlideBase';
import { SlideCommon } from './SlideCommon';
import { SlideShout } from './SlideShout';
import type { Styles } from './StyleEditor';

const css = `
  #slides {
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

const slidesTypesMap = {
  common: SlideCommon,
  shout: SlideShout,
};

export class SlidesList extends Component {
  #isEditable: boolean = true;
  #rawSlides!: string;
  #frontMatter!: Record<string, string>;
  #slidesSeparator: string = '\n+++\n+++\n';
  #globalFrontMatterSeparator: string = '===';
  #DefaultSlide = SlideShout;
  #defaultStyles: Styles = {
    bgColor: '#ffffff',
    headingColor: '#554444',
    fontColor: '#000000',
    fontSize: '25',
  };

  constructor({ rawData }: SlidesListProps) {
    super();
    this.rawData = rawData || this.#DefaultSlide.getNewRawData();
  }

  set rawData(value: string) {
    const { frontMatter, rawSlides } = this.#parseRawData(value);
    this.#frontMatter = frontMatter;
    this.#rawSlides = rawSlides;

    this.render();
    this.#emit('change');
  }

  get rawData() {
    return `${frontMatterToRawData(
      this.#frontMatter,
      this.#globalFrontMatterSeparator,
    )}\n${this.#rawSlides}`;
  }

  set rawSlides(value: string) {
    this.#rawSlides = value;
    this.render();
    this.#emit('change');
  }

  get rawSlides() {
    return this.#rawSlides;
  }

  set styles(value: Styles) {
    this.#frontMatter = {
      ...this.#frontMatter,
      ...value,
    };

    this.render();
    this.#emit('change');
  }

  set stylesInput(value: Styles) {
    this.#frontMatter = {
      ...this.#frontMatter,
      ...value,
    };

    this.render();
  }

  get styles() {
    return {
      bgColor: this.#frontMatter.bgColor || this.#defaultStyles.bgColor,
      headingColor:
        this.#frontMatter.headingColor || this.#defaultStyles.headingColor,
      fontColor: this.#frontMatter.fontColor || this.#defaultStyles.fontColor,
      fontSize: this.#frontMatter.fontSize || this.#defaultStyles.fontSize,
    };
  }

  #parseRawData(value: string) {
    if (value.startsWith('===')) {
      const splitted = value.split('===\n');

      if (splitted.length > 2) {
        const frontMatter = frontMatterParse(splitted[1]);
        const rawSlides = splitted.slice(2).join('===\n').trim();

        return { frontMatter, rawSlides };
      }
    }

    return { frontMatter: {}, rawSlides: value.trim() };
  }

  get #cssVariables() {
    return `
      #slides {
        --s-bg-color: ${this.styles.bgColor};
        --s-heading-color: ${this.styles.headingColor};
        --s-font-color: ${this.styles.fontColor};
        --s-font-size: ${this.styles.fontSize}px;
      }
    `;
  }

  override render() {
    this.root.innerHTML = `
      <style id="css-variables">${this.#cssVariables}</style>
      <style>${css}</style>
      <div id="slides"></div>
    `;

    const slidesEl = this.root.getElementById('slides')!;
    const slides = this.#rawSlides
      .split(this.#slidesSeparator)
      .map((slide) => this.createSlide(slide));

    for (const slide of slides) {
      slidesEl.appendChild(slide);
    }
  }

  createSlide(rawData: string) {
    const SlideClass = this.getSlideClass(rawData);
    const slide = new SlideClass({
      rawData: rawData,
      isEditable: this.#isEditable,
    });

    slide.addEventListener('slide-change', this.updateSlide.bind(this));
    slide.addEventListener('slide-add-prev', this.addSlideBefore.bind(this));
    slide.addEventListener('slide-add-next', this.addSlideAfter.bind(this));
    slide.addEventListener('slide-remove', this.removeSlide.bind(this));
    slide.addEventListener('slide-clone', this.cloneSlide.bind(this));

    return slide;
  }

  getSlideClassByType(type?: string): typeof SlideBase {
    return slidesTypesMap[type as keyof typeof slidesTypesMap] || SlideBase;
  }

  getSlideClass(rawData: string): typeof SlideBase {
    const { frontMatter } = parseSlide(rawData);

    return this.getSlideClassByType(frontMatter.type);
  }

  updateSlide(e: Event) {
    this.#updateRawDataFromSlides();
  }

  createNewSlideFromEvent(e: CustomEvent) {
    const SlideClass = this.getSlideClassByType(e.detail.type);

    return this.createSlide(SlideClass.getNewRawData());
  }

  addSlideBefore(e: CustomEvent) {
    const target = e.target as SlideBase;
    const newSlide = this.createNewSlideFromEvent(e);

    target.parentElement?.insertBefore(newSlide, target);

    this.#updateRawDataFromSlides();
  }

  addSlideAfter(e: CustomEvent) {
    const target = e.target as SlideBase;
    const newSlide = this.createNewSlideFromEvent(e);

    target.parentElement?.insertBefore(newSlide, target.nextSibling);

    this.#updateRawDataFromSlides();
  }

  removeSlide(e: CustomEvent) {
    const target = e.target as SlideBase;
    target.parentElement?.removeChild(target);

    this.#updateRawDataFromSlides();
  }

  cloneSlide(e: CustomEvent) {
    const target = e.target as SlideBase;
    const newSlide = this.createSlide(target.rawData);

    target.parentElement?.insertBefore(newSlide, target);

    this.#updateRawDataFromSlides();
  }

  get slides() {
    return Array.from(this.root.getElementById('slides')!.children).filter(
      (child) => child instanceof SlideBase,
    ) as SlideBase[];
  }

  #updateRawDataFromSlides() {
    this.#rawSlides = this.slides
      .map((slide) => slide.rawData)
      .join(this.#slidesSeparator);

    if (this.slides.length === 0) {
      this.rawSlides = this.#DefaultSlide.getNewRawData();
    }

    this.#emit('change');
  }

  #emit(event: string) {
    this.dispatchEvent(new CustomEvent(event));
  }
}

customElements.define('slides-list', SlidesList);
