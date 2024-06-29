export function getContrastColor(baseColor: string) {
  const black = '#000000';
  const white = '#ffffff';

  const trimmed = baseColor.replace('#', '');
  if (!/^[0-9A-F]{6}$/i.test(trimmed)) {
    console.warn('Invalid hex code supplied to getContrastColor:', baseColor);
    return black;
  }

  const rgb = [];
  for (let i = 0; i < trimmed.length; i+= 2) {
    rgb.push(parseInt(trimmed.substring(i, i+2), 16));
  }

  // https://stackoverflow.com/a/3943023
  // 150 is a luminance threshold and can be adjusted to taste
  return rgb[0]*0.299 + rgb[1]*0.587 + rgb[2]*0.114 > 150 ? black : white;
}
