import { ISchema } from '@formily/vue'

export const DatePicker: ISchema & { RangePicker?: ISchema } = {
  type: 'object',
  properties: {
    editable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    },
    clearable: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
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
    type: {
      default: 'date',
      type: 'string',
      enum: [
        'year',
        'month',
        'date',
        'dates',
        'week',
        'datetime',
        'datetimerange',
        'daterange',
        'monthrange'
      ],
      'x-index': 0,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        clearable: true
      }
    },
    datePickerFormat: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      },
      default: 'YYYY-MM-DD'
    },
    'value-format': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      },
      default: 'YYYY-MM-DD'
    },
    'range-separator': {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        clearable: true
      },
      default: '-'
    },
    'unlink-panels': {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch'
    }
  }
}
