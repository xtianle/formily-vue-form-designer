import { useLayout } from './useLayout'

export const useTheme = () => {
  const layout = useLayout()
  return layout.value?.theme
}
