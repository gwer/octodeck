import { render } from 'preact';
import { Deckstore } from '../../../lib/deckstore';
import { SlidesListModel } from '../../../models/SlidesListModel';
import { SlidesList } from '../../../components/SlidesList';
import { Styles } from '../../../components/Styles';
import { ViewNavigation } from '../../../components/Navigation';
import { effect, signal } from '@preact/signals';

const initialData = await Deckstore.getDeck();
const slidesList = new SlidesListModel({
  rawData: initialData || '',
});

const getCurrentSlideIndex = async () => {
  const slideIndexHashVal = await Deckstore.getSlide();

  if (!slideIndexHashVal) {
    return null;
  }

  const slideIndexNum = Number(slideIndexHashVal);

  if (Number.isInteger(slideIndexNum)) {
    return slideIndexNum;
  }

  return null;
};

const slideIndex = signal<number | null>(await getCurrentSlideIndex());

const app = document.getElementById('app')!;

render(
  <>
    <Styles slidesList={slidesList} />
    <SlidesList
      slidesList={slidesList}
      slideIndex={slideIndex}
      isEditable={false}
    />
    <ViewNavigation />
  </>,
  app,
);

window.addEventListener('hashchange', async () => {
  slideIndex.value = await getCurrentSlideIndex();
});

effect(() => {
  if (slideIndex.value !== null) {
    Deckstore.setSlide(slideIndex.value.toString());
  } else {
    Deckstore.setSlide('');
  }
});

document.addEventListener('keydown', (event) => {
  if (slideIndex.value === null) {
    return;
  }

  if (
    ['ArrowRight', ' '].includes(event.key) &&
    slideIndex.value < slidesList.slides.value.length - 1
  ) {
    slideIndex.value++;
    event.preventDefault();
  } else if (event.key === 'ArrowLeft' && slideIndex.value > 0) {
    slideIndex.value--;
    event.preventDefault();
  } else if (event.key === 'Escape') {
    slideIndex.value = null;
    event.preventDefault();
  }
});
