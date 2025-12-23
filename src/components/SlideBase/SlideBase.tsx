import type { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import type { SlideBaseModel } from '../../models/SlideBaseModel';
import styles from './SlideBase.module.css';

type SlideBaseProps = {
  slide: SlideBaseModel;
  isEditable?: boolean;
  isShout?: boolean;
};

export const SlideBase: FunctionComponent<SlideBaseProps> = ({
  slide,
  isEditable = false,
  isShout = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      class={isShout ? styles.slideContent_shout : styles.slideContent}
      dangerouslySetInnerHTML={{ __html: slide.slideContent }}
      contentEditable={isEditable ? 'true' : 'false'}
      onFocusIn={() => {
        if (!ref.current) {
          return;
        }

        if (!isEditable) {
          return;
        }

        ref.current.innerHTML = slide.rawContent.value;
        ref.current.setAttribute('contenteditable', 'plaintext-only');
      }}
      onFocusOut={() => {
        if (!ref.current) {
          return;
        }

        if (!isEditable) {
          return;
        }

        slide.content = ref.current.innerHTML;
        ref.current.innerHTML = slide.slideContent;
        ref.current.setAttribute('contenteditable', 'true');
      }}
    />
  );
};
