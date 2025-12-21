import { render } from 'preact';
import { Deckstore } from '../../../lib/deckstore';
import { SlidesListModel } from '../../../models/SlidesListModel';
import { SlidesList } from '../../../components/SlidesList';
import { Styles } from '../../../components/Styles';

const initialData = await Deckstore.getDeck();
const slidesList = new SlidesListModel({
  rawData: initialData || '',
});

const app = document.getElementById('app')!;

render(
  <>
    <Styles slidesList={slidesList} />
    <SlidesList slidesList={slidesList} isEditable={false} />
  </>,
  app,
);
