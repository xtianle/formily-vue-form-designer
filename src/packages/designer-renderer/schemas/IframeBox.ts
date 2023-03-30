import { ISchema } from '@formily/vue'

export const IframeBox: ISchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      'x-component': 'Input',
      'x-decorator': 'FormItem',
    },
  },
}
