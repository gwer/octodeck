import { Signal, signal } from '@preact/signals';
import {
  frontMatterParse,
  frontMatterToRawData,
  parseSlide,
} from '../lib/slides';
import { SlideBaseModel } from './SlideBaseModel';
import { SlideCommonModel } from './SlideCommonModel';
import { SlideShoutModel } from './SlideShoutModel';

export type Styles = {
  bgColor: string;
  headingColor: string;
  fontColor: string;
  fontSize: string;
};

type SlidesListModelProps = {
  rawData: string;
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
  #stylesView!: Signal<Styles>;

  constructor({ rawData }: SlidesListModelProps) {
    this.#stylesView = signal(this.#defaultStyles);
    this.rawData = rawData || this.#DefaultSlide.getNewRawData();
    this.#stylesView.value = this.styles;
  }

  set rawData(value: string) {
    const { frontMatter, rawSlides } = this.#parseRawData(value);
    this.#frontMatter.value = frontMatter;

    this.#slides.value = rawSlides
      .split(this.#slidesSeparator)
      .map((slide) => this.createSlide(slide));
    this.#stylesView.value = this.styles;
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

  set stylesView(value: Styles) {
    this.#stylesView.value = value;
  }

  get stylesView() {
    return this.#stylesView.value;
  }

  set styles(value: Styles) {
    this.#frontMatter.value = {
      ...this.#frontMatter.value,
      ...value,
    };

    this.#stylesView.value = value;
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

  createSlide(rawData: string) {
    const SlideClass = this.getSlideClass(rawData);
    const slide = new SlideClass({
      rawData: signal(rawData),
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

  get clipboardLength() {
    return this.#clipboard.value.length;
  }
}
