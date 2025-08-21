import { DeckEditor } from '../../../components/DeckEditor';
import { SlidesList } from '../../../components/SlidesList';
import { StyleEditor } from '../../../components/StyleEditor';
import { Octostore } from '../../../lib/octostore';

const initialData = await Octostore.getData();
const app = document.getElementById('app')!;

const slides = new SlidesList({
  rawData: initialData || '',
});

const isEditorEnabled = false;

if (isEditorEnabled) {
  const editor = new DeckEditor({
    slides,
    onChange: (value) => (slides.rawData = value),
  });

  app.appendChild(editor);
}

const styleEditor = new StyleEditor({
  styles: slides.styles,
});

styleEditor.addEventListener('styles-input', () => {
  slides.stylesInput = styleEditor.styles;
});

styleEditor.addEventListener('styles-change', () => {
  slides.styles = styleEditor.styles;
});

app.appendChild(styleEditor);

slides.addEventListener('change', () => {
  Octostore.setData(slides.rawData);
});

app.appendChild(slides);

window.addEventListener('hashchange', async () => {
  const data = await Octostore.getData();

  if (data && data !== slides.rawData) {
    slides.rawData = data;
  }

  if (styleEditor.styles !== slides.styles) {
    styleEditor.styles = slides.styles;
  }
});
