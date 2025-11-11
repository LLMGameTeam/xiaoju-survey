# 分部分随机抽题配置说明

## 功能概述

支持将问卷分为多个部分，对特定部分进行随机抽题，其他部分保持固定顺序。例如：
- 第一部分：固定显示（如基本信息）
- 第二部分：从题库中随机抽取N题
- 第三部分：固定显示（如补充说明）

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

## 示例数据配置

如果您需要为现有问卷添加分部分随机功能，按以下步骤操作：

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

## 未来扩展

可以考虑的功能扩展：
- ✅ 多部分随机（已支持）
- ⚪ 随机策略配置（权重、难度）
- ⚪ 断点续答支持（固定随机结果）
- ⚪ 编辑器UI支持（可视化配置section）
- ⚪ 统计分析（每道题的展示频率）
