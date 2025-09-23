import type { SlideType } from '../../models/SlidesListModel';
import './Controls.css';
import { AddSlide } from './AddSlide';

export type ControlsProps = {
  cloneSlide: () => void;
  cutSlide: () => void;
  removeSlide: () => void;
  addSlideBefore: (type: SlideType) => void;
  addSlideAfter: (type: SlideType) => void;
  pasteSlideBefore: () => void;
  pasteSlideAfter: () => void;
};
export const Controls = ({
  cloneSlide,
  cutSlide,
  removeSlide,
  addSlideBefore,
  addSlideAfter,
  pasteSlideBefore,
  pasteSlideAfter,
}: ControlsProps) => {
  return (
    <div class="controls">
      <button onClick={cloneSlide}>Clone</button>
      <button onClick={cutSlide}>Cut</button>
      <button onClick={removeSlide}>Remove</button>
      <AddSlide
        addSlide={addSlideBefore}
        pasteSlide={pasteSlideBefore}
        name="Add Before"
      />
      <AddSlide
        addSlide={addSlideAfter}
        pasteSlide={pasteSlideAfter}
        name="Add After"
      />
    </div>
  );
};
