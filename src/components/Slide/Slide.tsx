import type { FunctionComponent, JSX } from 'preact';
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
  // onChange: (id: string, value: string) => void;
};

const getSlideContent = ({
  slide,
  isEditable,
}: // onChange,
SlideProps): JSX.Element => {
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
  // onChange,
}) => {
  return (
    <div className="slide">
      <Controls />
      {getSlideContent({ slide, isEditable })}
    </div>
  );
};
