import type { FunctionComponent } from 'preact';
import type { Signal } from '@preact/signals';
import type { SlidesListModel, SlideType } from '../../models/SlidesListModel';
import { Slide } from '../Slide';
import styles from './SlidesList.module.css';

export type SlidesListProps = {
  slidesList: SlidesListModel;
  slideIndex?: Signal<number | null>;
  isEditable?: boolean;
};

export const SlidesList: FunctionComponent<SlidesListProps> = ({
  slidesList,
  slideIndex,
  isEditable = false,
}) => {
  const slides = slidesList.slides;

  return (
    <div class={styles.slidesList}>
      {slides.value.map((slide, index) => {
        return (
          <Slide
            key={slide.id}
            slide={slide}
            isClipboardHasItems={slidesList.clipboardLength > 0}
            isEditable={isEditable}
            isActive={slideIndex?.value === index}
            onClick={
              isEditable
                ? undefined
                : () => slideIndex && (slideIndex.value = index)
            }
            cloneSlide={() => slidesList.cloneSlide(slide)}
            cutSlide={() => slidesList.cutSlide(slide)}
            removeSlide={() => slidesList.removeSlide(slide)}
            addSlideBefore={(type: SlideType) =>
              slidesList.addSlideBefore(slide, type)
            }
            addSlideAfter={(type: SlideType) =>
              slidesList.addSlideAfter(slide, type)
            }
            pasteSlideBefore={() => slidesList.pasteSlideBefore(slide)}
            pasteSlideAfter={() => slidesList.pasteSlideAfter(slide)}
          />
        );
      })}
    </div>
  );
};
