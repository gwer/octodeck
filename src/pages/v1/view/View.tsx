import { render } from 'preact';
import { Octostore } from '../../../lib/octostore';
import { SlidesListModel } from '../../../models/SlidesListModel';
import { SlidesList } from '../../../components/SlidesList';
import { Styles } from '../../../components/Styles';

const initialData = await Octostore.getData();
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
