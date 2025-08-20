import { DeckEditor } from '../../../components/DeckEditor';
import { SlidesList } from '../../../components/SlidesList';
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

slides.addEventListener('change', () => {
  Octostore.setData(slides.rawData);
});

app.appendChild(slides);

window.addEventListener('hashchange', async () => {
  const data = await Octostore.getData();
  if (data) {
    slides.rawData = data;
  }
});
