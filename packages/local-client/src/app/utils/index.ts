const generateId = () => {
  return Math.random().toString(36).substring(2, 5);
};

const delay = (msc: any) => new Promise((resolve) => setTimeout(resolve, msc));

export { generateId, delay };
