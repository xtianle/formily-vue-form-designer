import { Engine, IResource, IBehavior } from '@designable/core'

import type { Component, ComputedOptions, DefineComponent } from 'vue'

export interface IDesignerLayoutProps {
  prefixCls?: string
  theme?: 'dark' | 'light' | (string & {})
  variables?: Record<string, string>
  position?: 'fixed' | 'absolute' | 'relative'
}
export interface IDesignerProps extends IDesignerLayoutProps {
  engine: Engine
}

export interface IDesignerComponents {
  [key: string]: DnFC<any> | DnComponent<any>
}

export interface IDesignerLayoutContext {
  theme?: 'dark' | 'light' | (string & {})
  prefixCls: string
  position: 'fixed' | 'absolute' | 'relative'
}

export interface IWorkspaceContext {
  id: string
  title?: string
  description?: string
}

// export type DnFC<P = any> = DefineComponent<P> & {
//   Resource?: IResource[]
//   Behavior?: IBehavior[]
// }

// export type DnComponent<P = any> = DefineComponent<P> & {
//   Resource?: IResource[]
//   Behavior?: IBehavior[]
// }

// export type DnFC<P = {}> = Component<any, any, any, P> & {
//   Resource?: IResource[]
//   Behavior?: IBehavior[]
// }

// export type DnComponent<P = {}> = Component<any, any, any, P> & {
//   Resource?: IResource[]
//   Behavior?: IBehavior[]
// }

export type DnFC<P extends ComputedOptions = Record<string, any>> = Component<
  any,
  any,
  any,
  P
> & {
  Resource?: IResource[]
  Behavior?: IBehavior[]
}

export type DnComponent<P extends ComputedOptions = Record<string, any>> =
  Component<any, any, any, P> & {
    Resource?: IResource[]
    Behavior?: IBehavior[]
  }
