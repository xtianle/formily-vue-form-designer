import { createLocales } from '@designable/core'

export const TimePicker = createLocales({
  'zh-CN': {
    title: '时间选择',
    settings: {
      'x-component-props': {
        editable: { title: '文本框可输入' },
        clearable: { title: '显示清除按钮' },
        size: { title: '尺寸' },
        placeholder: '占位提示',
        timePickerFormat: { title: '时间格式' },
        'arrow-control': { title: '使用箭头' },
        'is-range': { title: '时间范围选择' },
        'range-separator': { title: '分隔符' }
      }
    }
  },
  'en-US': {
    title: 'Time Picker',
    settings: {
      'x-component-props': {
        'is-range': { title: '时间范围选择' },
        'arrow-control': { title: '使用箭头' }
      }
    }
  }
})
