import type { FunctionComponent } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
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
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = useSignal(false);
  const draft = useSignal(slide.content);

  const startEdit = () => {
    if (!isEditable) {
      return;
    }

    isEditing.value = true;
    draft.value = slide.content;
  };

  const commitEdit = () => {
    if (!isEditable) {
      return;
    }

    if (!document.hasFocus()) return;

    isEditing.value = false;
    slide.content = draft.value;
  };

  useEffect(() => {
    if (!isEditing.value) {
      return;
    }

    const textarea = contentRef.current;
    if (!textarea) {
      return;
    }

    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  }, [isEditing.value]);

  return (
    <>
      <h1
        ref={headingRef}
        contenteditable={isEditable ? 'plaintext-only' : 'false'}
        onFocusOut={() => {
          if (!headingRef.current) {
            return;
          }

          if (!isEditable) {
            return;
          }

          slide.heading = headingRef.current.innerHTML;
        }}
      >
        {slide.heading}
      </h1>

      {isEditing.value ? (
        <textarea
          ref={contentRef}
          value={draft.value}
          class={styles.contentTextarea}
          onChange={(e) => {
            if (!(e.target instanceof HTMLTextAreaElement)) {
              return;
            }

            draft.value = e.target.value;
          }}
          onBlur={commitEdit}
        />
      ) : (
        <section
          class={styles.slideContent}
          dangerouslySetInnerHTML={{ __html: slide.slideContent }}
          contentEditable={isEditable ? 'true' : 'false'}
          onFocusIn={() => {
            if (!isEditable) {
              return;
            }

            startEdit();
          }}
        />
      )}
    </>
  );
};
