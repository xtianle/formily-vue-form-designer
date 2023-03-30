import { defineComponent, ref, shallowRef, watch } from 'vue'
import { clone, uid } from '@formily/shared'
import { createForm, isVoidField, Form as IForm } from '@formily/core'
import { createSchemaField, ISchema } from '@formily/vue'
import { GlobalRegistry } from '@designable/core'
import { requestIdle } from '@designable/shared'
import { usePrefix, TextWidget } from '@designer-main-body'
import { MonacoInput } from '../MonacoInput'
import {
  Form,
  ArrayTable,
  Input,
  Select,
  FormItem,
  FormCollapse,
} from '@formily/element-plus'
import {
  ElDialog as Modal,
  ElCard as Card,
  ElButton as Button,
  ElTag as Tag,
  ElTooltip as Tooltip,
  ElSpace,
} from 'element-plus'
import { PathSelector } from './PathSelector'
import { FieldPropertySetter } from './FieldPropertySetter'
import { FulfillRunHelper } from './helpers'
import { IReaction } from './types'
import { initDeclaration } from './declarations'
import './styles.less'

export interface IReactionsSetterProps {
  value?: IReaction
  onChange?: (value: IReaction) => void
}

const TypeView = defineComponent({
  name: 'TypeView',
  props: {
    value: {
      type: String,
      defalut: undefined,
    },
  },
  setup(props) {
    return () => {
      const text = String(props.value)
      if (text.length <= 26) return <Tag>{text}</Tag>
      return (
        <Tag>
          <Tooltip
            v-slots={{
              content: () => (
                <div style={{ fontSize: '12px' }}>
                  <code>
                    <pre
                      style={{ whiteSpace: 'pre-wrap', padding: 0, margin: 0 }}
                    >
                      {text}
                    </pre>
                  </code>
                </div>
              ),
            }}
          >
            {text.substring(0, 24)}...
          </Tooltip>
        </Tag>
      )
    }
  },
})

const {
  SchemaField,
  SchemaMarkupField,
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
    Card,
    FormCollapse,
    Input,
    TypeView,
    Select,
    FormItem,
    PathSelector,
    FieldPropertySetter,
    ArrayTable,
    MonacoInput,
  },
})

const FieldStateProperties = [
  'value',
  'initialValue',
  'inputValue',
  'inputValues',
  'modified',
  'initialized',
  'title',
  'description',
  'mounted',
  'unmounted',
  'active',
  'visited',
  'loading',
  'errors',
  'warnings',
  'successes',
  'feedbacks',
  'valid',
  'invalid',
  'pattern',
  'display',
  'disabled',
  'readOnly',
  'readPretty',
  'visible',
  'hidden',
  'editable',
  'validateStatus',
  'validating',
]

const FieldStateValueTypes = {
  modified: 'boolean',
  initialized: 'boolean',
  title: 'string',
  description: 'string',
  mounted: 'boolean',
  unmounted: 'boolean',
  active: 'boolean',
  visited: 'boolean',
  loading: 'boolean',
  errors: 'string[]',
  warnings: 'string[]',
  successes: 'string[]',
  feedbacks: `Array<
  triggerType?: 'onInput' | 'onFocus' | 'onBlur'
  type?: 'error' | 'success' | 'warning'
  code?:
    | 'ValidateError'
    | 'ValidateSuccess'
    | 'ValidateWarning'
    | 'EffectError'
    | 'EffectSuccess'
    | 'EffectWarning'
  messages?: string[]
>
`,
  valid: 'boolean',
  invalid: 'boolean',
  pattern: "'editable' | 'disabled' | 'readOnly' | 'readPretty'",
  display: "'visible' | 'hidden' | 'none'",
  disabled: 'boolean',
  readOnly: 'boolean',
  readPretty: 'boolean',
  visible: 'boolean',
  hidden: 'boolean',
  editable: 'boolean',
  validateStatus: "'error' | 'warning' | 'success' | 'validating'",
  validating: 'boolean',
}

export const ReactionsSetter = defineComponent({
  name: 'ReactionsSetter',
  inheritAttrs: false,
  // eslint-disable-next-line vue/require-default-prop
  props: { value: { type: [Array, Object] } },
  emits: ['change'],

  setup(props, { emit }) {
    const modalVisibleRef = ref(false)
    const innerVisibleRef = ref(false)
    const formRef = shallowRef<IForm>(createForm())
    const formCollapseRef = shallowRef(FormCollapse.createFormCollapse())
    const prefix = usePrefix('reactions-setter')
    watch(
      [() => props.value, modalVisibleRef],
      () => {
        if (props.value) {
          formRef.value = createForm({
            values: clone(props.value),
          })
        }
      },
      { immediate: true }
    )

    watch(
      modalVisibleRef,
      (value) => {
        if (value) {
          requestIdle(
            () => {
              initDeclaration().then(() => {
                innerVisibleRef.value = true
              })
            },
            {
              timeout: 400,
            }
          )
        } else {
          innerVisibleRef.value = false
        }
      },
      { immediate: true }
    )

    const openModal = () => (modalVisibleRef.value = true)
    const closeModal = () => (modalVisibleRef.value = false)

    return () => {
      const innerVisible = innerVisibleRef.value
      const modalVisible = modalVisibleRef.value
      const form = formRef.value
      const formCollapse = formCollapseRef.value

      return (
        <>
          <Button onClick={openModal}>
            <TextWidget token="SettingComponents.ReactionsSetter.configureReactions" />
          </Button>
          <Modal
            key={modalVisible + ''}
            {...{ onClosed: closeModal }}
            modelValue={modalVisible}
            width="70%"
            destroyOnClose
            top="100px"
            v-slots={{
              header: () => (
                <TextWidget token="SettingComponents.ReactionsSetter.configureReactions" />
              ),
              default: () => {
                return (
                  <div class={prefix}>
                    {innerVisible && (
                      <Form form={form}>
                        <SchemaField>
                          <SchemaVoidField
                            x-component="FormCollapse"
                            x-component-props={{
                              formCollapse,
                              style: { marginBottom: '10px' },
                            }}
                          >
                            <SchemaVoidField
                              x-component="FormCollapse.Item"
                              x-component-props={{
                                key: 'deps',
                                title: GlobalRegistry.getDesignerMessage(
                                  'SettingComponents.ReactionsSetter.relationsFields'
                                ),
                              }}
                            >
                              <SchemaArrayField
                                name="dependencies"
                                default={[{}]}
                                x-component="ArrayTable"
                                x-component-props={{
                                  border: true,
                                  fit: true,
                                }}
                              >
                                <SchemaObjectField>
                                  <SchemaVoidField
                                    x-component="ArrayTable.Column"
                                    x-component-props={{
                                      title: GlobalRegistry.getDesignerMessage(
                                        'SettingComponents.ReactionsSetter.sourceField'
                                      ),
                                      minWidth: 240,
                                    }}
                                  >
                                    <SchemaStringField
                                      name="source"
                                      x-decorator="FormItem"
                                      x-component="PathSelector"
                                      x-component-props={{
                                        placeholder:
                                          GlobalRegistry.getDesignerMessage(
                                            'SettingComponents.ReactionsSetter.pleaseSelect'
                                          ),
                                      }}
                                    />
                                  </SchemaVoidField>
                                  <SchemaVoidField
                                    x-component="ArrayTable.Column"
                                    x-component-props={{
                                      title: GlobalRegistry.getDesignerMessage(
                                        'SettingComponents.ReactionsSetter.sourceProperty'
                                      ),
                                      width: 200,
                                    }}
                                  >
                                    <SchemaStringField
                                      name="property"
                                      default="value"
                                      x-decorator="FormItem"
                                      x-component="Select"
                                      x-component-props={{ showSearch: true }}
                                      enum={FieldStateProperties}
                                    />
                                  </SchemaVoidField>
                                  <SchemaVoidField
                                    x-component="ArrayTable.Column"
                                    x-component-props={{
                                      title: GlobalRegistry.getDesignerMessage(
                                        'SettingComponents.ReactionsSetter.variableName'
                                      ),
                                      width: 200,
                                    }}
                                  >
                                    <SchemaStringField
                                      name="name"
                                      x-decorator="FormItem"
                                      x-validator={{
                                        pattern: /^[$_a-zA-Z]+[$_a-zA-Z0-9]*$/,
                                        message:
                                          GlobalRegistry.getDesignerMessage(
                                            'SettingComponents.ReactionsSetter.variableNameValidateMessage'
                                          ),
                                      }}
                                      x-component="Input"
                                      x-component-props={{
                                        addonBefore: '$deps.',
                                        placeholder:
                                          GlobalRegistry.getDesignerMessage(
                                            'SettingComponents.ReactionsSetter.pleaseInput'
                                          ),
                                      }}
                                      x-reactions={(field) => {
                                        if (isVoidField(field)) return
                                        field
                                          .query('.source')
                                          .take((source) => {
                                            if (isVoidField(source)) return
                                            if (
                                              source.value &&
                                              !field.value &&
                                              !field.modified
                                            ) {
                                              field.value =
                                                source.inputValues[1]?.props
                                                  ?.name || `v_${uid()}`
                                            }
                                          })
                                      }}
                                    />
                                  </SchemaVoidField>

                                  <SchemaVoidField
                                    x-component="ArrayTable.Column"
                                    x-component-props={{
                                      title: GlobalRegistry.getDesignerMessage(
                                        'SettingComponents.ReactionsSetter.variableType'
                                      ),
                                      ellipsis: {
                                        showTitle: false,
                                      },
                                      width: 200,
                                      align: 'center',
                                    }}
                                  >
                                    <SchemaStringField
                                      name="type"
                                      default="any"
                                      x-decorator="FormItem"
                                      x-component="TypeView"
                                      x-reactions={(field) => {
                                        if (isVoidField(field)) return
                                        const property = field
                                          .query('.property')
                                          .get('inputValues')
                                        if (!property) return
                                        property[0] = property[0] || 'value'
                                        field
                                          .query('.source')
                                          .take((source) => {
                                            if (isVoidField(source)) return
                                            if (source.value) {
                                              if (
                                                property[0] === 'value' ||
                                                property[0] ===
                                                  'initialValue' ||
                                                property[0] === 'inputValue'
                                              ) {
                                                field.value =
                                                  source.inputValues[1]?.props
                                                    ?.type || 'any'
                                              } else if (
                                                property[0] === 'inputValues'
                                              ) {
                                                field.value = `any[]`
                                              } else if (property[0]) {
                                                field.value =
                                                  FieldStateValueTypes[
                                                    property[0]
                                                  ]
                                              } else {
                                                field.value = 'any'
                                              }
                                            }
                                          })
                                      }}
                                    />
                                  </SchemaVoidField>
                                  <SchemaVoidField
                                    x-component="ArrayTable.Column"
                                    x-component-props={{
                                      title: GlobalRegistry.getDesignerMessage(
                                        'SettingComponents.ReactionsSetter.operations'
                                      ),
                                      align: 'center',
                                      width: 80,
                                    }}
                                  >
                                    <SchemaMarkupField
                                      type="void"
                                      x-component="ArrayTable.Remove"
                                    />
                                  </SchemaVoidField>
                                </SchemaObjectField>
                                <SchemaVoidField
                                  title={GlobalRegistry.getDesignerMessage(
                                    'SettingComponents.ReactionsSetter.addRelationField'
                                  )}
                                  x-component="ArrayTable.Addition"
                                  x-component-props={{
                                    style: { marginTop: 8 },
                                  }}
                                />
                              </SchemaArrayField>
                            </SchemaVoidField>

                            <SchemaVoidField
                              x-component="FormCollapse.Item"
                              x-component-props={{
                                title: GlobalRegistry.getDesignerMessage(
                                  'SettingComponents.ReactionsSetter.propertyReactions'
                                ),
                                key: 'state',
                                class: 'reaction-state',
                              }}
                            >
                              <SchemaMarkupField
                                name="fulfill.state"
                                x-component="FieldPropertySetter"
                              />
                            </SchemaVoidField>

                            <SchemaVoidField
                              x-component="FormCollapse.Item"
                              x-component-props={{
                                key: 'run',
                                title: GlobalRegistry.getDesignerMessage(
                                  'SettingComponents.ReactionsSetter.actionReactions'
                                ),
                                class: 'reaction-runner',
                              }}
                            >
                              <SchemaStringField
                                name="fulfill.run"
                                x-component="MonacoInput"
                                x-component-props={{
                                  width: '100%',
                                  height: 400,
                                  language: 'typescript',
                                  helpCode: FulfillRunHelper,
                                  options: {
                                    minimap: {
                                      enabled: false,
                                    },
                                  },
                                }}
                                x-reactions={(field) => {
                                  const deps = field
                                    .query('dependencies')
                                    .value()
                                  if (Array.isArray(deps)) {
                                    field.componentProps.extraLib = `
                                declare var $deps : {
                                  ${deps.map(({ name, type }) => {
                                    if (!name) return ''
                                    return `${name}?:${type || 'any'},`
                                  })}
                                }
                                `
                                  }
                                }}
                              />
                            </SchemaVoidField>
                          </SchemaVoidField>
                        </SchemaField>
                      </Form>
                    )}
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
                      form.submit((values: ISchema['x-reactions']) => {
                        emit('change', values)
                      })
                      closeModal()
                    }}
                    type="primary"
                  >
                    <TextWidget token="SettingComponents.ModalBtn.Confirm" />
                  </Button>
                </ElSpace>
              ),
            }}
          ></Modal>
        </>
      )
    }
  },
})
