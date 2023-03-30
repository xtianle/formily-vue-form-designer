import { ISchema } from '@formily/vue'

export const Button: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
    type: {
      type: 'string',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      enum: ['primary', 'success', 'warning', 'danger', 'info'],
      default: 'primary',
    },
    size: {
      default: 'default',
      type: 'string',
      enum: ['large', 'default', 'small', null],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
    },
  },
}
