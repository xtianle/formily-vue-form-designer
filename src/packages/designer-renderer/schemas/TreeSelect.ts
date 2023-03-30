import { ISchema } from '@formily/vue'

export const TreeSelect: ISchema = {
  type: 'object',
  properties: {
    treeNodeLabelProp: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'label'
    },
    treeNodeValueProp: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'value'
    },
    treeNodeChildrenProp: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'children'
    },
    checkStrictly: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true
    },
    defaultExpandAll: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input'
    },
    multiple: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    'multiple-limit': {
      default: 0,
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      'x-component-props': {}
    },
    size: {
      type: 'string',
      enum: ['large', 'small', 'middle', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        // defaultValue: 'middle'
      }
    }
  }
}
