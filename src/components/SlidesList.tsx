import type { FunctionComponent } from 'preact';
import type { SlidesListModel } from '../models/SlidesListModel';
import { Slide } from './Slide';

export type SlidesListProps = {
  slidesList: SlidesListModel;
  // onChange: (value: string) => void;
  isEditable?: boolean;
};

export const SlidesList: FunctionComponent<SlidesListProps> = ({
  slidesList,
  // onChange,
  isEditable = false,
}) => {
  const slides = slidesList.slides;

  // const onSlideChange = (id: string, value: string) => {
  //   slidesList.updateSlide(id, value);
  //   onChange(slidesList.rawData);
  // };

  return (
    <div>
      {slides.value.map((slide) => {
        return (
          <Slide
            key={slide.id}
            slide={slide}
            isEditable={isEditable}
            // onChange={onSlideChange}
          />
        );
      })}
    </div>
  );
};
