import { computed, defineComponent } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import { connect, mapProps } from '@formily/vue'

type OptionsData = (string | { value: any; label: string; oldValue: any })[]

const findOptionsValue = (
  value: any,
  options: OptionsData,
  isOld: boolean = false
) => {
  for (let i = 0; i < options.length; i++) {
    const option = options[i]
    if (typeof option === 'string') {
      if (option == value) {
        return value
      }
    } else {
      if (isOld) {
        if (option.value == value) {
          return option.oldValue
        }
      } else {
        if (option.oldValue == value) {
          return option.value
        }
      }
    }
  }
}

const computedSelectOptions = (options: any) => {
  if (options) {
    return (options || [])
      .filter((item) => !!item)
      .map((option, index: number) => {
        if (typeof option === 'string') {
          return option
        } else {
          const oldValue = option.value
          const value = oldValue || `${index}`
          return {
            ...option,
            value,
            oldValue,
          }
        }
      })
  } else {
    return []
  }
}
const SelectOption = defineComponent({
  name: 'FSelect',
  props: ['options', 'value'],
  emits: ['change'],
  setup(props, { emit }) {
    const selectValue = computed<string>(() => {
      return findOptionsValue(props.value, selectOptions.value)
    })
    const selectOptions = computed<OptionsData>(() => {
      return computedSelectOptions(props.options)
    })
    return () => {
      const options = selectOptions.value
      return (
        <ElSelect
          {...{
            modelValue: selectValue.value,
            'onUpdate:modelValue': (value: string) => {
              emit('change', findOptionsValue(value, options, true))
            },
          }}
        >
          {options.map((option: any, index: number) => {
            if (typeof option === 'string') {
              return (
                <ElOption {...{ key: option, value: option, label: option }} />
              )
            } else {
              return (
                <ElOption
                  {...{
                    key: option.value || `${index}`,
                    ...option,
                  }}
                />
              )
            }
          })}
        </ElSelect>
      )
    }
  },
})

export const Select = connect(
  SelectOption,
  mapProps({ dataSource: 'options', loading: true })
)
