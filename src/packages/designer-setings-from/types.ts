import { Form } from '@formily/core'
import { Component, CSSProperties } from 'vue'

export interface ISettingFormProps {
  class?: string
  style?: CSSProperties
  uploadAction?: string
  components?: Record<string, Component<any>>
  effects?: (form: Form) => void
  scope?: any
}
