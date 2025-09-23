import type { JSX } from 'preact/jsx-runtime';
import type { SlideType } from '../../models/SlidesListModel';

type AddSlideProps = {
  name: string;
  addSlide: (type: SlideType) => void;
  pasteSlide: () => void;
};

export const AddSlide = ({ name, addSlide, pasteSlide }: AddSlideProps) => {
  const handleAddSlide = (e: JSX.TargetedEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;

    if (!target) {
      return;
    }

    const value = target.value;

    if (['common', 'shout'].includes(value)) {
      addSlide(value as SlideType);
    } else if (value === 'paste') {
      pasteSlide();
    } else {
      console.error('Invalid value', value);
    }

    target.value = '';
  };

  return (
    <select onChange={handleAddSlide}>
      <option value="" style={{ color: '#666', fontWeight: 'bold' }}>
        {name}
      </option>
      <option value="common">New Common</option>
      <option value="shout">New Shout</option>
      <option value="paste" data-paste-option>
        Paste
      </option>
    </select>
  );
};
