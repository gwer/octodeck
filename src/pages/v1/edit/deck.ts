import { DeckEditor } from '../../../components/DeckEditor';
import { Slides } from '../../../components/Slides';
import { Octostore } from '../../../lib/octostore';
import { DeckModel } from '../../../models/DeckModel';

const initialData = await Octostore.getData();
const deck = new DeckModel(initialData || '');
deck.addEventListener('change', () => {
  Octostore.setData(deck.rawData);
});

const app = document.getElementById('app')!;

// app.appendChild(
//   new DeckEditor({
//     deck,
//     onChange: (value) => (deck.rawData = value),
//   }),
// );

app.appendChild(
  new Slides({
    deck,
  }),
);

window.addEventListener('hashchange', async () => {
  const data = await Octostore.getData();
  if (data) {
    deck.rawData = data;
  }
});
