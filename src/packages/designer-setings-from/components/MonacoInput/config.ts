import { loader } from '@guolao/vue-monaco-editor'
import * as monaco from 'monaco-editor'
import chromeTheme from './themes/chrome'
import monokaiTheme from './themes/monokai'
import { format } from './format'

let initialized = false

export const initMonaco = () => {
  if (initialized) return
  loader.config({ monaco })
  loader.init().then((monaco) => {
    monaco.editor.defineTheme('monokai', monokaiTheme as any)
    monaco.editor.defineTheme('chrome-devtools', chromeTheme as any)
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
    })

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: true,
    })
    monaco.languages.registerDocumentFormattingEditProvider('typescript', {
      provideDocumentFormattingEdits(model) {
        return [
          {
            text: format(
              model['getDesignerLanguage']?.() || 'typescript',
              model.getValue()
            ),
            range: model.getFullModelRange(),
          },
        ]
      },
    })
    initialized = true
  })
}
