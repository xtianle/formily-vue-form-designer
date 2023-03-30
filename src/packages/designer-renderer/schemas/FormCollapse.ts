import { ISchema } from '@formily/vue'

export const FormCollapse: ISchema & { Item?: ISchema } = {
  type: 'object',
  properties: {
    accordion: {
      default: true,
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
}

FormCollapse.Item = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { clearable: true },
    },
    disabled: {
      default: false,
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
    },
  },
}
