import DesignerForm from '@/packages/expose/DesignerForm'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DesignerFrom',
  setup() {
    return () => {
      return <DesignerForm />
    }
  },
})
