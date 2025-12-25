import { render } from 'preact';
import { Deckstore } from '../../../lib/deckstore';
import { SlidesListModel } from '../../../models/SlidesListModel';
import { PresentationModel } from '../../../models/PresentationModel';
import { SlidesList } from '../../../components/SlidesList';
import { Styles } from '../../../components/Styles';
import { ViewNavigation } from '../../../components/Navigation';

const initialData = await Deckstore.getDeck();
const slidesList = new SlidesListModel({
  rawData: initialData || '',
});
const presentation = await PresentationModel.create(slidesList);

const app = document.getElementById('app')!;

render(
  <>
    <Styles slidesList={slidesList} />
    <SlidesList
      slidesList={slidesList}
      slideIndex={presentation.slideIndex}
      isEditable={false}
    />
    <ViewNavigation />
  </>,
  app,
);

document.addEventListener('keydown', (event) => {
  if (presentation.slideIndex.value === null) {
    if (event.key === 'Enter') {
      presentation.startPresentation();
      event.preventDefault();
    }

    return;
  }

  if (['ArrowRight', ' '].includes(event.key)) {
    presentation.nextSlide();
    event.preventDefault();
  } else if (event.key === 'ArrowLeft') {
    presentation.prevSlide();
    event.preventDefault();
  } else if (event.key === 'Escape') {
    presentation.stopPresentation();
    event.preventDefault();
  }
});

const isTouchDevice = window.matchMedia(
  '(hover: none) and (pointer: coarse)',
).matches;

if (isTouchDevice) {
  document.addEventListener('click', (e) => {
    const { width, height } = document.documentElement.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    const isTopClick = y < height / 4;
    if (isTopClick) {
      presentation.stopPresentation();
      return;
    }

    const isLeftClick = x < width / 4;
    if (isLeftClick) {
      presentation.prevSlide();
      return;
    }

    const isRightClick = x > width - width / 4;
    if (isRightClick) {
      presentation.nextSlide();
      return;
    }
  });
}
