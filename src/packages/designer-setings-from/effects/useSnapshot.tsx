import { Operation } from '@designable/core'
import { onFieldInputValueChange } from '@formily/core'
import { Ref } from 'vue'

let timeRequest: any = null

export const useSnapshot = (operation: Operation, keyup: Ref<boolean>) => {
  onFieldInputValueChange('*', () => {
    if (!keyup.value) return
    clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot('update:node:props')
      keyup.value = false
    }, 1000)
  })
}
