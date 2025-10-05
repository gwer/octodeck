import type { SlidesListModel, Styles } from '../../models/SlidesListModel';
import styles from './StyleEditor.module.css';

export type StyleEditorProps = {
  slidesList: SlidesListModel;
};

export const StyleEditor = ({ slidesList }: StyleEditorProps) => {
  const stylesView = slidesList.stylesView;
  const onInput = (styles: Styles) => {
    slidesList.stylesView = styles;
  };
  const onChange = (styles: Styles) => {
    slidesList.styles = styles;
  };

  const handle = (handler: (styles: Styles) => void) => {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      const name = target.name;
      const value = target.value;

      handler({ ...stylesView, [name]: value });
    };
  };

  const handlers = {
    onInput: handle(onInput),
    onChange: handle(onChange),
  };

  return (
    <div class={styles.wrapper}>
      <label class={styles.label}>
        <span>Background Color:</span>
        <input
          name="bgColor"
          type="color"
          value={stylesView.bgColor}
          {...handlers}
        />
      </label>
      <label class={styles.label}>
        <span>Heading Color:</span>
        <input
          name="headingColor"
          type="color"
          value={stylesView.headingColor}
          {...handlers}
        />
      </label>
      <label class={styles.label}>
        <span>Font Color:</span>
        <input
          name="fontColor"
          type="color"
          value={stylesView.fontColor}
          {...handlers}
        />
      </label>
      <label class={styles.label}>
        <span>Font Size:</span>
        <input
          name="fontSize"
          type="number"
          min="10"
          max="200"
          value={stylesView.fontSize}
          {...handlers}
        />
      </label>
    </div>
  );
};
