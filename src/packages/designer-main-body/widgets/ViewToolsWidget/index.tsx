import { WorkbenchTypes } from '@designable/core'
import { observer } from '@formily/reactive-vue'
import { defineComponent, PropType } from 'vue'
import { ElButton as Button, ElButtonGroup as ButtonGroup } from 'element-plus'
import { useDesigner, usePrefix, useWorkbench } from '../../hooks'
import cls from 'classnames'
import { IconWidget } from '../IconWidget'

export const ViewToolsWidget = observer(
  defineComponent({
    name: 'ViewToolsWidget',
    props: {
      use: {
        type: Array as PropType<WorkbenchTypes[]>,
        default: () => ['DESIGNABLE', 'JSONTREE', 'PREVIEW'],
      },
    },
    setup(props) {
      const prefix = usePrefix('view-tools')
      const designerRef = useDesigner()
      return () => {
        const workbench = useWorkbench(designerRef)

        return (
          <ButtonGroup class={cls(prefix)}>
            {props.use.includes('DESIGNABLE') && (
              <Button
                disabled={workbench?.type === 'DESIGNABLE'}
                onClick={() => {
                  workbench.setWorkbenchType('DESIGNABLE')
                }}
                size="small"
              >
                <IconWidget infer="Design" />
              </Button>
            )}
            {props.use.includes('JSONTREE') && (
              <Button
                disabled={workbench?.type === 'JSONTREE'}
                onClick={() => {
                  workbench.setWorkbenchType('JSONTREE')
                }}
                size="small"
              >
                <IconWidget infer="JSON" />
              </Button>
            )}
            {props.use.includes('MARKUP') && (
              <Button
                disabled={workbench?.type === 'MARKUP'}
                onClick={() => {
                  workbench.setWorkbenchType('MARKUP')
                }}
                size="small"
              >
                <IconWidget infer="Code" />
              </Button>
            )}
            {props.use.includes('PREVIEW') && (
              <Button
                disabled={workbench?.type === 'PREVIEW'}
                onClick={() => {
                  workbench.setWorkbenchType('PREVIEW')
                }}
                size="small"
              >
                <IconWidget infer="Play" />
              </Button>
            )}
          </ButtonGroup>
        )
      }
    },
  })
)
