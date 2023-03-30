import { defineComponent, getCurrentInstance, onMounted, ref } from 'vue'
import { ElTable, ElTableColumn, ElRow } from 'element-plus'
import { TreeNode, createBehavior, createResource } from '@designable/core'
import { uid } from '@designable/shared'
import {
  useTreeNode,
  TreeNodeWidget,
  DroppableWidget,
  useNodeIdProps,
  useDesigner,
} from '@designer-main-body'

import { ArrayBase } from '@formily/element-plus/lib/array-base'
import { observer } from '@formily/reactive-vue'
import { LoadTemplate } from '../../common/LoadTemplate'
import {
  queryNodesByComponentPath,
  hasNodeByComponentPath,
  findNodeByComponentPath,
  createEnsureTypeItemsNode,
} from '../../shared'

import { useDropTemplate } from '../../hooks'
import { createArrayBehavior } from '../ArrayBase'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'

import cls from 'classnames'
import './styles.less'

const ensureObjectItemsNode = createEnsureTypeItemsNode('object')

const TableCell = defineComponent({
  name: 'TableCell',
  inheritAttrs: false,
  props: {
    className: { type: String },
    nodeId: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['change'],
  setup(props, { slots }) {
    const { proxy: vm } = getCurrentInstance()
    onMounted(() => {
      const element = vm.$el.parentNode.parentNode as HTMLElement
      const nodeId = props.nodeId
      Object.keys(nodeId).forEach((key) => {
        element.setAttribute(key, nodeId[key])
      })
    })
    return () => {
      return <div {...props.nodeId}>{slots.default?.()}</div>
    }
  },
})

const ArrayTableCom = observer(
  defineComponent({
    name: 'ArrayTableCom',
    setup(props, { attrs }) {
      const useDesignerRef = useDesigner()
      const nodeRef = useTreeNode()

      useDropTemplate('ArrayTable', (source) => {
        const sortHandleNode = new TreeNode({
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: `Title`,
            },
          },
          children: [
            {
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'ArrayTable.SortHandle',
              },
            },
          ],
        })
        const indexNode = new TreeNode({
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: `Title`,
            },
          },
          children: [
            {
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
              },
            },
          ],
        })
        const columnNode = new TreeNode({
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: `Title`,
            },
          },
          children: source.map((node) => {
            node.props.title = undefined
            return node
          }),
        })
        const operationNode = new TreeNode({
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': {
              title: `Title`,
            },
          },
          children: [
            {
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'ArrayTable.Remove',
              },
            },
            {
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'ArrayTable.MoveDown',
              },
            },
            {
              componentName: 'Field',
              props: {
                type: 'void',
                'x-component': 'ArrayTable.MoveUp',
              },
            },
          ],
        })
        const objectNode = new TreeNode({
          componentName: 'Field',
          props: {
            type: 'object',
          },
          children: [sortHandleNode, indexNode, columnNode, operationNode],
        })
        const additionNode = new TreeNode({
          componentName: 'Field',
          props: {
            type: 'void',
            title: 'Addition',
            'x-component': 'ArrayTable.Addition',
          },
        })
        return [objectNode, additionNode]
      })

      useDropTemplate('ArrayTable.Column', (source) => {
        return source.map((node: TreeNode) => {
          if (node.props) node.props.title = undefined
          return node
        })
      })
      /**
       * TODO:: workaround
       * 直接渲染table会报错
       * 先渲染其他的 其他的渲染完成后在渲染table
       */
      // const waitRef = ref(false)
      // onMounted(() => {
      //   waitRef.value = true
      // })

      return () => {
        // if (!waitRef.value) return
        const node = nodeRef.value
        const nodeId = useNodeIdProps(useDesignerRef, nodeRef)
        // if (!node) return

        const columns = queryNodesByComponentPath(node, [
          'ArrayTable',
          '*',
          'ArrayTable.Column',
        ])
        const additions = queryNodesByComponentPath(node, [
          'ArrayTable',
          'ArrayTable.Addition',
        ])

        const defaultRowKey = (row: any) => {
          return node.id + JSON.stringify(row || new Date().getTime())
        }
        // 渲染表格
        const renderTable = () => {
          if (node.children.length === 0) return <DroppableWidget />
          return (
            <ArrayBase disabled>
              <ElTable
                {...nodeId}
                size="small"
                border={true}
                {...attrs}
                rowKey={defaultRowKey}
                class={cls('element-formily-array-table')}
                style={{ marginBottom: '10px' }}
                data={[{ id: '1' }]}
                key={uid()}
              >
                {columns.map((node, index) => {
                  const children = node.children.map((child) => {
                    return <TreeNodeWidget node={child} key={child.id} />
                  })
                  const props = node.props?.['x-component-props']
                  const nodeId = {
                    [useDesignerRef.value.props.nodeIdAttrName]: node.id,
                  }
                  return (
                    <ElTableColumn
                      {...props}
                      key={node.id}
                      dataIndex={node.id}
                      class={`data-id:${node.id}`}
                      v-slots={{
                        default: ({ $index }) => {
                          return (
                            <TableCell
                              nodeId={nodeId}
                              // {...{ className: `data-id:${node.id}` }}
                            >
                              <ArrayBase.Item index={$index} record={null}>
                                {children.length > 0 ? children : 'Droppable'}
                              </ArrayBase.Item>
                            </TableCell>
                          )
                        },
                        header: ({ column, $index }) => {
                          return (
                            <TableCell
                              nodeId={nodeId}
                              // {...{ className: `data-id:${node.id}` }}
                            >
                              <span data-content-editable="x-component-props.label">
                                {props.label}
                              </span>
                            </TableCell>
                          )
                        },
                      }}
                    ></ElTableColumn>
                  )
                })}
                {columns.length === 0 && (
                  <ElTableColumn>
                    <DroppableWidget />
                  </ElTableColumn>
                )}
              </ElTable>
              <ElRow justify="center">
                {additions.map((node) => {
                  return <ArrayBase.Addition title="添加条目" />
                })}
              </ElRow>
            </ArrayBase>
          )
        }
        return (
          <div class="dn-array-table">
            {renderTable()}
            <LoadTemplate
              actions={[
                {
                  title: node.getMessage('addSortHandle'),
                  icon: 'AddSort',
                  onClick: () => {
                    if (
                      hasNodeByComponentPath(node, [
                        'ArrayTable',
                        '*',
                        'ArrayTable.Column',
                        'ArrayTable.SortHandle',
                      ])
                    )
                      return
                    const tableColumn = new TreeNode({
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          label: `排序`,
                        },
                      },
                      children: [
                        {
                          componentName: 'Field',
                          props: {
                            type: 'void',
                            'x-component': 'ArrayTable.SortHandle',
                          },
                        },
                      ],
                    })
                    ensureObjectItemsNode(node).prepend(tableColumn)
                  },
                },
                {
                  title: node.getMessage('addIndex'),
                  icon: 'AddIndex',
                  onClick: () => {
                    if (
                      hasNodeByComponentPath(node, [
                        'ArrayTable',
                        '*',
                        'ArrayTable.Column',
                        'ArrayTable.Index',
                      ])
                    )
                      return
                    const tableColumn = new TreeNode({
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          label: `序号`,
                        },
                      },
                      children: [
                        {
                          componentName: 'Field',
                          props: {
                            type: 'void',
                            'x-component': 'ArrayTable.Index',
                          },
                        },
                      ],
                    })
                    const sortNode = findNodeByComponentPath(node, [
                      'ArrayTable',
                      '*',
                      'ArrayTable.Column',
                      'ArrayTable.SortHandle',
                    ])
                    if (sortNode) {
                      sortNode.parent.insertAfter(tableColumn)
                    } else {
                      ensureObjectItemsNode(node).prepend(tableColumn)
                    }
                  },
                },
                {
                  title: node.getMessage('addColumn'),
                  icon: 'AddColumn',
                  onClick: () => {
                    const operationNode = findNodeByComponentPath(node, [
                      'ArrayTable',
                      '*',
                      'ArrayTable.Column',
                      (name) => {
                        return (
                          name === 'ArrayTable.Remove' ||
                          name === 'ArrayTable.MoveDown' ||
                          name === 'ArrayTable.MoveUp'
                        )
                      },
                    ])
                    const tableColumn = new TreeNode({
                      componentName: 'Field',
                      props: {
                        type: 'void',
                        'x-component': 'ArrayTable.Column',
                        'x-component-props': {
                          label: `Title`,
                        },
                      },
                    })
                    if (operationNode) {
                      operationNode.parent.insertBefore(tableColumn)
                    } else {
                      ensureObjectItemsNode(node).append(tableColumn)
                    }
                  },
                },
                {
                  title: node.getMessage('addOperation'),
                  icon: 'AddOperation',
                  onClick: () => {
                    const oldOperationNode = findNodeByComponentPath(node, [
                      'ArrayTable',
                      '*',
                      'ArrayTable.Column',
                      (name) => {
                        return (
                          name === 'ArrayTable.Remove' ||
                          name === 'ArrayTable.MoveDown' ||
                          name === 'ArrayTable.MoveUp'
                        )
                      },
                    ])
                    // const oldAdditionNode = findNodeByComponentPath(node, [
                    //   'ArrayTable',
                    //   'ArrayTable.Addition',
                    // ])
                    if (!oldOperationNode) {
                      const operationNode = new TreeNode({
                        componentName: 'Field',
                        props: {
                          type: 'void',
                          'x-component': 'ArrayTable.Column',
                          'x-component-props': {
                            label: `操作`,
                          },
                        },
                        children: [
                          {
                            componentName: 'Field',
                            props: {
                              type: 'void',
                              'x-component': 'ArrayTable.Remove',
                            },
                          },
                          {
                            componentName: 'Field',
                            props: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveDown',
                            },
                          },
                          {
                            componentName: 'Field',
                            props: {
                              type: 'void',
                              'x-component': 'ArrayTable.MoveUp',
                            },
                          },
                        ],
                      })
                      ensureObjectItemsNode(node).append(operationNode)
                    }
                    // if (!oldAdditionNode) {
                    //   const additionNode = new TreeNode({
                    //     componentName: 'Field',
                    //     props: {
                    //       type: 'void',
                    //       title: 'Addition',
                    //       'x-component': 'ArrayTable.Addition',
                    //     },
                    //   })
                    //   ensureObjectItemsNode(node).insertAfter(additionNode)
                    // }
                  },
                },
              ]}
            />
          </div>
        )
      }
    },
  })
)

const Behavior = createBehavior(createArrayBehavior('ArrayTable'), {
  name: 'ArrayTable.Column',
  extends: ['Field'],
  selector: (node) => node.props?.['x-component'] === 'ArrayTable.Column',
  designerProps: {
    droppable: true,
    allowDrop: (node) =>
      node.props?.['type'] === 'object' &&
      node.parent?.props?.['x-component'] === 'ArrayTable',
    propsSchema: createVoidFieldSchema(AllSchemas.ArrayTable.Column),
  },
  designerLocales: AllLocales.ArrayTableColumn,
})

const Resource = createResource({
  icon: 'ArrayTableSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'array',
        'x-decorator': 'FormItem',
        'x-component': 'ArrayTable',
      },
    },
  ],
})

export const ArrayTable = Object.assign(ArrayTableCom, {
  Behavior,
  Resource,
  Column: () => null,
  Index: ArrayBase.Index,
  SortHandle: ArrayBase.SortHandle,
  Addition: ArrayBase.Addition,
  Remove: ArrayBase.Remove,
  MoveDown: ArrayBase.MoveDown,
  MoveUp: ArrayBase.MoveUp,
  useArray: ArrayBase.useArray,
  useIndex: ArrayBase.useIndex,
  useRecord: ArrayBase.useRecord,
})
