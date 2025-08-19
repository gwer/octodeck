import { DeckModel } from '../models/DeckModel';
import { Component } from './Component';

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
  deck: DeckModel;
  onChange: (value: string) => void;
};

export class DeckEditor extends Component {
  #textarea: HTMLTextAreaElement | null = null;
  #deck: DeckModel;
  #onChange: (value: string) => void;

  constructor({ deck, onChange }: DeckEditorProps) {
    super();
    this.#deck = deck;
    this.#deck.addEventListener('change', this.update.bind(this));
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
    this.#textarea!.value = this.#deck.rawData;
  }

  private handleInput() {
    this.#onChange(this.#textarea!.value);
  }
}

customElements.define('deck-editor', DeckEditor);
