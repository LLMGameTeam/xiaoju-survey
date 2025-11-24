/**
 * Random question selection utility
 * 随机抽题工具函数
 */

// Number of questions to randomly select (fixed value)
// 随机抽取的题目数量（固定值）
const RANDOM_QUESTION_COUNT = 10

/**
 * Randomly select N questions from the question list
 * 从题目列表中随机抽取N道题目
 * @param {Array} questionList - Original question list / 原始题目列表
 * @param {Number} count - Number of questions to select / 要抽取的题目数量
 * @returns {Array} - Randomly selected question list / 随机抽取后的题目列表
 */
export function randomSelectQuestions(questionList, count = RANDOM_QUESTION_COUNT) {
  // If no question list or count is invalid, return original list
  // 如果没有题目列表或数量无效，返回原始列表
  if (!questionList || !Array.isArray(questionList) || questionList.length === 0) {
    return questionList
  }

  // If question count is less than or equal to the selection count, return all questions
  // 如果题目数量小于等于抽取数量，返回所有题目
  if (questionList.length <= count) {
    return questionList
  }

  // Create a copy of the question list to avoid modifying the original
  // 创建题目列表的副本，避免修改原始数据
  const questions = [...questionList]

  // Fisher-Yates shuffle algorithm to randomly select questions
  // 使用 Fisher-Yates 洗牌算法随机抽取题目
  const selectedQuestions = []

  for (let i = 0; i < count; i++) {
    // Generate random index
    // 生成随机索引
    const randomIndex = Math.floor(Math.random() * questions.length)

    // Add selected question to result array
    // 将选中的题目添加到结果数组
    selectedQuestions.push(questions[randomIndex])

    // Remove selected question from pool to avoid duplicate selection
    // 从池中移除已选中的题目，避免重复选择
    questions.splice(randomIndex, 1)
  }

  return selectedQuestions
}

/**
 * Get the default random question count
 * 获取默认的随机题目数量
 * @returns {Number}
 */
export function getRandomQuestionCount() {
  return RANDOM_QUESTION_COUNT
}

/**
 * Randomly select questions by section
 * 按部分随机抽取题目
 * @param {Array} questionList - Original question list / 原始题目列表
 * @param {Object} sectionRandomConfig - Section random configuration / 分部分随机配置
 * @returns {Array} - Question list after section-based random selection / 分部分随机抽取后的题目列表
 */
export function randomSelectQuestionsBySection(questionList, sectionRandomConfig) {
  // If no question list, return original list
  // 如果没有题目列表，返回原始列表
  if (!questionList || !Array.isArray(questionList) || questionList.length === 0) {
    return questionList
  }

  // If no section random config, return original list
  // 如果没有分部分随机配置，返回原始列表
  if (!sectionRandomConfig || typeof sectionRandomConfig !== 'object') {
    return questionList
  }

  // Group questions by section
  // 按部分分组题目
  const sectionGroups = {}
  const sectionOrder = [] // Track section order / 记录部分顺序

  questionList.forEach(question => {
    const section = question.section || 'default'

    if (!sectionGroups[section]) {
      sectionGroups[section] = []
      sectionOrder.push(section)
    }

    sectionGroups[section].push(question)
  })

  // Process each section
  // 处理每个部分
  const processedSections = {}

  Object.keys(sectionGroups).forEach(section => {
    const questions = sectionGroups[section]
    const config = sectionRandomConfig[section]

    // If this section has random config and is enabled
    // 如果该部分有随机配置且已启用
    if (config && config.enabled) {
      const count = config.count || RANDOM_QUESTION_COUNT
      processedSections[section] = randomSelectQuestions(questions, count)
    } else {
      // Keep original order for sections without random config
      // 没有随机配置的部分保持原顺序
      processedSections[section] = questions
    }
  })

  // Combine sections in original order
  // 按原始顺序组合各部分
  const result = []
  sectionOrder.forEach(section => {
    if (processedSections[section]) {
      result.push(...processedSections[section])
    }
  })

  return result
}

