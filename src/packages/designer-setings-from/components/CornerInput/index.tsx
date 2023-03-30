import { usePrefix } from '@designer-main-body'
import { CSSProperties, defineComponent, ref, watch } from 'vue'
import cls from 'classnames'
import './styles.less'

export interface ICornerInputProps {
  class?: string
  style?: CSSProperties
  value?: string
  onChange?: (value: string) => void
}

export const CornerInput = defineComponent({
  name: 'CornerInput',
  props: {
    value: {
      type: String,
      default: 'all',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const prefix = usePrefix('corner-input')
    const current = ref(props.value)

    watch(
      () => props.value,
      () => {
        if (!props.value) {
          current.value = 'all'
          emit('change', 'all')
        }
      },
      {
        immediate: true,
      }
    )

    const createCellProps = (type: string) => ({
      class: cls(prefix + '-cell', { active: current.value === type }),
      onClick() {
        current.value = type
        emit('change', type)
      },
    })

    return () => {
      return (
        <div class={cls(prefix)}>
          <div class={prefix + '-column'}>
            <div {...createCellProps('topLeft')}>┏</div>
            <div {...createCellProps('bottomLeft')}>┗</div>
          </div>
          <div class={prefix + '-column'}>
            <div {...createCellProps('all')}>╋</div>
          </div>
          <div class={prefix + '-column'}>
            <div {...createCellProps('topRight')}>┓</div>
            <div {...createCellProps('bottomRight')}>┛</div>
          </div>
        </div>
      )
    }
  },
})
