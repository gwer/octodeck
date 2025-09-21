import { Signal, signal } from '@preact/signals';
import {
  frontMatterParse,
  frontMatterToRawData,
  parseSlide,
} from '../lib/slides';
import { SlideBaseModel } from './SlideBaseModel';
import { SlideCommonModel } from './SlideCommonModel';
import { SlideShoutModel } from './SlideShoutModel';

type Styles = {
  bgColor: string;
  headingColor: string;
  fontColor: string;
  fontSize: string;
};

type SlidesListModelProps = {
  rawData: string;
  // onChange: (value: string) => void;
};

export type SlideType = 'common' | 'shout';

const slidesTypesMap: Record<SlideType, typeof SlideBaseModel> = {
  common: SlideCommonModel,
  shout: SlideShoutModel,
};

export class SlidesListModel {
  #clipboard: Signal<SlideBaseModel[]> = signal([]);
  #slides: Signal<SlideBaseModel[]> = signal([]);
  #frontMatter: Signal<Record<string, string>> = signal({});
  #slidesSeparator: string = '\n+++\n+++\n';
  #globalFrontMatterSeparator: string = '===';
  #DefaultSlide = SlideCommonModel;
  #defaultStyles: Styles = {
    bgColor: '#ffffff',
    headingColor: '#554444',
    fontColor: '#000000',
    fontSize: '25',
  };
  // #onChange: (value: string) => void;

  constructor({ rawData }: SlidesListModelProps) {
    // this.#onChange = onChange;
    this.rawData = rawData || this.#DefaultSlide.getNewRawData();
  }

  set rawData(value: string) {
    const { frontMatter, rawSlides } = this.#parseRawData(value);
    this.#frontMatter.value = frontMatter;

    this.#slides.value = rawSlides
      .split(this.#slidesSeparator)
      .map((slide) => this.createSlide(slide));

    // this.#onChange(this.rawData);
  }

  get rawData() {
    return `${frontMatterToRawData(
      this.#frontMatter.value,
      this.#globalFrontMatterSeparator,
    )}\n${this.rawSlides}`;
  }

  get rawSlides() {
    return this.#slides.value
      .map((slide) => slide.rawData)
      .join(this.#slidesSeparator);
  }

  set styles(value: Styles) {
    this.#frontMatter.value = {
      ...this.#frontMatter.value,
      ...value,
    };

    // this.#onChange(this.rawData);
  }

  get styles() {
    return {
      bgColor: this.#frontMatter.value.bgColor || this.#defaultStyles.bgColor,
      headingColor:
        this.#frontMatter.value.headingColor ||
        this.#defaultStyles.headingColor,
      fontColor:
        this.#frontMatter.value.fontColor || this.#defaultStyles.fontColor,
      fontSize:
        this.#frontMatter.value.fontSize || this.#defaultStyles.fontSize,
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

  // get #cssVariables() {
  //   return `
  //     #slides {
  //       --s-bg-color: ${this.styles.bgColor};
  //       --s-heading-color: ${this.styles.headingColor};
  //       --s-font-color: ${this.styles.fontColor};
  //       --s-font-size: ${this.styles.fontSize}px;
  //     }
  //   `;
  // }

  createSlide(rawData: string) {
    const SlideClass = this.getSlideClass(rawData);
    const slide = new SlideClass({
      rawData: signal(rawData),
      // onChange: () => this.#onChange(this.rawData),
    });

    return slide;
  }

  getSlideClassByType(type?: string): typeof SlideBaseModel {
    return (
      slidesTypesMap[type as keyof typeof slidesTypesMap] || SlideBaseModel
    );
  }

  getSlideClass(rawData: string): typeof SlideBaseModel {
    const { frontMatter } = parseSlide(rawData);

    return this.getSlideClassByType(frontMatter.type);
  }

  // updateSlide(id: string, value: string) {
  //   const slide = this.#slides.value.find((slide) => slide.id === id);

  //   if (slide) {
  //     slide.rawData = value;
  //   }
  // }

  createNewSlideByType(type: SlideType) {
    const SlideClass = this.getSlideClassByType(type);

    return this.createSlide(SlideClass.getNewRawData());
  }

  getSlideIndex(target: SlideBaseModel) {
    return this.#slides.value.indexOf(target);
  }

  addSlideBefore(target: SlideBaseModel, type: SlideType) {
    const newSlide = this.createNewSlideByType(type);
    const index = this.getSlideIndex(target);

    this.#slides.value = [
      ...this.#slides.value.slice(0, index),
      newSlide,
      ...this.#slides.value.slice(index),
    ];
  }

  addSlideAfter(target: SlideBaseModel, type: SlideType) {
    const newSlide = this.createNewSlideByType(type);
    const index = this.getSlideIndex(target);

    this.#slides.value = [
      ...this.#slides.value.slice(0, index + 1),
      newSlide,
      ...this.#slides.value.slice(index + 1),
    ];
  }

  removeSlide(target: SlideBaseModel) {
    this.#slides.value = this.#slides.value.filter((slide) => slide !== target);
  }

  cutSlide(target: SlideBaseModel) {
    this.#clipboard.value = [...this.#clipboard.value, target];
    this.removeSlide(target);
  }

  cloneSlide(target: SlideBaseModel) {
    const newSlide = this.createSlide(target.rawData);
    const index = this.getSlideIndex(target);

    this.#slides.value = [
      ...this.#slides.value.slice(0, index + 1),
      newSlide,
      ...this.#slides.value.slice(index + 1),
    ];
  }

  pasteSlideBefore(target: SlideBaseModel) {
    const newSlide = this.#popClipboard();

    if (!newSlide) {
      return;
    }

    const index = this.getSlideIndex(target);

    this.#slides.value = [
      ...this.#slides.value.slice(0, index),
      newSlide,
      ...this.#slides.value.slice(index),
    ];
  }

  pasteSlideAfter(target: SlideBaseModel) {
    const newSlide = this.#popClipboard();

    if (!newSlide) {
      return;
    }

    const index = this.getSlideIndex(target);

    this.#slides.value = [
      ...this.#slides.value.slice(0, index + 1),
      newSlide,
      ...this.#slides.value.slice(index + 1),
    ];
  }

  #popClipboard() {
    if (this.#clipboard.value.length === 0) {
      return null;
    }

    const newSlide = this.#clipboard.value.at(-1);

    this.#clipboard.value = this.#clipboard.value.slice(0, -1);

    return newSlide;
  }

  get slides() {
    return this.#slides;
  }

  // #updateSlidesClipboardStatus() {
  //   this.slides.forEach((slide) => {
  //     slide.isClipboardHasItems = this.#clipboard.length > 0;
  //   });
  // }

  // #updateRawDataFromSlides() {
  //   this.#rawSlides = this.slides
  //     .map((slide) => slide.rawData)
  //     .join(this.#slidesSeparator);

  //   if (this.slides.length === 0) {
  //     this.rawSlides = this.#DefaultSlide.getNewRawData();
  //   }

  //   this.#emit('change');
  // }

  // #emit(event: string) {
  //   this.dispatchEvent(new CustomEvent(event));
  // }
}
