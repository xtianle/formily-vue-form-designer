import { Simulator } from '../containers'
import { WorkspacePanel, IWorkspaceItemProps } from './WorkspacePanel'

export const ViewportPanel = (props: IWorkspaceItemProps, { slots, attrs }) => {
  return (
    <WorkspacePanel.Item {...props} {...attrs} flexable>
      <Simulator>{slots.default()}</Simulator>
    </WorkspacePanel.Item>
  )
}
