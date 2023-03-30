import { ISchema } from '@formily/vue'

export const TimePicker: ISchema & { RangePicker?: ISchema } = {
  type: 'object',
  properties: {
    editable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true
    },
    clearable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true
    },
    size: {
      default: 'default',
      type: 'string',
      enum: ['large', 'default', 'small', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true
      }
    },
    placeholder: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      }
    },
    timePickerFormat: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      },
      default: 'HH:mm:ss'
    },
    'is-range': {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    'arrow-control': {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    'range-separator': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      },
      default: '-'
    }
  }
}
