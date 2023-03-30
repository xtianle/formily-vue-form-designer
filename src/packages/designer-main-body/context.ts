import { TreeNode, Engine } from '@designable/core'
import {
  IDesignerLayoutContext,
  IWorkspaceContext,
  IDesignerComponents
} from './types'
import { inject, ref, InjectionKey, Ref } from 'vue'
// 设计器组件符号
export const DesignerComponentsSymbol: InjectionKey<Ref<IDesignerComponents>> =
  Symbol('DesignerComponentsSymbol')

// 设计器布局符号
export const DesignerLayoutSymbol: InjectionKey<Ref<IDesignerLayoutContext>> =
  Symbol('DesignerLayoutSymbol')

// 设计器引擎符号
export const DesignerEngineSymbol: InjectionKey<Ref<Engine>> = Symbol(
  'DesignerEngineSymbol'
)

// 树节点符号
export const TreeNodeSymbol: InjectionKey<Ref<TreeNode>> =
  Symbol('TreeNodeSymbol')

// 工作空间符号
export const WorkspaceSymbol: InjectionKey<Ref<IWorkspaceContext>> =
  Symbol('WorkspaceSymbol')

/**
 * 使用的上下文
 * @param key
 * @returns
 */
export function useContext<T>(key: InjectionKey<Ref<T>>) {
  return inject(key, ref()) as Ref<T>
}
