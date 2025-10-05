import type { SlidesListModel } from '../../models/SlidesListModel';

export type StylesProps = {
  slidesList: SlidesListModel;
};

export const Styles = ({ slidesList }: StylesProps) => {
  const cssVariables = `
      :root {
        --s-bg-color: ${slidesList.stylesView.bgColor};
        --s-heading-color: ${slidesList.stylesView.headingColor};
        --s-font-color: ${slidesList.stylesView.fontColor};
        --s-font-size: ${slidesList.stylesView.fontSize}px;
      }
    `;

  return <style>{cssVariables}</style>;
};
