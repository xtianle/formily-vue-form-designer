import { clone, toArr } from '@formily/shared'
import { observer } from '@formily/reactive-vue'
import { IconWidget, TextWidget, usePrefix } from '@designer-main-body'
import { INodeItem, ITreeDataSource } from './types'
import { traverseTree } from './shared'
import './styles.less'
import { defineComponent, PropType } from 'vue'

export interface ITitleProps extends INodeItem {
  treeDataSource: ITreeDataSource
}
export const Title = observer(
  defineComponent({
    name: 'Title',
    props: {
      treeDataSource: {
        type: Object as PropType<ITreeDataSource>,
        default: () => ({}),
        required: true,
      },
      node: {
        type: Object as PropType<INodeItem>,
        default: () => ({}),
        required: true,
      },
    },
    setup(props) {
      const prefix = usePrefix('data-source-setter-node-title')
      const getTitleValue = (dataSource: INodeItem['map']) => {
        const optionalKeys = ['label', 'title', 'header']
        let nodeTitle: string
        optionalKeys.some((key) => {
          const title = toArr(dataSource).find(
            (item) => item.label === key
          )?.value
          if (title !== undefined) {
            nodeTitle = title
            return true
          }
          return false
        })
        if (nodeTitle === undefined) {
          toArr(dataSource || []).some((item) => {
            if (item.value && typeof item.value === 'string') {
              nodeTitle = item.value
              return true
            }
            return false
          })
        }
        return nodeTitle
      }

      const renderTitle = (dataSource: INodeItem['map']) => {
        const nodeTitle = getTitleValue(dataSource)
        if (nodeTitle === undefined)
          return (
            <TextWidget token="SettingComponents.DataSourceSetter.defaultTitle" />
          )
        else return nodeTitle + ''
      }
      return () => {
        return (
          <div class={prefix}>
            <span style={{ marginRight: '5px' }}>
              {renderTitle(props?.node?.map || [])}
            </span>
            <IconWidget
              class={prefix + '-icon'}
              infer="Remove"
              onClick={(e) => {
                // e.stopPropagation()
                // e.preventDefault()
                const newDataSource = clone(props?.treeDataSource?.dataSource)
                traverseTree(newDataSource || [], (dataItem, i, data) => {
                  if (data[i].key === props?.node?.duplicateKey)
                    toArr(data).splice(i, 1)
                })
                props.treeDataSource.dataSource = newDataSource
                props.treeDataSource.selectedKey = undefined
              }}
            />
          </div>
        )
      }
    },
  })
)
