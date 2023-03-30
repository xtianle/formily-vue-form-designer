import { useLayout } from './useLayout'

export const usePrefix = (after = '') => {
  const layout = useLayout()
  return layout.value?.prefixCls + after
}
