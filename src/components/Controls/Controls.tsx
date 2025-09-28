import type { SlideType } from '../../models/SlidesListModel';
import { AddSlide } from './AddSlide';
import styles from './Controls.module.css';

export type ControlsProps = {
  cloneSlide: () => void;
  cutSlide: () => void;
  removeSlide: () => void;
  addSlideBefore: (type: SlideType) => void;
  addSlideAfter: (type: SlideType) => void;
  pasteSlideBefore: () => void;
  pasteSlideAfter: () => void;
  isClipboardHasItems: boolean;
};
export const Controls = ({
  cloneSlide,
  cutSlide,
  removeSlide,
  addSlideBefore,
  addSlideAfter,
  pasteSlideBefore,
  pasteSlideAfter,
  isClipboardHasItems,
}: ControlsProps) => {
  return (
    <div class={styles.controls}>
      <button class={styles.button} onClick={cloneSlide}>
        Clone
      </button>
      <button class={styles.button} onClick={cutSlide}>
        Cut
      </button>
      <button class={styles.button} onClick={removeSlide}>
        Remove
      </button>
      <AddSlide
        isClipboardHasItems={isClipboardHasItems}
        addSlide={addSlideBefore}
        pasteSlide={pasteSlideBefore}
        name="Add Before"
      />
      <AddSlide
        isClipboardHasItems={isClipboardHasItems}
        addSlide={addSlideAfter}
        pasteSlide={pasteSlideAfter}
        name="Add After"
      />
    </div>
  );
};
