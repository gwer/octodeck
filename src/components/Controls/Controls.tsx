import type { JSX } from 'preact/jsx-runtime';
import type { SlideType } from '../../models/SlidesListModel';

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
  const handleAddSlideBefore = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const value = (e.target as HTMLSelectElement)?.value;

    if (['common', 'shout'].includes(value)) {
      addSlideBefore(value as SlideType);
    } else if (value === 'paste') {
      pasteSlideBefore();
    }
  };
  const handleAddSlideAfter = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const value = (e.target as HTMLSelectElement)?.value;

    if (['common', 'shout'].includes(value)) {
      addSlideAfter(value as SlideType);
    } else if (value === 'paste') {
      pasteSlideAfter();
    }
  };
  return (
    <div class="controls">
      <button onClick={cloneSlide}>Clone</button>
      <button onClick={cutSlide}>Cut</button>
      <button onClick={removeSlide}>Remove</button>
      <select onChange={handleAddSlideBefore}>
        <option value="" style={{ color: '#666', fontWeight: 'bold' }}>
          Add Before
        </option>
        <option value="common">New Common</option>
        <option value="shout">New Shout</option>
        <option value="paste" data-paste-option>
          Paste
        </option>
      </select>
      <select onChange={handleAddSlideAfter}>
        <option value="" style={{ color: '#666', fontWeight: 'bold' }}>
          Add After
        </option>
        <option value="common">New Common</option>
        <option value="shout">New Shout</option>
        <option value="paste" data-paste-option>
          Paste
        </option>
      </select>
    </div>
  );
};
