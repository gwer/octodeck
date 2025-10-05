import type { FunctionComponent } from 'preact';
import { useRef } from 'preact/hooks';
import type { SlideCommonModel } from '../../models/SlideCommonModel';
import styles from './SlideCommon.module.css';

type SlideCommonProps = {
  slide: SlideCommonModel;
  isEditable?: boolean;
};

export const SlideCommon: FunctionComponent<SlideCommonProps> = ({
  slide,
  isEditable = false,
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
        }}
      >
        {slide.heading}
      </h1>
      <section
        ref={contentRef}
        class={styles.slideContent}
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
          contentRef.current.innerHTML = slide.slideContent;
          contentRef.current.setAttribute('contenteditable', 'true');
        }}
      />
    </>
  );
};
