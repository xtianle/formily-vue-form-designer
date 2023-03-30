import { defineComponent, reactive } from 'vue'
import {
  Designer,
  Workbench,
  StudioPanel,
  CompositePanel,
  ResourceWidget,
  ViewPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  OutlineTreeWidget,
  HistoryWidget,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from '@designer-main-body'

import { createDesigner, GlobalRegistry } from '@designable/core'
import { SettingsForm } from '@designer-setings-from'
import PreviewWidget from './components/PreviewFormWidget'
import SchemaEditorWidget from './components/FormSchemaEditorWidget'
import { transformToSchema, transformToTreeNode } from '@designable/transformer'

import { designerFormSources, designerFormComponents } from './shared'

import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ElButton } from 'element-plus'
import './DesignerForm.less'
export default defineComponent({
  name: 'DesignerForm',
  setup() {
    const route = useRoute()
    const router = useRouter()
    GlobalRegistry.registerDesignerLocales({
      'zh-CN': {
        sources: {
          Inputs: '输入控件',
          Layouts: '布局组件',
          Arrays: '自增组件',
          Displays: '展示组件',
        },
      },
      'en-US': {
        sources: {
          Inputs: 'Inputs',
          Layouts: 'Layouts',
          Arrays: 'Arrays',
          Displays: 'Displays',
        },
      },
    })

    // 创建设计器
    const engine = createDesigner({
      shortcuts: [],
      rootComponentName: 'Form',
    })
    // 查看页面链接
    const lookPageUrl = () => {
      const url = router.resolve({
        path: '/formPage',
        query: { formId: route.query.formId, preview: 'preview' },
      })
      ElMessageBox.alert(url.href, '链接', {
        center: true,
        confirmButtonText: '在另一个页面打开',
        callback: (action: string) => {
          if (action === 'confirm') {
            window.open(url.href)
          }
        },
      })
    }

    // 保存
    function handleSaveSchema() {
      const schemaJson = transformToSchema(engine.getCurrentTree())
      console.log('schemaJson', schemaJson)
      window.localStorage.setItem('schemaJson', JSON.stringify(schemaJson))
      ElMessage.success('保存成功')
    }

    // 初始化数据
    const loadInitialSchema = () => {
      try {
        const schemaJson = window.localStorage.getItem('schemaJson')
        const tree = transformToTreeNode(JSON.parse(schemaJson))
        engine.setCurrentTree(tree)
      } catch (err) {
        throw new Error(err as any)
      }
    }
    return () => {
      return (
        <div class="designer-form-wrap">
          <Designer engine={engine}>
            <Workbench>
              <StudioPanel
                v-slots={{
                  logo: () => {
                    return <div class="title">表单模板设计</div>
                  },
                  actions: () => {
                    return (
                      <div class="dn-actions-widget">
                        <ElButton
                          style={{ marginLeft: '10px' }}
                          type="primary"
                          onClick={loadInitialSchema}
                        >
                          加载
                        </ElButton>
                        <ElButton type="primary" onClick={handleSaveSchema}>
                          保存
                        </ElButton>
                      </div>
                    )
                  },
                }}
              >
                <CompositePanel defaultActiveKey={'0'}>
                  <CompositePanel.Item
                    title="panels.Component"
                    icon="Component"
                  >
                    <ResourceWidget
                      title="sources.Inputs"
                      sources={designerFormSources.Inputs}
                    />
                    <ResourceWidget
                      title="sources.Layouts"
                      sources={designerFormSources.Layouts}
                    />
                    <ResourceWidget
                      title="sources.Arrays"
                      sources={designerFormSources.Arrays}
                    />
                    <ResourceWidget
                      title="sources.Displays"
                      sources={designerFormSources.Displays}
                    />
                  </CompositePanel.Item>
                  <CompositePanel.Item
                    title="panels.OutlinedTree"
                    icon="Outline"
                  >
                    <OutlineTreeWidget />
                  </CompositePanel.Item>
                  <CompositePanel.Item title="panels.History" icon="History">
                    <HistoryWidget />
                  </CompositePanel.Item>
                </CompositePanel>
                <WorkspacePanel>
                  <ToolbarPanel>
                    <DesignerToolsWidget />
                    <ViewToolsWidget
                      use={['DESIGNABLE', 'JSONTREE', 'PREVIEW']}
                    />
                  </ToolbarPanel>
                  <ViewportPanel>
                    <ViewPanel type="DESIGNABLE">
                      <ComponentTreeWidget
                        components={designerFormComponents}
                      />
                    </ViewPanel>
                    <ViewPanel
                      type="JSONTREE"
                      scrollable={false}
                      v-slots={{
                        default: (tree: any, onChange: () => void) => {
                          return (
                            <SchemaEditorWidget
                              tree={tree}
                              onChange={onChange}
                            />
                          )
                        },
                      }}
                    />
                    <ViewPanel
                      type="PREVIEW"
                      scrollable={false}
                      v-slots={{
                        default: (tree: any) => {
                          return <PreviewWidget tree={tree} />
                        },
                      }}
                    />
                  </ViewportPanel>
                </WorkspacePanel>
                <SettingsPanel title="panels.PropertySettings">
                  <SettingsForm />
                </SettingsPanel>
              </StudioPanel>
            </Workbench>
          </Designer>
        </div>
      )
    }
  },
})
