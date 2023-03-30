import {
  Component,
  computed,
  defineComponent,
  onBeforeUnmount,
  PropType,
  provide,
  ref,
  shallowRef,
} from 'vue'
import { createForm, Form as IForm } from '@formily/core'

import { Form, FormLayout } from '@formily/element-plus'
import { observer } from '@formily/reactive-vue'
import { ElEmpty as Empty } from 'element-plus'
import { requestIdle, cancelIdle } from '@designable/shared'

import {
  usePrefix,
  useSelected,
  useOperation,
  useSelectedNode,
  useWorkbench,
  IconWidget,
  NodePathWidget,
  useDesigner,
  useWorkspaceContext,
} from '@designer-main-body'
import { SchemaField } from './SchemaField'
import { SettingsFormSymbol } from './shared/context'
import { useLocales, useSnapshot } from './effects'
import cls from 'classnames'
import './styles.less'

const GlobalState = {
  idleRequest: null,
}
function useKeyUp() {
  const keyboardRef = ref(false)

  const listener = () => {
    keyboardRef.value = true
  }
  window.addEventListener('keyup', listener)

  onBeforeUnmount(() => {
    window.removeEventListener('keyup', listener)
  })

  return keyboardRef
}
const SettingsFormCom = defineComponent({
  name: 'SettingsFormCom',
  props: {
    uploadAction: {
      type: String,
      default: undefined,
    },
    components: {
      type: Object as PropType<Record<string, Component<any>>>,
      default: undefined,
    },
    effects: {
      type: Function as PropType<(form: IForm) => void>,
      default: undefined,
    },
    scope: {
      type: [Object, Array, String, Number] as PropType<any>,
      default: undefined,
    },
    headers: {
      type: [Object, Array, String, Number] as PropType<any>,
      default: undefined,
    },
  },
  setup(props) {
    const keyupRef = useKeyUp()
    const prefix = usePrefix('settings-form')
    const designerRef = useDesigner()
    const workspaceContextRef = useWorkspaceContext()
    provide(
      SettingsFormSymbol,
      computed(() => props)
    )

    const formRef = shallowRef<IForm>(createForm())

    return () => {
      // 获取工作台
      const workbench = useWorkbench(designerRef)

      const currentWorkspace =
        workbench?.activeWorkspace || workbench?.currentWorkspace
      const currentWorkspaceId = currentWorkspace?.id
      //
      const operation = useOperation(
        designerRef,
        workspaceContextRef,
        currentWorkspaceId
      )
      // 获取当前节点
      const node = useSelectedNode(
        designerRef,
        workspaceContextRef,
        currentWorkspaceId
      )
      // 获取当前选择
      const selected = useSelected(
        designerRef,
        workspaceContextRef,
        currentWorkspaceId
      )

      const schema = node?.designerProps?.propsSchema

      const isEmpty = !(
        node &&
        node.designerProps?.propsSchema &&
        selected.length === 1
      )

      formRef.value.setInitialValues(
        node?.designerProps?.defaultProps,
        'overwrite'
      )
      formRef.value.setValues(node?.props, 'overwrite')
      formRef.value.setEffects((form) => {
        useLocales(node)
        useSnapshot(operation, keyupRef)
        props.effects?.(form)
      })

      // const formRef: any = { value: {} }
      // formRef.value = createForm({
      //   initialValues: node?.designerProps?.defaultProps,
      //   values: node?.props,
      //   effects(form) {
      //     useLocales(node)
      //     useSnapshot(operation, keyupRef)
      //     props.effects?.(form)
      //   },
      // })

      const render = () => {
        if (!isEmpty) {
          return (
            <div class={cls(prefix)} key={node.id}>
              <Form key={formRef.value.id} form={formRef.value}>
                <FormLayout
                  labelCol={9}
                  wrapperCol={24}
                  colon={false}
                  labelWidth="110px"
                  labelAlign="left"
                  wrapperAlign="right"
                  feedbackLayout="none"
                  tooltipLayout="text"
                >
                  <SchemaField
                    schema={schema}
                    components={props.components}
                    scope={{ $node: node, ...props.scope }}
                  />
                </FormLayout>
              </Form>
            </div>
          )
        }
        return (
          <div class={prefix + '-empty'}>
            <Empty />
          </div>
        )
      }

      return (
        <IconWidget.Provider tooltip>
          <div class={prefix + '-wrapper'}>
            {!isEmpty && <NodePathWidget workspaceId={currentWorkspaceId} />}
            <div class={prefix + '-content'}>{render()}</div>
          </div>
        </IconWidget.Provider>
      )
    }
  },
})

export const SettingsForm = observer(SettingsFormCom)
// export const SettingsForm = observer(SettingsFormCom, {
//   scheduler: (update) => {
//     cancelIdle(GlobalState.idleRequest)
//     GlobalState.idleRequest = requestIdle(update, {
//       timeout: 2000,
//     })
//   },
// })
