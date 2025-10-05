import { computed, type ReadonlySignal, type Signal } from '@preact/signals';
import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';
import { SlideBaseModel } from './SlideBaseModel';

type SlideCommonModelProps = {
  rawData: Signal<string>;
};

export class SlideCommonModel extends SlideBaseModel {
  #heading!: ReadonlySignal<string>;
  #content!: ReadonlySignal<string>;

  constructor({ rawData }: SlideCommonModelProps) {
    super({ rawData });

    this.#heading = computed(() => {
      if (this._rawContent.value.startsWith('# ')) {
        return this._rawContent.value.split('\n')[0]?.slice(2) || '';
      }
      return '';
    });

    this.#content = computed(() => {
      if (this._rawContent.value.startsWith('# ')) {
        return this._rawContent.value.split('\n').slice(1).join('\n') || '';
      }
      return this._rawContent.value || '';
    });
  }

  static override getNewRawData() {
    return '---\ntype: common\n---\n# Heading\nContent';
  }

  set heading(value: string) {
    this._rawData.value = `---\n${
      this._frontMatterRaw.value
    }\n---\n# ${value.trim()}\n${this.#content.value}`;
  }

  get heading(): ReadonlySignal<string> {
    return this.#heading;
  }

  override set content(value: string) {
    this._rawData.value = `---\n${this._frontMatterRaw.value}\n---\n# ${
      this.#heading.value
    }\n${value.trim()}`;
  }

  override get content(): string {
    return this.#content.value;
  }

  override get slideContent() {
    return parseMarkdown(this.#content.value);
  }
}
