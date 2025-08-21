export const parseSlide = (rawData: string) => {
  if (rawData.trim().startsWith('---')) {
    const splitted = rawData.split('---');

    if (splitted.length > 2) {
      const frontMatter = frontMatterParse(splitted[1]);

      return {
        frontMatter: frontMatter || {},
        rawContent: splitted.slice(2).join('---').trim(),
      };
    }
  }

  return { frontMatter: {}, rawContent: rawData.trim() };
};

export const frontMatterParse = (rawData?: string): Record<string, string> => {
  if (!rawData) {
    return {};
  }

  const frontMatter: Record<string, string> = {};

  rawData.split('\n').forEach((line) => {
    const [key, value] = line.split(':');

    if (!key || !value) {
      return;
    }

    frontMatter[key.trim()] = value.trim();
  });

  return frontMatter;
};

export const frontMatterToRawData = (
  frontMatter?: Record<string, string>,
  separator: string = '---',
): string => {
  if (!frontMatter || Object.keys(frontMatter).length === 0) {
    return `${separator}\n${separator}`;
  }

  return `${separator}
${Object.entries(frontMatter)
  .map(([key, value]) => `${key}: ${value}`)
  .join('\n')}
${separator}`;
};
