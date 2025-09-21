import type { FunctionComponent, JSX } from 'preact';
import type { SlideType } from '../../models/SlidesListModel';
import { SlideBaseModel } from '../../models/SlideBaseModel';
import { SlideCommonModel } from '../../models/SlideCommonModel';
import { SlideShoutModel } from '../../models/SlideShoutModel';
import { Controls } from '../Controls/Controls';
import { SlideBase } from '../SlideBase';
import { SlideCommon } from '../SlideCommon';
import { SlideShout } from '../SlideShout';
import './Slide.css';

type SlideModel = SlideBaseModel | SlideCommonModel | SlideShoutModel;

type SlideProps = {
  slide: SlideModel;
  isEditable?: boolean;
  cloneSlide: () => void;
  cutSlide: () => void;
  removeSlide: () => void;
  addSlideBefore: (type: SlideType) => void;
  addSlideAfter: (type: SlideType) => void;
  pasteSlideBefore: () => void;
  pasteSlideAfter: () => void;
};

type SlideContentProps = {
  slide: SlideModel;
  isEditable?: boolean;
};

const getSlideContent = ({
  slide,
  isEditable,
}: SlideContentProps): JSX.Element => {
  if (slide instanceof SlideCommonModel) {
    return <SlideCommon slide={slide} isEditable={isEditable} />;
  }
  if (slide instanceof SlideShoutModel) {
    return <SlideShout slide={slide} isEditable={isEditable} />;
  }
  return <SlideBase slide={slide} isEditable={isEditable} />;
};

export const Slide: FunctionComponent<SlideProps> = ({
  slide,
  isEditable = false,
  cloneSlide,
  cutSlide,
  removeSlide,
  addSlideBefore,
  addSlideAfter,
  pasteSlideBefore,
  pasteSlideAfter,
}) => {
  return (
    <div className="slide">
      <Controls
        cloneSlide={cloneSlide}
        cutSlide={cutSlide}
        removeSlide={removeSlide}
        addSlideBefore={addSlideBefore}
        addSlideAfter={addSlideAfter}
        pasteSlideBefore={pasteSlideBefore}
        pasteSlideAfter={pasteSlideAfter}
      />
      {getSlideContent({
        slide,
        isEditable,
      })}
    </div>
  );
};
