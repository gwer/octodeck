import type { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import type { SlideBaseModel } from '../../models/SlideBaseModel';

type SlideBaseProps = {
  slide: SlideBaseModel;
  isEditable?: boolean;
};

export const SlideBase: FunctionComponent<SlideBaseProps> = ({
  slide,
  isEditable = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: slide.slideContent }}
      contentEditable={isEditable ? 'true' : 'false'}
      onFocusIn={() => {
        if (!ref.current) {
          return;
        }

        ref.current.innerHTML = slide.rawContent.value;
        ref.current.setAttribute('contenteditable', 'plaintext-only');
      }}
      onFocusOut={() => {
        if (!ref.current) {
          return;
        }

        slide.content = ref.current.innerHTML;
        ref.current.innerHTML = slide.slideContent;
        ref.current.setAttribute('contenteditable', 'true');
      }}
    />
  );
};
