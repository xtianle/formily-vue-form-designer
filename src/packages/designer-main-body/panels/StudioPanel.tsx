import cls from 'classnames'
import { Layout } from '../containers'
import { usePosition, usePrefix } from '../hooks'

const StudioPanelInternal = (props, { slots }) => {
  const prefix = usePrefix('main-panel')
  const position = usePosition()

  const classNameBase = cls('root', position)
  if (slots.logo || slots.actions) {
    return (
      <div {...props} class={cls(`${prefix}-container`, classNameBase)}>
        <div class={prefix + '-header'}>
          <div class={prefix + '-header-logo'}>{slots.logo()}</div>
          <div class={prefix + '-header-actions'}>{slots.actions()}</div>
        </div>
        <div class={prefix}>{slots.default?.()}</div>
      </div>
    )
  }
  return (
    <div {...props} class={cls(prefix, classNameBase)}>
      {slots.default?.()}
    </div>
  )
}

export const StudioPanel = (props, { slots }) => {
  return (
    <Layout
      {...{
        theme: props.theme,
        prefixCls: props.prefixCls,
        position: props.position,
      }}
    >
      <StudioPanelInternal {...props} v-slots={slots} />
    </Layout>
  )
}
