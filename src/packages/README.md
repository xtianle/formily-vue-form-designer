# packages

> 底层使用 formily

<https://formilyjs.org/>

> 模块说明

```
designable 实现拖拽逻辑的模块

designer-main-body 实现设计器主体的组件

designer-renderer 实现设计器渲染的组件

designer-setings-from 实现渲染组件属性设置器的组件

expose 对外暴露的组件

```

> 需要修改的配置项

vite.config.ts

```
 // 处理monaco-editor的插件
import MonacoEditorPlugin from 'vite-plugin-monaco-editor'

{
  plugins: [vue(), vueJsx(), MonacoEditorPlugin()],
  resolve: {
    // 设置模块的映射路径
    alias: {
      '@designable/shared': fileURLToPath(
        new URL('./src/packages/designable/shared', import.meta.url)
      ),
      '@designable/core': fileURLToPath(
        new URL('./src/packages/designable/core', import.meta.url)
      ),
      '@designable/transformer': fileURLToPath(
        new URL('./src/packages/designable/transformer', import.meta.url)
      ),
      '@designer-main-body': fileURLToPath(
        new URL('./src/packages/designer-main-body', import.meta.url)
      ),
      '@designer-renderer': fileURLToPath(
        new URL('./src/packages/designer-renderer', import.meta.url)
      ),
      '@designer-setings-from': fileURLToPath(
        new URL('./src/packages/designer-setings-from', import.meta.url)
      ),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}


```

tsconfig.json

```
// 设置模块的映射路径
{
    compilerOptions:{
        "baseUrl": ".",
        "paths": {
            "@designable/shared": ["./src/packages/designable/shared"],
            "@designable/core": ["./src/packages/designable/core"],
            "@designable/transformer": ["./src/packages/designable/transformer"],
            "@designer-main-body": ["./src/packages/designer-main-body"],
            "@designer-renderer": ["./src/packages/designer-renderer"],
            "@designer-setings-from": ["./src/packages/designer-setings-from"],
            "@/*": ["./src/*"]
        },
    }
}

```

.eslintignore 文件

```
// eslint验证过的不去的话   去除 eslint 验证

src/packages/designable/*
src/packages/designer-main-body/*
src/packages/designer-renderer/*
src/packages/designer-setings-from/*

```

> 拖拽组件的编写及使用的流程

```
1、编写自定义组件或使用组件库中组件做为渲染组件的基础
2、编写渲染组件的桥接逻辑，映射组件中属性
3、编写 Behavior （可以设置的属性的 json schema 数据结构）
4、编写 Resource （组件的 json schema 数据结构）
5、把写好的组件注入到【资源】、【画布】、【预览】中
```
