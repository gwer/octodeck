import type { Signal } from '@preact/signals';
import { SlideBaseModel } from './SlideBaseModel';

type SlideShoutModelProps = {
  rawData: Signal<string>;
  // onChange: (value: string) => void;
};

export class SlideShoutModel extends SlideBaseModel {
  constructor({ rawData }: SlideShoutModelProps) {
    super({ rawData });
  }

  static override getNewRawData() {
    return `---\ntype: shout\n---\nNew Slide`;
  }
}
