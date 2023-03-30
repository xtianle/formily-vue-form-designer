import { defineComponent } from 'vue'
import { observer } from '@formily/reactive-vue'
import { useDesigner, useWorkbench } from '../hooks'
import { Workspace } from './Workspace'

export const Workbench = observer(
  defineComponent({
    name: 'Workbench',
    setup(props, { slots }) {
      const designerRef = useDesigner()
      return () => {
        const workbench = useWorkbench(designerRef)
        return (
          <Workspace id={workbench.currentWorkspace?.id}>
            {slots?.default()}
          </Workspace>
        )
      }
    },
  })
)
