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

const prevSlide = () => {
  if (slideIndex.value === null) {
    return;
  }

  if (slideIndex.value <= 0) {
    return;
  }

  slideIndex.value--;
};

const nextSlide = () => {
  if (slideIndex.value === null) {
    return;
  }

  if (slideIndex.value >= slidesList.slides.value.length - 1) {
    return;
  }

  slideIndex.value++;
};

const startPresentation = () => {
  if (slideIndex.value === null) {
    slideIndex.value = 0;
  }
};

const stopPresentation = () => {
  slideIndex.value = null;
};

document.addEventListener('keydown', (event) => {
  if (slideIndex.value === null) {
    if (event.key === 'Enter') {
      startPresentation();
      event.preventDefault();
    }

    return;
  }

  if (['ArrowRight', ' '].includes(event.key)) {
    nextSlide();
    event.preventDefault();
  } else if (event.key === 'ArrowLeft') {
    prevSlide();
    event.preventDefault();
  } else if (event.key === 'Escape') {
    stopPresentation();
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
      stopPresentation();
      return;
    }

    const isLeftClick = x < width / 4;
    if (isLeftClick) {
      prevSlide();
      return;
    }

    const isRightClick = x > width - width / 4;
    if (isRightClick) {
      nextSlide();
      return;
    }
  });
}
