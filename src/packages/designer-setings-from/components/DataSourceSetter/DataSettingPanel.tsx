import { defineComponent, nextTick, PropType, shallowRef, watch } from 'vue'
import { ElButton as Button } from 'element-plus'
import { GlobalRegistry } from '@designable/core'
import { createForm, Form as IForm } from '@formily/core'
import { ArrayItems, Form, Input, FormItem, Space } from '@formily/element-plus'
import { observer } from '@formily/reactive-vue'
import { createSchemaField } from '@formily/vue'
import { ValueInput } from '../ValueInput'
import { usePrefix, TextWidget, IconWidget } from '@designer-main-body'
import { HeaderCom } from './Header'
import { traverseTree } from './shared'
import { ITreeDataSource } from './types'
import './styles.less'

const {
  SchemaField,
  // SchemaMarkupField,
  SchemaStringField,
  SchemaObjectField,
  SchemaArrayField,
  // SchemaBooleanField,
  // SchemaDateField,
  // SchemaDateTimeField,
  SchemaVoidField,
  // SchemaNumberField,
} = createSchemaField({
  components: {
    FormItem,
    Input,
    ArrayItems,
    ValueInput,
    Space,
  },
})

export interface IDataSettingPanelProps {
  treeDataSource: ITreeDataSource
  allowExtendOption?: boolean
  effects?: (form: IForm<any>) => void
}

export const DataSettingPanel = observer(
  defineComponent({
    name: 'DataSettingPanel',
    props: {
      treeDataSource: {
        type: Object as PropType<ITreeDataSource>,
        default: undefined,
      },
      allowExtendOption: {
        type: Boolean,
        default: false,
      },
      effects: {
        type: Function as PropType<(form: IForm<any>) => void>,
        default: undefined,
      },
    },
    setup(props) {
      const prefix = usePrefix('data-source-setter')
      const formRef = shallowRef<IForm>(createForm())

      watch(
        () => props.treeDataSource.selectedKey,
        () => {
          if (props.treeDataSource.selectedKey) {
            let values: any
            traverseTree(props.treeDataSource.dataSource, (dataItem) => {
              if (dataItem.key === props.treeDataSource.selectedKey) {
                values = dataItem
              }
            })
            nextTick(() => {
              formRef.value.setValues(values, 'overwrite')
              formRef.value.setEffects(props.effects)
              // formRef.value = createForm({
              //   values,
              //   effects: props.effects,
              // })
            })
          } else {
            nextTick(() => {
              formRef.value.setValues({}, 'overwrite')
              // formRef.value = createForm({
              //   values: {},
              // })
            })
          }
        },
        {
          immediate: true,
        }
      )

      return () => {
        const allowExtendOption = props.allowExtendOption
        if (!props.treeDataSource.selectedKey) {
          return (
            <>
              <HeaderCom
                v-slots={{
                  title() {
                    return (
                      <TextWidget token="SettingComponents.DataSourceSetter.nodeProperty" />
                    )
                  },
                  extra() {
                    return null
                  },
                }}
              />
              <div class={`${prefix + '-layout-item-content'}`}>
                <TextWidget token="SettingComponents.DataSourceSetter.pleaseSelectNode" />
              </div>
            </>
          )
        }

        return (
          <>
            <HeaderCom
              v-slots={{
                title: () => {
                  return (
                    <TextWidget token="SettingComponents.DataSourceSetter.nodeProperty" />
                  )
                },
                extra: () => {
                  return allowExtendOption ? (
                    <Button
                      link
                      onClick={() => {
                        formRef.value?.setFieldState('map', (state) => {
                          state.value.push({})
                        })
                      }}
                      icon={<IconWidget infer="Add" />}
                    >
                      <TextWidget token="SettingComponents.DataSourceSetter.addKeyValuePair" />
                    </Button>
                  ) : null
                },
              }}
            />
            <div class={`${prefix + '-layout-item-content'}`}>
              {/* labelWidth={60}  wrapperWidth={160} */}
              <Form form={formRef.value} key={formRef.value.id}>
                <SchemaField>
                  <SchemaArrayField name="map" x-component="ArrayItems">
                    <SchemaObjectField
                      x-decorator="ArrayItems.Item"
                      x-decorator-props={{
                        type: 'divide',
                      }}
                    >
                      <SchemaVoidField x-component="Space">
                        <SchemaStringField
                          title={GlobalRegistry.getDesignerMessage(
                            'SettingComponents.DataSourceSetter.label'
                          )}
                          x-decorator="FormItem"
                          x-disabled={!allowExtendOption}
                          name="label"
                          x-component="Input"
                        />
                        <SchemaStringField
                          title={GlobalRegistry.getDesignerMessage(
                            'SettingComponents.DataSourceSetter.value'
                          )}
                          x-decorator="FormItem"
                          name="value"
                          x-component="Input"
                          // x-component="ValueInput"
                        />
                        <SchemaVoidField
                          x-component="ArrayItems.Remove"
                          x-visible={allowExtendOption}
                          x-component-props={{
                            style: {
                              margin: 5,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            },
                          }}
                        />
                      </SchemaVoidField>
                    </SchemaObjectField>
                  </SchemaArrayField>
                </SchemaField>
              </Form>
            </div>
          </>
        )
      }
    },
  })
)
