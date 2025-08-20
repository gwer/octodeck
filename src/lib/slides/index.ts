import { parse as parseYaml } from '../../vendor/yeahml';

export const parseSlide = (rawData: string) => {
  if (rawData.trim().startsWith('---')) {
    const splitted = rawData.split('---');

    if (splitted.length > 2) {
      const frontMatter = parseYaml(splitted[1]);

      return {
        frontMatter,
        rawContent: splitted.slice(2).join('---').trim(),
      };
    }

    return {
      frontMatter: {},
      rawContent: rawData.trim(),
    };
  }

  return { frontMatter: {}, rawContent: rawData.trim() };
};

export const frontMatterToRawData = (
  frontMatter?: Record<string, string>,
): string => {
  if (!frontMatter) {
    return '';
  }

  return `---
    ${Object.entries(frontMatter)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')}
    ---`;
};
