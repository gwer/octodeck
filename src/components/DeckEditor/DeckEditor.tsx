import type { SlidesListModel } from '../../models/SlidesListModel';

type DeckEditorProps = {
  slides: SlidesListModel;
};

export const DeckEditor = ({ slides }: DeckEditorProps) => {
  const value = slides.rawData;
  const onInputHandler = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;

    slides.rawData = value;
  };

  return (
    <div>
      <textarea
        style={{ width: '600px', minHeight: '100px', fieldSizing: 'content' }}
        value={value}
        onInput={onInputHandler}
      ></textarea>
    </div>
  );
};
