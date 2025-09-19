import type { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import type { SlideCommonModel } from '../../models/SlideCommonModel';

type SlideCommonProps = {
  slide: SlideCommonModel;
  isEditable?: boolean;
  // onChange: (id: string, value: string) => void;
};

export const SlideCommon: FunctionComponent<SlideCommonProps> = ({
  slide,
  isEditable = false,
  // onChange,
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <h1
        ref={headingRef}
        contenteditable={isEditable ? 'plaintext-only' : 'false'}
        onFocusOut={() => {
          if (!headingRef.current) {
            return;
          }

          slide.heading = headingRef.current.innerHTML;
          // onChange(slide.id, slide.rawData);
        }}
      >
        {slide.heading}
      </h1>
      <section
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: slide.slideContent }}
        contentEditable={isEditable ? 'true' : 'false'}
        onFocusIn={() => {
          if (!contentRef.current) {
            return;
          }

          contentRef.current.innerHTML = slide.content;
          contentRef.current.setAttribute('contenteditable', 'plaintext-only');
        }}
        onFocusOut={() => {
          if (!contentRef.current) {
            return;
          }

          slide.content = contentRef.current.innerHTML;
          // onChange(slide.id, slide.rawData);
          contentRef.current.innerHTML = slide.slideContent;
          contentRef.current.setAttribute('contenteditable', 'true');
        }}
      />
    </>
  );
};
