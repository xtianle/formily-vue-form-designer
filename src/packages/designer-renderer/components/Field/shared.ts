import { ISchema } from '@formily/json-schema'
import { AllSchemas } from '../../schemas'

export const createComponentSchema = (
  component: ISchema | undefined,
  decorator: ISchema
) => {
  return {
    // 组件属性
    'component-group':
      (component && {
        type: 'void',
        'x-component': 'CollapseItem',
        'x-reactions': {
          fulfill: {
            state: {
              visible: '{{!!$form.values["x-component"]}}'
            }
          }
        },
        properties: {
          'x-component-props': component
        }
      }) ||
      undefined,
    // 容器属性组
    'decorator-group':
      (decorator && {
        type: 'void',
        'x-component': 'CollapseItem',
        'x-component-props': { defaultExpand: false },
        'x-reactions': {
          fulfill: {
            state: {
              visible: '{{!!$form.values["x-decorator"]}}'
            }
          }
        },
        properties: {
          'x-decorator-props': decorator
        }
      }) ||
      undefined,
    // 组件样式组
    'component-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-component"]}}'
          }
        }
      },
      properties: {
        'x-component-props.style': AllSchemas.CSSStyle
      }
    },
    // 容器样式组
    'decorator-style-group': {
      type: 'void',
      'x-component': 'CollapseItem',
      'x-component-props': { defaultExpand: false },
      'x-reactions': {
        fulfill: {
          state: {
            visible: '{{!!$form.values["x-decorator"]}}'
          }
        }
      },
      properties: {
        'x-decorator-props.style': AllSchemas.CSSStyle
      }
    }
  }
}

export const createFieldSchema = (
  component: ISchema | undefined = undefined,
  decorator: ISchema = AllSchemas.FormItem
): ISchema => {
  const data = createComponentSchema(component, decorator) || {}
  return {
    type: 'object',
    properties: {
      'field-group': {
        type: 'void',
        'x-component': 'CollapseItem',
        properties: {
          name: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              clearable: true
            }
          },
          title: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              clearable: true
            }
          },
          description: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-component-props': {
              rows: 1
            }
          },
          'x-display': {
            default: 'visible',
            type: 'string',
            enum: ['visible', 'hidden', 'none', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {}
          },
          'x-pattern': {
            default: 'editable',
            type: 'string',
            enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {}
          },
          default: {
            'x-decorator': 'FormItem',
            'x-component': 'ValueInput'
          },
          // enum: {
          //   'x-decorator': 'FormItem',
          //   'x-component': 'DataSourceSetter',
          // },
          'x-reactions': {
            'x-decorator': 'FormItem',
            'x-component': 'ReactionsSetter'
          },
          'x-validator': {
            type: 'array',
            'x-component': 'ValidatorSetter'
          },

          required: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch'
          }
        }
      },
      ...data
    } as any
  }
}

export const createVoidFieldSchema = (
  component?: ISchema,
  decorator: ISchema = AllSchemas.FormItem
) => {
  const data = createComponentSchema(component, decorator) || {}
  return {
    type: 'object',
    properties: {
      'field-group': {
        type: 'void',
        'x-component': 'CollapseItem',
        properties: {
          name: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              clearable: true
            }
          },
          title: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              clearable: true
            },
            'x-reactions': {
              fulfill: {
                state: {
                  hidden: '{{$form.values["x-decorator"] !== "FormItem"}}'
                }
              }
            }
          },
          description: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input.TextArea',
            'x-reactions': {
              fulfill: {
                state: {
                  hidden: '{{$form.values["x-decorator"] !== "FormItem"}}'
                }
              }
            }
          },
          'x-display': {
            default: 'visible',
            type: 'string',
            enum: ['visible', 'hidden', 'none', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              clearable: true
            }
          },
          'x-pattern': {
            default: 'editable',
            type: 'string',
            enum: ['editable', 'disabled', 'readOnly', 'readPretty', ''],
            'x-decorator': 'FormItem',
            'x-component': 'Select',
            'x-component-props': {
              clearable: true
            }
          },
          'x-reactions': {
            // 'x-display': 'hidden',
            'x-decorator': 'FormItem',
            'x-component': 'ReactionsSetter'
          },
          'x-decorator': {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Switch'
          }
        }
      },
      ...data
    } as any
  }
}
