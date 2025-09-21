// import { OctodeckModes } from '../../../components/OctodeckModes';
import { render } from 'preact';
import { SlidesList } from '../../../components/SlidesList';
import { Octostore } from '../../../lib/octostore';
import { SlidesListModel } from '../../../models/SlidesListModel';
import { DeckEditor } from '../../../components/DeckEditor/DeckEditor';
import { effect } from '@preact/signals';

const isEditorEnabled = false;
const initialData = await Octostore.getData();
const slidesList = new SlidesListModel({
  rawData: initialData || '',
});

effect(() => {
  Octostore.setData(slidesList.rawData);
});

const app = document.getElementById('app')!;

render(
  <div>
    {isEditorEnabled && <DeckEditor slides={slidesList} />}
    <SlidesList slidesList={slidesList} isEditable={true} />
  </div>,
  app,
);

// const modes = new OctodeckModes({ currentMode: 'edit' });
// app.appendChild(modes);

window.addEventListener('hashchange', async () => {
  const data = await Octostore.getData();

  if (data && data !== slidesList.rawData) {
    slidesList.rawData = data;
  }
});
