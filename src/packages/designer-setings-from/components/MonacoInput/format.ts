import { parse } from '@babel/parser'
import { format as prettierFormat } from 'prettier'

// interface IPrettierModule {
//   default: {
//     format(
//       source: string,
//       options: {
//         semi?: boolean
//         parser?: (code: string) => any
//       }
//     ): string
//   }
// }

export const format = (language: string, source: string) => {
  if (
    language === 'javascript.expression' ||
    language === 'typescript.expression'
  ) {
    return source
  }
  if (/(?:javascript|typescript)/gi.test(language)) {
    return prettierFormat(source, {
      semi: false,
      parser(text) {
        return parse(text, {
          sourceType: 'module',
          plugins: ['typescript', 'jsx'],
        })
      },
    })
  }
  if (language === 'json') {
    return JSON.stringify(JSON.parse(source), null, 2)
  }
  return source
}
