import type { SlidesListModel, Styles } from '../../models/SlidesListModel';
import './StyleEditor.css';

export type StyleEditorProps = {
  slidesList: SlidesListModel;
};

export const StyleEditor = ({ slidesList }: StyleEditorProps) => {
  const styles = slidesList.stylesView;
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

      handler({ ...styles, [name]: value });
    };
  };

  const handlers = {
    onInput: handle(onInput),
    onChange: handle(onChange),
  };

  return (
    <div class="styleEditor">
      <label>
        <span>Background Color:</span>
        <input
          name="bgColor"
          type="color"
          value={styles.bgColor}
          {...handlers}
        />
      </label>
      <label>
        <span>Heading Color:</span>
        <input
          name="headingColor"
          type="color"
          value={styles.headingColor}
          {...handlers}
        />
      </label>
      <label>
        <span>Font Color:</span>
        <input
          name="fontColor"
          type="color"
          value={styles.fontColor}
          {...handlers}
        />
      </label>
      <label>
        <span>Font Size:</span>
        <input
          name="fontSize"
          type="number"
          min="10"
          max="200"
          value={styles.fontSize}
          {...handlers}
        />
      </label>
    </div>
  );
};
