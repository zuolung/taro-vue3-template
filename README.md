## Taro + vue3 项目模版

taro版本`3.5.8`，目前支持微信、支付宝、抖音、快手、百度小程序；支持H5

### 启动项目

启动方式分为下面三种方式

- `yarn watch:xx`: 测试环境地址`uat`
- `yarn dev:xx`: 开发环境地址`dev`
- `yarn build:xx`: 线上环境地址`real`

可以通过创建`.env`文件，设置`API_URL`环境变量来强制修改当前请求的环境，或者通过命令行`cross-env`设置

```t
# .env文件
API_URL='https://xxx.lexing.com'
```

### 目录结构

├── config/                    # taro 构建配置
├── types/                     # 全局TS类型
├── src
│   ├── api                    # 全局请求
│   ├── components             # 公共组件和业务组件
│   ├── contanst               # 公共枚举
│   ├── hooks                  # hooks函数
│   ├── iconfont               # 目前仅支持手动修改
│   ├── store                  # 全局数据管理，目前主要为用户信息、全局loading和error信息
│   ├── utils                  # 主要的方法库，请求、方法库、小程序平台方法的封装
│   ├── pages                  # 业务页面
│   ├── app.config.js          # 路由配置、全局页面配置
│   ├── app.ts                 # 入口文件
│   ├── app.scss               # 全局样式

### 主体功能

- 全局数据管理：`pinia`
- 图表库iconfont: 
  - 文件位置`@/iconfont`
  - 替换图表库，需要保留/修改原有图标
    1. `jmc-icon-xiajiantou`、`jmc-icon-youjiantou`内置表单组件箭头
    2. `jmc-icon-loading`全局loaing
    3. `Nodata-pana_fuzh`错误页面图标
- 持久缓存管理： `cache from '@/cache'`, 额外使用须自定义TS和方法
- hooks：
  - [`taro-hooks`](https://next-taro-hooks.pages.dev/site/hooks/intro), 部分hooks存在bug
  - `@/hooks`：自定义hooks
- UI框架： [NutUI-Vue 组件](https://nutui.jd.com/h5/vue/4x/#/zh-CN/guide/intro)
- 异常捕获和埋点：[@antmjs/trace](https://github.com/AntmJS/antm/blob/main/packages/trace)
  - 上报信息：`@/trace`下已定义好初始化方法和上报阿里云存储的示例
  - 事件埋点： `data-click-id`定义时间埋点，复杂埋点通过`exposure`投放
- 支持JSX: 
  - `tsx`的组件写法，省略组件注册、更便捷的遍历渲染和条件渲染
  - `emit`需要在`setup`的第二个回调参数中使用emit
  - `slot`需要`setup`的第二个回调参数中使用slot['default/xx']和taroComponents下面的Slot搭配使用
- 内置组件：
  - `container`: 页面公共容器
  - `datePickerBox`: 基于nutDatePicker时间选择
  - `pickerBox`: 基于nutPicker选择
  - `cascaderBox`: 基于cascaderBox级联选择
  - `checkList`: 选择列表
  - `uploaderBox`: 上传组件
