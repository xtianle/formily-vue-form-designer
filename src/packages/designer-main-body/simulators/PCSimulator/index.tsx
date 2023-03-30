import cls from 'classnames'
import { defineComponent } from 'vue-demi'
import { usePrefix } from '../../hooks'
import './styles.less'

export const PCSimulator = defineComponent({
  name: 'DnPCSimulator',
  props: {
    className: {
      type: String,
      default: '',
    },
  },
  setup(props, { attrs, slots }) {
    const prefix = usePrefix('pc-simulator')

    return () => {
      return (
        <div {...attrs} class={cls(prefix, props.className)}>
          {slots.default?.()}
        </div>
      )
    }
  },
})
