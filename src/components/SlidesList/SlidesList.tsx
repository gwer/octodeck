import type { FunctionComponent } from 'preact';
import type { SlidesListModel, SlideType } from '../../models/SlidesListModel';
import { Slide } from '../Slide';
import './SlidesList.css';

export type SlidesListProps = {
  slidesList: SlidesListModel;
  isEditable?: boolean;
};

export const SlidesList: FunctionComponent<SlidesListProps> = ({
  slidesList,
  isEditable = false,
}) => {
  const slides = slidesList.slides;

  return (
    <div class="slidesList">
      {slides.value.map((slide) => {
        return (
          <Slide
            key={slide.id}
            slide={slide}
            isEditable={isEditable}
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
