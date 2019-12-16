# ShareModule

**应** 导出所有包含的模块。

**不应** 有 `providers` 属性。

## 自定义全局组件或指令

每一个通用的业务组件或通用指令应该有一个完整的说明文件，**建议**一个合理的目录结构应该是：

```
├── components
│   ├── comp1
│   │   ├── comp1.module.ts
│   │   ├── comp1.component.ts
│   │   ├── README.md
│   ├── comp2
│   │   ├── comp2.module.ts
│   │   ├── comp2.component.ts
│   │   ├── README.md
├── directives
│   ├── dire1
│   │   ├── dire1.module.ts
│   │   ├── dire1.directive.ts
│   │   ├── README.md
│   ├── dire2
│   │   ├── dire2.module.ts
│   │   ├── dire2.directive.ts
│   │   ├── README.md
```
