import type { FunctionComponent } from 'preact';
import type { SlideShoutModel } from '../../models/SlideShoutModel';
import { SlideBase } from '../SlideBase/SlideBase';

type SlideShoutProps = {
  slide: SlideShoutModel;
  isEditable?: boolean;
};

export const SlideShout: FunctionComponent<SlideShoutProps> = ({
  slide,
  isEditable = false,
}) => {
  return (
    // ToDo: add shout styles
    <SlideBase slide={slide} isEditable={isEditable} />
  );
};
