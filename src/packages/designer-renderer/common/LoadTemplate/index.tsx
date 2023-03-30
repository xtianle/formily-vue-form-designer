import { defineComponent, PropType, VNode, CSSProperties } from 'vue'
import { NodeActionsWidget } from '@designer-main-body'

export interface ITemplateAction {
  title: VNode
  tooltip?: VNode
  icon?: string | VNode
  onClick: () => void
}

export interface ILoadTemplateProps {
  className?: string
  style?: CSSProperties
  actions?: ITemplateAction[]
}

export const LoadTemplate = defineComponent({
  name: 'LoadTemplate',
  props: { actions: Array as PropType<Array<ITemplateAction>> },
  setup(props) {
    return () => {
      return (
        <NodeActionsWidget>
          {props.actions?.map((action, key) => {
            return <NodeActionsWidget.Action {...action} key={key} />
          })}
        </NodeActionsWidget>
      )
    }
  },
})
