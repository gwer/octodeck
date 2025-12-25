import { effect, Signal, signal, type ReadonlySignal } from '@preact/signals';
import { Deckstore } from '../lib/deckstore';
import type { SlidesListModel } from './SlidesListModel';

export class PresentationModel {
  #slideIndex: Signal<number | null>;
  #slidesList: SlidesListModel;

  static async create(slidesList: SlidesListModel) {
    return new PresentationModel(slidesList, await this.getCurrentSlideIndex());
  }

  private constructor(
    slidesList: SlidesListModel,
    initialSlideIndex: number | null,
  ) {
    this.#slideIndex = signal(initialSlideIndex);
    this.#slidesList = slidesList;

    window.addEventListener('hashchange', async () => {
      this.#slideIndex.value = await PresentationModel.getCurrentSlideIndex();
    });

    effect(() => {
      if (this.#slideIndex.value !== null) {
        Deckstore.setSlide(this.#slideIndex.value.toString());
      } else {
        Deckstore.setSlide('');
      }
    });
  }

  get slideIndex(): ReadonlySignal<number | null> {
    return this.#slideIndex;
  }

  startPresentation() {
    if (this.#slideIndex.value === null) {
      this.#slideIndex.value = 0;
    }
  }

  stopPresentation() {
    this.#slideIndex.value = null;
  }

  prevSlide() {
    if (this.#slideIndex.value === null) {
      return;
    }

    if (this.#slideIndex.value <= 0) {
      return;
    }

    this.#slideIndex.value--;
  }

  nextSlide() {
    if (this.#slideIndex.value === null) {
      return;
    }

    if (this.#slideIndex.value >= this.#slidesList.slides.value.length - 1) {
      return;
    }

    this.#slideIndex.value++;
  }

  private static async getCurrentSlideIndex() {
    const slideIndexHashVal = await Deckstore.getSlide();

    if (!slideIndexHashVal) {
      return null;
    }

    const slideIndexNum = Number(slideIndexHashVal);

    if (Number.isInteger(slideIndexNum)) {
      return slideIndexNum;
    }

    return null;
  }
}
