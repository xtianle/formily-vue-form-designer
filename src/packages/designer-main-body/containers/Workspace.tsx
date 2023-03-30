import { computed, defineComponent, PropType, provide, ref, unref } from 'vue'
import { WorkspaceSymbol } from '../context'
import { useDesigner } from '../hooks'

export const Workspace = defineComponent({
  name: 'Workspace',
  props: {
    id: {
      type: String as PropType<string>,
      default: undefined,
    },
    title: {
      type: String as PropType<string>,
      default: undefined,
    },
    description: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const oldId = ref<string>()

    const designerRef = useDesigner()
    const workspace = computed(() => {
      const designer = unref(designerRef)

      if (oldId.value && oldId.value !== props.id) {
        const old = designer.workbench.findWorkspaceById(oldId.value)
        if (old) old.viewport.detachEvents()
      }
      const workspace = {
        id: props.id || 'index',
        title: props.title,
        description: props.description,
      }
      designer.workbench.ensureWorkspace(workspace)
      oldId.value = workspace.id
      return workspace
    })

    provide(WorkspaceSymbol, workspace)

    return () => {
      return <>{slots?.default()}</>
    }
  },
})
