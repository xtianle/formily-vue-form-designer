export const isNumSize = (val: any) => /^(\-|\+)?\d+(\.\d+)?$/.test(val)

export const addUnit = (val: number | string) => {
  return isNumSize(val) ? `${val}px` : val
}
