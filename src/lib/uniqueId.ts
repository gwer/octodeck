let currentId = 0;

export const uniqueId = () => {
  return `id_${currentId++}`;
};

export default uniqueId;
