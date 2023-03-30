import { ISchema } from '@formily/vue'

export const Cascader: ISchema = {
  type: 'object',
  properties: {
    nodeLabel: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'label'
    },
    nodeValue: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'value'
    },
    nodeChildren: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'children'
    },
    nodeMultiple: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    collapseTags: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    nodeCheckStrictly: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    nodeExpandTrigger: {
      default: 'click',
      type: 'string',
      enum: ['click', 'hover'],
      'x-decorator': 'FormItem',
      'x-component': 'Select'
    },
    size: {
      default: 'default',
      type: 'string',
      enum: ['large', 'default', 'small', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select'
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      }
    },
    clearable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    showAllLevels: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true
    },
    separator: {
      default: '/',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      }
    }

    // filterable: {
    //   type: 'boolean',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Switch'
    // },
    // 'filter-method': {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'PreviewText.Input'
    // },
    // debounce: {
    //   default: 300,
    //   type: 'number',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'InputNumber',
    //   'x-component-props': {}
    // },
    // 'before-filter': {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'PreviewText.Input'
    // },
    // 'popper-class': {
    //   type: 'string',
    //   'x-decorator': 'FormItem',
    //   'x-component': 'Input',
    //   'x-component-props': {}
    // }
  }
}
