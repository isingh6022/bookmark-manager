export function getBorderCSS(width: string, color: string, suffix = '') {
  return width && color && width !== '0' && width !== '0px'
    ? `border${suffix ? '-' + suffix : ''}: ${width} solid ${color};`
    : '';
}
