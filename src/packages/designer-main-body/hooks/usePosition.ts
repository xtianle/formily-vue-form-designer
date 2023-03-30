import { useLayout } from './useLayout'

export const usePosition = () => {
  const layout = useLayout()
  return layout.value?.position
}
