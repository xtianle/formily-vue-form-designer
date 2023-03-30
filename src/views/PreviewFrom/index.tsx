import FormContentPage from '@/packages/expose/FormContentPage'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PreviewFrom',
  setup() {
    return () => {
      return <FormContentPage />
    }
  },
})
