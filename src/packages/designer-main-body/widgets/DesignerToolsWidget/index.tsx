import { defineComponent, PropType } from 'vue'
import { observer } from '@formily/reactive-vue'
import { ElButton as Button, ElButtonGroup as ButtonGroup } from 'element-plus'
import { IconWidget } from '../IconWidget'
import {
  useCursor,
  useDesigner,
  useHistory,
  usePrefix,
  useWorkbench,
  useWorkspaceContext,
} from '../../hooks'
import { CursorType } from '@designable/core'
import cls from 'classnames'

import './styles.less'
export const DesignerToolsWidget = observer(
  defineComponent({
    name: 'DesignerToolsWidget',
    props: {
      use: {
        type: Array as PropType<string[]>,
        default: () => ['HISTORY', 'CURSOR', 'SCREEN_TYPE'],
      },
    },
    setup(props) {
      const prefix = usePrefix('designer-tools')
      const designerRef = useDesigner()
      const workspaceContextRef = useWorkspaceContext()
      return () => {
        const workbench = useWorkbench(designerRef)
        const cursor = useCursor(designerRef)
        const history = useHistory(designerRef, workspaceContextRef)

        const renderHistoryController = () => {
          if (!props.use.includes('HISTORY')) return
          return (
            <ButtonGroup
              size="small"
              style={{ marginRight: '20px' }}
              key="renderHistoryController"
            >
              <Button
                size="small"
                disabled={!history?.allowUndo}
                onClick={() => {
                  history.undo()
                }}
              >
                <IconWidget infer="Undo" />
              </Button>
              <Button
                size="small"
                disabled={!history?.allowRedo}
                onClick={() => {
                  history.redo()
                }}
              >
                <IconWidget infer="Redo" />
              </Button>
            </ButtonGroup>
          )
        }

        const renderCursorController = () => {
          if (workbench.type !== 'DESIGNABLE') return
          if (!props.use.includes('CURSOR')) return
          return (
            <ButtonGroup
              size="small"
              style={{ marginRight: '20px' }}
              key="renderCursorController"
            >
              <Button
                size="small"
                disabled={cursor.type === CursorType.Normal}
                onClick={() => {
                  cursor.setType(CursorType.Normal)
                }}
              >
                <IconWidget infer="Move" />
              </Button>
              <Button
                size="small"
                disabled={cursor.type === CursorType.Selection}
                onClick={() => {
                  cursor.setType(CursorType.Selection)
                }}
              >
                <IconWidget infer="Selection" />
              </Button>
            </ButtonGroup>
          )
        }
        return (
          <div class={cls(prefix)}>
            {renderHistoryController()}
            {renderCursorController()}
          </div>
        )
      }
    },
  })
)
