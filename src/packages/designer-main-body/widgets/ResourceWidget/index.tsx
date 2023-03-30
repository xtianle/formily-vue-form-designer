import {
  IResource,
  IResourceLike,
  isResourceHost,
  isResourceList,
} from '@designable/core'
import { observer } from '@formily/reactive-vue'
import { defineComponent, isVNode, PropType, ref } from 'vue'
import { usePrefix } from '../../hooks'
import { TextWidget } from '../TextWidget'
import cls from 'classnames'
import './styles.less'
import { IconWidget } from '../IconWidget'
export const ResourceWidget = observer(
  defineComponent({
    name: 'ResourceWidget',
    props: {
      title: {
        type: String,
        default: undefined,
      },
      sources: {
        type: Array as PropType<IResourceLike[]>,
        default: () => [],
      },
      defaultExpand: {
        type: Boolean,
        default: true,
      },
    },
    setup(props) {
      const prefix = usePrefix('resource')
      const isExpand = ref(props.defaultExpand)

      const renderNode = (source: IResource) => {
        const { node, icon, title, thumb, span } = source
        return (
          <div
            class={prefix + '-item'}
            style={{ gridColumnStart: `span ${span || 1}` }}
            key={node.id}
            data-designer-source-id={node.id}
          >
            {thumb && <img class={prefix + '-item-thumb'} src={thumb} />}
            {icon && isVNode(icon) ? (
              <>{icon}</>
            ) : (
              <IconWidget
                class={prefix + '-item-icon'}
                infer={icon}
                style={{ width: 150, height: 40 }}
              />
            )}
            <span class={prefix + '-item-text'}>
              <TextWidget
                token={title || node.children[0]?.getMessage('title')}
              />
            </span>
          </div>
        )
      }

      const sources = props.sources.reduce<IResource[]>((buf, source) => {
        if (isResourceList(source)) {
          return buf.concat(source)
        } else if (isResourceHost(source)) {
          return buf.concat(source.Resource)
        }
        return buf
      }, [])

      const remainItems =
        sources.reduce((length, source) => {
          return length + (source.span ?? 1)
        }, 0) % 3

      return () => {
        return (
          <div
            class={cls(prefix, {
              expand: isExpand.value,
            })}
          >
            <div
              class={prefix + '-header'}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                isExpand.value = !isExpand.value
              }}
            >
              <div class={prefix + '-header-expand'}>
                <IconWidget infer="Expand" size={10} />
              </div>
              <div class={prefix + '-header-content'}>
                <TextWidget token={props.title} />
              </div>
            </div>
            <div class={prefix + '-content-wrapper'}>
              <div class={prefix + '-content'}>
                {/* {sources.map(isFn(slots.default) ? slots.default : renderNode)} */}
                {sources.map(renderNode)}
                {remainItems ? (
                  <div
                    class={prefix + '-item-remain'}
                    style={{ gridColumnStart: `span ${3 - remainItems}` }}
                  ></div>
                ) : null}
              </div>
            </div>
          </div>
        )
      }
    },
  })
)
