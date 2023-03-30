import { defineComponent, PropType, ref } from 'vue'
import { TextWidget, usePrefix } from '@designer-main-body'
import { ElMenu as Menu, ElMenuItem as MenuItem } from 'element-plus'
import { MonacoInput } from '../MonacoInput'
import { isPlainObj, reduce } from '@formily/shared'
import { FieldProperties } from './properties'

export interface IFieldProperty {
  [key: string]: string
}

export interface IFieldPropertySetterProps {
  extraLib?: string
  value?: IFieldProperty
  // onChange?: (value: IFieldProperty) => void
}

const template = (code: string) => {
  if (!code) return
  return code.trim()
}

export const FieldPropertySetter = defineComponent({
  name: 'FieldPropertySetter',
  props: {
    value: {
      type: Object as PropType<IFieldProperty>,
      default: () => ({}),
    },
    extraLib: {
      type: String,
      default: undefined,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const selectKeyRef = ref('visible')
    const setSelectKey = (value: string) => (selectKeyRef.value = value)
    const prefix = usePrefix('field-property-setter')

    const parseExpression = (expression: string) => {
      if (!expression) return ''
      return String(expression).match(/^\{\{([\s\S]*)\}\}$/)?.[1] || ''
    }

    const filterEmpty = (value: object) => {
      return reduce(
        value,
        (buf, value, key) => {
          if (!value || value === '{{}}') return buf
          buf[key] = value
          return buf
        },
        {}
      )
    }
    return () => {
      const value = { ...props.value }
      const selectKey = selectKeyRef.value
      const currentProperty = FieldProperties.find(
        (item) => item.key === selectKey
      )

      return (
        <div class={prefix}>
          <Menu
            mode="vertical"
            style={{
              width: '200px',
              height: '300px',
              paddingRight: '4px',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
            defaultActive={selectKey}
            onSelect={(selectedKey) => {
              setSelectKey(selectedKey)
            }}
          >
            {FieldProperties.map((key) => {
              if (isPlainObj(key)) {
                return (
                  <MenuItem key={key.key} index={key.key}>
                    <TextWidget
                      token={`SettingComponents.ReactionsSetter.${
                        key.token || key.key
                      }`}
                    />
                  </MenuItem>
                )
              }
              return (
                <MenuItem key={key} index={key}>
                  <TextWidget
                    token={`SettingComponents.ReactionsSetter.${key}`}
                  />
                </MenuItem>
              )
            })}
          </Menu>
          <div class={prefix + '-coder-wrapper'}>
            <div class={prefix + '-coder-start'}>
              {`$self.${selectKey} = (`}
              <span
                style={{
                  fontSize: 14,
                  marginLeft: 10,
                  color: '#888',
                  fontWeight: 'normal',
                }}
              >
                {'//'}{' '}
                <TextWidget token="SettingComponents.ReactionsSetter.expressionValueTypeIs" />{' '}
                {'`'}
                {currentProperty?.type}
                {'`'}
              </span>
            </div>
            <div class={prefix + '-coder'}>
              <MonacoInput
                key={selectKey}
                language="javascript.expression"
                extraLib={props.extraLib}
                helpCode={template(currentProperty?.helpCode)}
                value={parseExpression(value[selectKey])}
                options={{
                  lineNumbers: 'off',
                  wordWrap: 'on',
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 0,
                  minimap: {
                    enabled: false,
                  },
                }}
                onChange={(expression) => {
                  emit(
                    'change',
                    filterEmpty({
                      ...value,
                      [selectKey]: `{{${expression}}}`,
                    })
                  )
                }}
              />
            </div>
            <div class={prefix + '-coder-end'}>{`)`}</div>
          </div>
        </div>
      )
    }
  },
})
