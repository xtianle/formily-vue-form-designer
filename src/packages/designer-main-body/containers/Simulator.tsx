import { requestIdle } from '@designable/shared'
import { observer } from '@formily/reactive-vue'
import { defineComponent } from 'vue'
import { PCSimulator } from '../simulators'

export const Simulator = observer(
  defineComponent({
    name: 'Simulator',
    setup(props, { slots, attrs }) {
      //  const screenRef = useScreen()
      return () => {
        return (
          <PCSimulator {...attrs} {...props}>
            {slots.default?.()}
          </PCSimulator>
        )
      }
    },
  }),
  {
    scheduler: requestIdle,
  }
)
