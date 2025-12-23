import { render } from 'preact';
import { Deckstore } from '../../../lib/deckstore';
import { SlidesListModel } from '../../../models/SlidesListModel';
import { DeckEditor } from '../../../components/DeckEditor/DeckEditor';
import { SlidesList } from '../../../components/SlidesList';
import { StyleEditor } from '../../../components/StyleEditor';
import { Styles } from '../../../components/Styles';
import { EditNavigation } from '../../../components/Navigation';
import { effect } from '@preact/signals';

const isEditorEnabled = false;
const initialData = await Deckstore.getDeck();
const slidesList = new SlidesListModel({
  rawData: initialData || '',
});

const app = document.getElementById('app')!;

render(
  <>
    <Styles slidesList={slidesList} />
    <StyleEditor slidesList={slidesList} />
    {isEditorEnabled && <DeckEditor slides={slidesList} />}
    <SlidesList slidesList={slidesList} isEditable={true} />
    <EditNavigation />
  </>,
  app,
);

/**
 * Syncronization between the model and the store
 */

let isSyncInProgress = false;

effect(() => {
  const updateIfChanged = async (data: string) => {
    // Skip cyclic update between the model and the store
    if (isSyncInProgress) {
      return;
    }

    if ((await Deckstore.getDeck()) === data) {
      return;
    }

    Deckstore.setDeck(data);
  };

  // It's important to read the signal in the synchronous part of the effect
  // for correct subscription on the signal
  updateIfChanged(slidesList.rawData);
});

window.addEventListener('hashchange', async () => {
  const data = await Deckstore.getDeck();

  if (data && data !== slidesList.rawData) {
    isSyncInProgress = true;
    slidesList.rawData = data;
    isSyncInProgress = false;
  }
});
