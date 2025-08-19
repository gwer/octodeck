import { parse as parseMarkdown } from '../vendor/tiny-markdown-parser';

type CommonSlideModelProps = {
  rawData: string;
  onChange?: (rawData: string) => void;
};

export class CommonSlideModel extends EventTarget {
  #title!: string;
  #content!: string;
  #onChange?: (rawData: string) => void;

  constructor({ rawData, onChange }: CommonSlideModelProps) {
    super();
    this.rawData = rawData || '';
    this.#onChange = onChange;
  }

  set title(value: string) {
    this.#title = value.trim();
    this.#onChange?.(this.rawData);
  }

  get title() {
    return this.#title;
  }

  set content(value: string) {
    this.#content = value.trim();
    this.#onChange?.(this.rawData);
  }

  get content() {
    return this.#content;
  }

  set rawData(value: string) {
    if (value.startsWith('# ')) {
      this.#title = value.split('\n')[0]?.slice(2) || '';
      this.#content = value.split('\n').slice(1).join('\n') || '';
    } else {
      this.#content = value || '';
    }
  }

  get rawData() {
    return `# ${this.#title}\n${this.#content}`;
  }

  get slideContent() {
    return parseMarkdown(this.#content);
  }
}
