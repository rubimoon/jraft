const generateCssContents = (data: string) => {
  const escaped = data
    .replace(/\n/g, "")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

  return `
    const style = document.createElement('style');
    style.innerText = '${escaped}';
    document.head.appendChild(style);
    `;
};

export { generateCssContents };
