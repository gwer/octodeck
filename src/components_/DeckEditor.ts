import { Component } from './Component';
import { SlidesList } from './SlidesList';

const css = `
  #textarea {
    width: 600px;
    min-height: 100px;
    field-sizing: content;
  }
`;

const tpl = document.createElement('template');
tpl.innerHTML = `
  <style>${css}</style>
  <textarea id="textarea"></textarea>
`;

type DeckEditorProps = {
  slides: SlidesList;
  onChange: (value: string) => void;
};

export class DeckEditor extends Component {
  #textarea: HTMLTextAreaElement | null = null;
  #slides: SlidesList;
  #onChange: (value: string) => void;

  constructor({ slides, onChange }: DeckEditorProps) {
    super();
    this.#slides = slides;
    this.#slides.addEventListener('change', this.update.bind(this));
    this.#onChange = onChange;
  }

  override render() {
    this.root.innerHTML = '';
    this.root.appendChild(tpl.content.cloneNode(true));
    this.#textarea = this.root.querySelector(
      '#textarea',
    ) as HTMLTextAreaElement;
    this.#textarea.addEventListener('input', this.handleInput.bind(this));

    this.update();
  }

  update() {
    this.#textarea!.value = this.#slides.rawData;
  }

  private handleInput() {
    this.#onChange(this.#textarea!.value);
  }
}

customElements.define('deck-editor', DeckEditor);
