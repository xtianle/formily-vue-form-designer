import { MonacoInput } from '../MonacoInput'
import { formilyCoreInterfaceData } from './interfaceData'
import * as monaco from 'monaco-editor'
export interface IDependency {
  name: string
  path: string
}

export const initDeclaration = async () => {
  MonacoInput.loader.config({ monaco })
  return MonacoInput.loader.init().then(async (monaco) => {
    const deps = [
      {
        name: '@formily/core',
        path: 'dist/formily.core.all.d.ts',
        library: formilyCoreInterfaceData,
      },
    ]
    deps?.forEach(({ name, library }) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        `declare module '${name}'{ ${library} }`,
        `file:///node_modules/${name}/index.d.ts`
      )
    })
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
    import { Form, Field } from '@formily/core'
    declare global {
      /*
       * Form Model
       **/
      declare var $form: Form
      /*
       * Form Values
       **/
      declare var $values: any
      /*
       * Field Model
       **/
      declare var $self: Field
      /*
       * create an persistent observable state object
       **/
      declare var $observable: <T>(target: T, deps?: any[]) => T
      /*
       * create a persistent data
       **/
      declare var $memo: <T>(callback: () => T, deps?: any[]) => T
      /*
       * handle side-effect logic
       **/
      declare var $effect: (callback: () => void | (() => void), deps?: any[]) => void
      /*
       * set initial component props to current field
       **/
      declare var $props: (props: any) => void
    }
    `,
      `file:///node_modules/formily_global.d.ts`
    )
  })
}
