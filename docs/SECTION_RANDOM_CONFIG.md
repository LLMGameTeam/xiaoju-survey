# 分部分随机抽题配置说明

## 功能概述

支持将问卷分为多个部分，对特定部分进行随机抽题，其他部分保持固定顺序。例如：
- 第一部分：固定显示（如基本信息）
- 第二部分：从题库中随机抽取N题
- 第三部分：固定显示（如补充说明）

**✨ 新增功能：支持在Web编辑器中可视化配置分部标题和随机抽题策略！**

## 数据结构

### 1. 题目配置

在每个题目（DataItem）中添加 `section` 字段标识所属部分：

```typescript
{
  "field": "question_1",
  "title": "您的姓名？",
  "type": "text",
  "section": "part1",  // 标识该题目属于第一部分
  // ... 其他字段
}
```

### 2. 随机配置

在 `dataConf` 中添加 `sectionRandomConfig` 配置：

```typescript
{
  "dataConf": {
    "dataList": [...],  // 题目列表
    "sectionRandomConfig": {
      "part2": {
        "enabled": true,  // 是否启用随机抽题
        "count": 10       // 随机抽取的题目数量
      }
    }
  }
}
```

## 完整示例

### 问卷配置示例

```json
{
  "dataConf": {
    "dataList": [
      {
        "field": "name",
        "title": "您的姓名",
        "type": "text",
        "section": "part1"
      },
      {
        "field": "age",
        "title": "您的年龄",
        "type": "text",
        "section": "part1"
      },
      {
        "field": "q1",
        "title": "随机题目1",
        "type": "radio",
        "section": "part2",
        "options": [...]
      },
      {
        "field": "q2",
        "title": "随机题目2",
        "type": "radio",
        "section": "part2",
        "options": [...]
      },
      // ... 更多part2题目（共20题）
      {
        "field": "feedback",
        "title": "您的反馈建议",
        "type": "textarea",
        "section": "part3"
      }
    ],
    "sectionRandomConfig": {
      "part2": {
        "enabled": true,
        "count": 10
      }
    }
  }
}
```

### 效果说明

用户答题时看到的题目顺序：
1. part1 的所有题目（固定显示，共2题）
2. part2 的随机10题（从20题中随机抽取）
3. part3 的所有题目（固定显示，共1题）

每次刷新页面，part2 的题目会重新随机抽取，但 part1 和 part3 保持不变。

## 使用场景

### 场景1：问卷调查
```
- 第一部分：基本信息（姓名、年龄、性别等）
- 第二部分：专业题目（从大题库中随机抽取）
- 第三部分：意见反馈
```

### 场景2：在线考试
```
- 第一部分：考生信息
- 第二部分：选择题（随机20题）
- 第三部分：问答题（固定2题）
```

### 场景3：市场调研
```
- 第一部分：用户画像
- 第二部分：产品评价（随机10个产品）
- 第三部分：购买意向
```

## 向后兼容

如果问卷配置中没有 `sectionRandomConfig`，系统会自动使用原有的随机抽题逻辑（对整个问卷随机抽取10题），确保旧问卷正常运行。

## 技术实现

### 核心逻辑

文件位置：`web/src/render/utils/randomQuestions.js`

```javascript
// 按部分随机抽题
export function randomSelectQuestionsBySection(questionList, sectionRandomConfig) {
  // 1. 按section分组题目
  // 2. 对启用随机的section进行抽题
  // 3. 按原始顺序组合各部分
  // 4. 返回最终题目列表
}
```

### 应用入口

文件位置：`web/src/render/pages/IndexPage.vue:48-59`

```javascript
if (dataConf.sectionRandomConfig && Object.keys(dataConf.sectionRandomConfig).length > 0) {
  // 使用分部分随机抽题
  randomizedDataList = randomSelectQuestionsBySection(
    dataConf.dataList,
    dataConf.sectionRandomConfig
  )
} else {
  // 使用原有随机抽题方式（向后兼容）
  randomizedDataList = randomSelectQuestions(dataConf.dataList)
}
```

## 注意事项

1. **section字段可选**：如果题目没有设置 `section`，会被归类到 `default` 部分
2. **保持顺序**：未配置随机的部分会保持原始顺序
3. **题目不足**：如果某部分题目数量少于配置的抽取数量，会显示该部分的所有题目
4. **刷新重置**：每次刷新页面会重新随机抽题（前端实现）
5. **配置灵活**：可以配置多个部分，每个部分的随机数量可以不同

## Web编辑器配置（推荐）

### 1. 添加分部标题

在编辑器的左侧"题型选择"面板中，找到"特殊组件"分组，选择"分部标题"：

1. **拖拽添加**：将"分部标题"拖拽到问卷中合适的位置
2. **编辑标题**：点击分部标题，在右侧配置面板中编辑标题文本（如"第一部分：基本信息"）
3. **设置所属部分**：在右侧配置面板中选择所属部分（part1/part2/part3）

### 2. 配置随机抽题策略

在编辑器顶部菜单中，点击"问卷配置"进入配置页面：

1. **找到"分部分随机抽题"配置项**
2. **启用随机抽题**：
   - 第一部分随机抽题：开关（默认关闭）
   - 抽取数量：输入要随机抽取的题目数量
   - 第二部分随机抽题：开关（默认关闭）
   - 抽取数量：输入要随机抽取的题目数量
   - 第三部分随机抽题：开关（默认关闭）
   - 抽取数量：输入要随机抽取的题目数量

3. **保存并发布**：配置完成后，保存并发布问卷

### 3. 设置题目所属部分

**方法1：在数据库中设置**（当前版本）
- 使用MongoDB更新题目的 `section` 字段（见下方示例）

**方法2：在编辑器中设置**（计划中）
- 未来版本将在题目配置面板中添加"所属部分"选择器

### 使用示例

假设你要创建一个三部分问卷：

1. **添加分部标题**：
   ```
   [分部标题] 第一部分：基本信息
   [单行输入] 您的姓名
   [单行输入] 您的年龄

   [分部标题] 第二部分：专业题目（随机抽取10题）
   [单选题] 专业题目1
   [单选题] 专业题目2
   ... （共20题）

   [分部标题] 第三部分：意见反馈
   [多行输入] 您的建议
   ```

2. **在数据库中设置section字段**（临时方案）：
   - 基本信息题目：`section: "part1"`
   - 专业题目：`section: "part2"`
   - 意见反馈题目：`section: "part3"`

3. **配置随机策略**：
   - 在问卷配置中，启用"第二部分随机抽题"
   - 设置抽取数量为 10

4. **发布问卷**：
   - 用户答题时，会看到：
     - 第一部分：所有题目（固定）
     - 第二部分：随机10题（从20题中抽取）
     - 第三部分：所有题目（固定）

## 数据库配置（高级）

如果需要直接在数据库中配置，按以下步骤操作：

1. 在数据库中为题目添加 `section` 字段
2. 在 `dataConf` 中添加 `sectionRandomConfig` 配置
3. 发布问卷后，用户答题时会自动应用随机逻辑

### MongoDB 更新示例

```javascript
// 更新题目的section字段
db.surveys.updateOne(
  { _id: ObjectId("...") },
  {
    $set: {
      "code.dataConf.dataList.0.section": "part1",
      "code.dataConf.dataList.1.section": "part1",
      "code.dataConf.dataList.2.section": "part2",
      // ...
      "code.dataConf.sectionRandomConfig": {
        "part2": {
          "enabled": true,
          "count": 10
        }
      }
    }
  }
)
```

## 功能清单

已实现的功能：
- ✅ 多部分随机抽题
- ✅ Web编辑器配置界面
- ✅ 分部标题组件
- ✅ 可视化配置随机策略
- ✅ 向后兼容旧问卷

计划中的功能扩展：
- ⚪ 题目编辑器中添加"所属部分"选择器（目前需要在数据库中设置）
- ⚪ 随机策略配置（权重、难度、标签筛选）
- ⚪ 断点续答支持（固定随机结果，避免刷新后题目变化）
- ⚪ 统计分析（每道题的展示频率、作答率）
- ⚪ 导入导出部分配置
