# 随机抽题功能配置说明 / Random Question Selection Configuration

## 功能描述 / Description

当用户打开问卷时，系统会从问卷的所有题目中随机抽取固定数量的题目展示给用户。

When users open a questionnaire, the system will randomly select a fixed number of questions from all available questions to display.

## 配置方法 / Configuration

### 修改随机抽取的题目数量 / Modify the Number of Random Questions

打开文件 / Open file: `web/src/render/utils/randomQuestions.js`

找到常量 / Find the constant:
```javascript
const RANDOM_QUESTION_COUNT = 10
```

将数字 `10` 修改为您需要的题目数量 / Change `10` to your desired number.

例如 / For example:
- 抽取5题 / Select 5 questions: `const RANDOM_QUESTION_COUNT = 5`
- 抽取15题 / Select 15 questions: `const RANDOM_QUESTION_COUNT = 15`
- 抽取20题 / Select 20 questions: `const RANDOM_QUESTION_COUNT = 20`

## 工作原理 / How It Works

1. 当用户访问问卷页面时，系统会从后端获取完整的问卷数据
2. 在渲染问卷之前，`randomSelectQuestions` 函数会使用 Fisher-Yates 洗牌算法从所有题目中随机抽取指定数量的题目
3. 如果问卷的题目总数小于或等于配置的抽取数量，则显示所有题目
4. 每次刷新页面，都会重新随机抽取题目

**Note:**
1. When users visit the questionnaire page, the system fetches complete questionnaire data from the backend
2. Before rendering the questionnaire, the `randomSelectQuestions` function uses the Fisher-Yates shuffle algorithm to randomly select a specified number of questions
3. If the total number of questions is less than or equal to the configured selection count, all questions will be displayed
4. Questions are randomly selected each time the page is refreshed

## 示例场景 / Example Scenario

### 场景 / Scenario:
- 问卷编辑时创建了 30 道题目
- 配置随机抽取 10 题
- 用户打开问卷时只会看到随机选中的 10 题

### Example:
- 30 questions created during questionnaire editing
- Configured to randomly select 10 questions
- Users will only see 10 randomly selected questions when opening the questionnaire

## 技术细节 / Technical Details

### 文件位置 / File Locations:
- 工具函数 / Utility function: `web/src/render/utils/randomQuestions.js`
- 应用位置 / Application point: `web/src/render/pages/IndexPage.vue`

### 算法 / Algorithm:
使用 Fisher-Yates 洗牌算法确保：
- 随机性：每个题目被选中的概率相等
- 唯一性：不会选中重复的题目
- 高效性：时间复杂度 O(n)

Using Fisher-Yates shuffle algorithm ensures:
- Randomness: Each question has an equal probability of being selected
- Uniqueness: No duplicate questions will be selected
- Efficiency: Time complexity O(n)

## 注意事项 / Notes

1. **断点续答**：如果启用了断点续答功能，用户刷新页面后会看到不同的题目组合。您可能需要根据业务需求调整此行为。
2. **逻辑跳转**：如果问卷中设置了显示逻辑或跳转逻辑，随机抽题可能会影响这些逻辑的正常工作，请谨慎使用。
3. **分页配置**：随机抽题后，系统会自动调整分页配置 `pageConf`。

**Warnings:**
1. **Resume Capability**: If resume capability is enabled, users will see different question combinations after refreshing the page. You may need to adjust this behavior based on business requirements.
2. **Logic Jump**: If display logic or jump logic is set in the questionnaire, random question selection may affect the normal operation of these logics. Please use with caution.
3. **Pagination Config**: After random question selection, the system will automatically adjust the pagination configuration `pageConf`.

## 扩展功能建议 / Suggestions for Extended Features

如果您需要更高级的功能，可以考虑：
1. 将随机题目数量配置到数据库或配置文件中
2. 为每个用户会话固定题目组合（使用 sessionStorage 或 cookie）
3. 支持按题目类型或分类进行随机抽取
4. 添加权重配置，使某些题目更容易被抽中

If you need more advanced features, consider:
1. Store the random question count in database or configuration file
2. Fix question combinations for each user session (using sessionStorage or cookie)
3. Support random selection by question type or category
4. Add weight configuration to make certain questions more likely to be selected

