import {
  defineComponent,
  onMounted,
  onBeforeUnmount,
  ref,
  computed,
  inject
} from 'vue'
import { observer } from '@formily/reactive-vue'
import { connect, mapProps } from '@formily/vue'
import { createBehavior, createResource } from '@designable/core'
import { createVoidFieldSchema } from '../Field'
import { AllLocales } from '../../locales'
import { AllSchemas } from '../../schemas'

const IframeBoxCom = observer(
  defineComponent({
    name: 'IframeBox',
    props: {
      url: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      console.log('props.url', props.url)
      const isDesignEnv = inject('isDesignEnv', false)
      const style = {
        height: '100%',
        width: '100%',
        border: 'none',
        display: 'block'
      }
      const domRef = ref()
      const renderKey = ref(`${new Date().getTime()}`)
      const isShowRef = ref(false)

      // 由于element-ui的选项卡中 内容通过display控制显示隐藏的
      // 在选项卡中使用iframe时，会出现奇怪现象
      // 这里通过使用IntersectionObserver 监听当前组件是否处于显示状态，给iframe设置key来强制渲染iframe内容
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          isShowRef.value = true
          renderKey.value = `${new Date().getTime()}`
        } else {
          isShowRef.value = false
        }
      })
      onMounted(() => {
        if (!isDesignEnv && domRef.value) {
          observer.observe(domRef.value)
        }
      })
      onBeforeUnmount(() => {
        if (observer) {
          if (domRef.value) {
            observer.unobserve?.(domRef.value)
          }
          observer.disconnect?.()
        }
      })
      const isLocal = computed(() => {
        return (
          window.origin == 'http://localhost:9996' ||
          window.origin == 'http://127.0.0.1:9996'
        )
      })
      const srcUrl = computed(() => {
        if (isLocal.value) {
          return props.url
            .replace('http://172.16.15.180/fs', window.location.origin)
            .replace('http://localhost/fs/', window.location.origin)
        } else {
          return props.url
        }
      })
      return () => {
        return (
          <div style={style} ref={domRef}>
            {isDesignEnv || !isShowRef.value ? (
              <div style={style} class="iframe-box-empty-content">
                iframe 盒子
              </div>
            ) : (
              <iframe
                key={props.url + renderKey.value}
                style={style}
                frameborder="0"
                scrolling="auto"
                // src={props.url}
                src={srcUrl.value}
              />
            )}
          </div>
        )
      }
    }
  })
)

const IframeBoxInner = connect(IframeBoxCom, mapProps({}))

const Behavior = createBehavior({
  name: 'IframeBox',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'IframeBox',
  designerProps: {
    propsSchema: createVoidFieldSchema(AllSchemas.IframeBox)
  },
  designerLocales: AllLocales.IframeBox
})

const Resource = createResource({
  icon: 'IframeBox',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'string',
        'x-component': 'IframeBox',
        'x-component-props': {}
      }
    }
  ]
})

export const IframeBox = Object.assign(IframeBoxInner, { Behavior, Resource })
