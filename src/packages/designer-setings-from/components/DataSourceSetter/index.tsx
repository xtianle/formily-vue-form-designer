import { CSSProperties, defineComponent, PropType, ref, watch } from 'vue'
import { ElDialog as Modal, ElButton as Button, ElSpace } from 'element-plus'
import { Form } from '@formily/core'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-vue'
import { usePrefix, useTheme, TextWidget } from '@designer-main-body'
import { DataSettingPanel } from './DataSettingPanel'
import { TreePanel } from './TreePanel'
import { IDataSourceItem, ITreeDataSource } from './types'
import { transformDataToValue, transformValueToData } from './shared'
import cls from 'classnames'

import './styles.less'

export interface IDataSourceSetterProps {
  class?: string
  style?: CSSProperties
  onChange: (dataSource: IDataSourceItem[]) => void
  value: IDataSourceItem[]
  allowTree?: boolean
  allowExtendOption?: boolean
  defaultOptionValue?: {
    label: string
    value: any
  }[]
  effects?: (form: Form<any>) => void
}

export const DataSourceSetter = observer(
  defineComponent({
    name: 'DataSourceSetter',
    inheritAttrs: false,
    props: {
      value: {
        type: Array as PropType<IDataSourceItem[]>,
        default: () => [],
      },
      allowTree: {
        type: Boolean,
        default: true,
      },
      allowExtendOption: {
        type: Boolean,
        default: true,
      },
      defaultOptionValue: {
        type: Array as PropType<
          {
            label: string
            value: any
          }[]
        >,
        default: undefined,
      },
      effects: {
        type: Function as PropType<(form: Form<any>) => void>,
        default: () => {
          return () => {}
        },
      },
    },
    emit: ['change'],
    setup(props, { emit }) {
      const theme = useTheme()
      const prefix = usePrefix('data-source-setter')
      const modalVisibleRef = ref(false)
      const treeDataSourceRef = ref<ITreeDataSource>()
      watch(
        [() => props.value, modalVisibleRef],
        () => {
          treeDataSourceRef.value = observable({
            dataSource: transformValueToData(props.value),
            selectedKey: '',
          })
        },
        { immediate: true }
      )

      const openModal = () => (modalVisibleRef.value = true)
      const closeModal = () => (modalVisibleRef.value = false)

      return () => {
        return (
          <>
            <Button onClick={openModal}>
              <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
            </Button>
            <Modal
              modelValue={modalVisibleRef.value}
              width="65%"
              destroyOnClose
              {...{ onClosed: closeModal }}
              v-slots={{
                header: () => (
                  <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
                ),
                default: () => {
                  return (
                    <div
                      class={`${cls(prefix)} ${prefix + '-' + theme} ${
                        prefix + '-layout'
                      }`}
                    >
                      <div class={`${prefix + '-layout-item left'}`}>
                        <TreePanel
                          defaultOptionValue={props.defaultOptionValue}
                          allowTree={props.allowTree}
                          treeDataSource={treeDataSourceRef.value}
                        />
                      </div>
                      <div class={`${prefix + '-layout-item right'}`}>
                        <DataSettingPanel
                          allowExtendOption={props.allowExtendOption}
                          treeDataSource={treeDataSourceRef.value}
                          effects={props.effects}
                        />
                      </div>
                    </div>
                  )
                },
                footer: () => (
                  <ElSpace>
                    <Button onClick={closeModal}>
                      <TextWidget token="SettingComponents.ModalBtn.Cancel" />
                    </Button>
                    <Button
                      onClick={() => {
                        emit(
                          'change',
                          transformDataToValue(
                            treeDataSourceRef.value.dataSource
                          )
                        )
                        closeModal()
                      }}
                      type="primary"
                    >
                      <TextWidget token="SettingComponents.ModalBtn.Confirm" />
                    </Button>
                  </ElSpace>
                ),
              }}
            />
          </>
        )
      }
    },
  })
)
