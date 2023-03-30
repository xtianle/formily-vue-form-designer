import { Cascader as FormilyCascader } from '@formily/element-plus'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { connect, mapProps } from '@formily/vue'
const FCascader = connect(
  FormilyCascader,
  mapProps((props: any, field: any) => {
    const nodeProps = {
      value: props.nodeValue || 'value',
      label: props.nodeLabel || 'label',
      children: props.nodeChildren || 'children',
      multiple: props.nodeMultiple || false,
      checkStrictly: props.nodeCheckStrictly || false,
      expandTrigger: props.nodeExpandTrigger || 'click'
    }
    return { ...props, props: nodeProps }
  })
)

const Behavior = createBehavior({
  name: 'Cascader',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'Cascader',
  designerProps: {
    propsSchema: createFieldSchema(AllSchemas.Cascader)
  },
  designerLocales: AllLocales.Cascader
})

const Resource = createResource({
  icon: 'CascaderSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Cascader',
        'x-decorator': 'FormItem',
        'x-component': 'Cascader'
      }
    }
  ]
})

export const Cascader = Object.assign(FCascader, { Behavior, Resource })
