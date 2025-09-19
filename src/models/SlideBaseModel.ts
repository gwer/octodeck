import { type Signal, type ReadonlySignal } from '@preact/signals';

import {
  frontMatterToRawData,
  getComputedFrontMatter,
  getComputedFrontMatterRaw,
  getComputedRawContent,
} from '../lib/slides';
import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { uniqueId } from '../lib/uniqueId';

type SlideBaseModelProps = {
  rawData: Signal<string>;
  // onChange: (value: string) => void;
};

export class SlideBaseModel {
  protected _rawData!: Signal<string>;
  protected _frontMatterRaw!: ReadonlySignal<string>;
  protected _frontMatter!: ReadonlySignal<Record<string, string>>;
  protected _rawContent!: ReadonlySignal<string>;
  // protected _onChange: (value: string) => void;
  public id!: string;

  constructor({ rawData }: SlideBaseModelProps) {
    this.id = uniqueId();
    this._rawData = rawData;
    this._frontMatterRaw = getComputedFrontMatterRaw(rawData);
    this._frontMatter = getComputedFrontMatter(rawData);
    this._rawContent = getComputedRawContent(rawData);
    // this._onChange = onChange;
  }

  static getNewRawData() {
    return 'New Slide';
  }

  set rawData(value: string) {
    this._rawData.value = value;
    // this._onChange(this.rawData);
  }

  get rawData() {
    return `${frontMatterToRawData(this._frontMatter.value)}\n${
      this._rawContent.value
    }`;
  }

  get rawContent() {
    return this._rawContent;
  }

  set content(value: string) {
    this.rawData = `---\n${this._frontMatterRaw.value}\n---\n${value.trim()}`;
  }

  get content() {
    return this._rawContent.value;
  }

  get slideContent() {
    return parseMarkdown(this._rawContent.value);
  }
}
