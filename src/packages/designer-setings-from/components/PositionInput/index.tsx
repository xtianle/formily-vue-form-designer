import { defineComponent, ref, unref, watch } from 'vue'
import { usePrefix } from '@designer-main-body'
import cls from 'classnames'
import './styles.less'

export interface IPositionInputProps {
  value?: string
  onChange?: (value: string) => void
}

export const PositionInput = defineComponent({
  name: 'DnPositionInput',
  props: {
    value: {
      type: String,
      default: 'center',
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const prefix = usePrefix('position-input')
    const currentRef = ref(props.value)

    watch(
      () => props.value,
      () => {
        if (!props.value) {
          currentRef.value = 'center'
        }
      }
    )

    return () => {
      const current = unref(currentRef)
      const createCellProps = (type: string) => ({
        class: cls(prefix + '-cell', { active: current === type }),
        onClick() {
          currentRef.value = type
          emit('change', type)
        },
      })

      return (
        <div class={cls(prefix)}>
          <div class={prefix + '-row'}>
            <div {...createCellProps('top')}>┳</div>
          </div>
          <div class={prefix + '-row'}>
            <div {...createCellProps('left')}>┣</div>
            <div {...createCellProps('center')}>╋</div>
            <div {...createCellProps('right')}>┫</div>
          </div>
          <div class={prefix + '-row'}>
            <div {...createCellProps('bottom')}>┻</div>
          </div>
        </div>
      )
    }
  },
})
