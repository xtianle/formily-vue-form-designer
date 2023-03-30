import { defineComponent } from 'vue'
import { observer } from '@formily/reactive-vue'
import dayjs from 'dayjs'
import { useDesigner, usePrefix, useWorkbench } from '../../hooks'
import cls from 'classnames'
import { TextWidget } from '../TextWidget'

import './styles.less'

export const HistoryWidget = observer(
  defineComponent({
    name: 'HistoryWidget',
    setup() {
      const prefix = usePrefix('history')
      const designerRef = useDesigner()
      return () => {
        const workbench = useWorkbench(designerRef)
        const currentWorkspace =
          workbench?.activeWorkspace || workbench?.currentWorkspace
        if (!currentWorkspace) return null
        return (
          <div class={prefix}>
            {currentWorkspace.history.list().map((item, index) => {
              const type = item.type || 'default_state'
              const token = type.replace(/\:/g, '_')
              return (
                <div
                  class={cls(prefix + '-item', {
                    active: currentWorkspace.history.current === index,
                  })}
                  key={item.timestamp}
                  onClick={() => {
                    currentWorkspace.history.goTo(index)
                  }}
                >
                  <span class={prefix + '-item-title'}>
                    <TextWidget token={`operations.${token}`} />
                  </span>
                  <span class={prefix + '-item-timestamp'}>
                    {dayjs(item.timestamp).format('YY/MM/DD HH:mm:ss')}
                  </span>
                </div>
              )
            })}
          </div>
        )
      }
    },
  })
)
