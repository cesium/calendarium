export function reduceOpacity(hexColor) {
  // Convert HEX color code to RGBA color code
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  let a = 0.25; // 25% opacity
  let rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  return rgbaColor;
}

export const defaultColors = [
  "#f07c54", // cesium
  "#4BC0D9", // 1st year
  "#7b54f0", // 2nd year
  "#f0547b", // 3rd year
  "#5ac77b", // 4th year
  "#395B50", // 5th year
  "#b70a0a", // uminho
  "#3408fd", // sei
  "#642580", // coderdojo
  "#FF0000", // join
  "#1B69EE", // jordi
];

export const OpcoesUMinho: number[] = [
  116, 117, 118, 119, 1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118,
  1119, 1120,
];

export const Opcoes3Ano: number[] = [326, 327, 328, 329];
