import { PreviewText } from '@formily/element-plus/lib/preview-text'
import { connect, mapProps, mapReadPretty } from '@formily/vue'
import { toJS } from '@formily/reactive'
import { ElTreeSelect } from 'element-plus'
import { createBehavior, createResource } from '@designable/core'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

import {
  transformComponent,
  composeExport
} from '@formily/element-plus/lib/__builtins__'

export type TreeSelectProps = typeof ElTreeSelect

function tree2flat(children: any, childrenKey = 'children'): any {
  let arr: any[] = []
  for (let i = 0; i < children.length; i++) {
    arr.push(children[i])
    if (children?.[i]?.[childrenKey]) {
      arr = arr.concat(tree2flat(children[i][childrenKey], childrenKey))
    }
  }
  return arr
}

const TransformElSelect = transformComponent<TreeSelectProps>(ElTreeSelect, {
  change: 'update:modelValue'
})

const InnerSelect = connect(
  TransformElSelect,
  mapProps({ value: 'modelValue', readOnly: 'readonly' }),
  mapReadPretty(PreviewText.Select)
)

const FTreeSelect = connect(
  InnerSelect,
  mapProps({ dataSource: 'data', loading: true }, (props: any, field: any) => {
    const treeProps = {
      value: props.treeNodeValueProp || 'value',
      label: props.treeNodeLabelProp || 'label',
      children: props.treeNodeChildrenProp || 'children'
    }
    return { ...props, props: treeProps }
  }),
  mapReadPretty(
    connect(
      PreviewText.Select,
      mapProps({}, (args: any, field: any) => {
        const result = tree2flat(toJS(field.dataSource) || [])
        field.setDataSource(result)
        return args
      })
    )
  )
)

export const TreeSelect = composeExport(FTreeSelect, {
  Behavior: createBehavior({
    name: 'TreeSelect',
    extends: ['Field'],
    selector: (node) => node.props?.['x-component'] === 'TreeSelect',
    designerProps: {
      propsSchema: createFieldSchema(AllSchemas.TreeSelect)
    },
    designerLocales: AllLocales.TreeSelect
  }),
  Resource: createResource({
    icon: 'TreeSelectSource',
    elements: [
      {
        componentName: 'Field',
        props: {
          title: 'TreeSelect',
          'x-decorator': 'FormItem',
          'x-component': 'TreeSelect'
        }
      }
    ]
  })
})
