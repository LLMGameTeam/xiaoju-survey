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
 * Randomly select questions by section
 * 按部分随机抽取题目
 * @param {Array} questionList - Original question list / 原始题目列表
 * @param {Object} sectionRandomConfig - Section random configuration / 部分随机配置
 * @returns {Array} - Question list with random sections / 按部分随机后的题目列表
 */
export function randomSelectQuestionsBySection(questionList, sectionRandomConfig) {
  // If no question list, return empty array
  // 如果没有题目列表，返回空数组
  if (!questionList || !Array.isArray(questionList) || questionList.length === 0) {
    return questionList || []
  }

  // If no random config, return original list with original indices preserved
  // 如果没有随机配置，返回原始列表并保留原始索引
  if (!sectionRandomConfig || Object.keys(sectionRandomConfig).length === 0) {
    return questionList.map((q, index) => ({
      ...q,
      originalIndex: q.originalIndex !== undefined ? q.originalIndex : index
    }))
  }

  // Step 1: Add original index to all questions (preserve original order for jump logic)
  // 第1步：为所有题目添加原始索引（为跳转逻辑保留原始顺序）
  const questionsWithOriginalIndex = questionList.map((question, index) => ({
    ...question,
    originalIndex: question.originalIndex !== undefined ? question.originalIndex : index
  }))

  // Step 2: Group questions by section
  // 第2步：按部分分组题目
  const sectionMap = {}
  questionsWithOriginalIndex.forEach((question) => {
    const section = question.section || 'default'
    if (!sectionMap[section]) {
      sectionMap[section] = []
    }
    sectionMap[section].push(question)
  })

  // Step 3: Process each section (randomize if configured)
  // 第3步：处理每个部分（如果配置了则随机）
  const processedSections = {}
  Object.keys(sectionMap).forEach((sectionKey) => {
    const sectionQuestions = sectionMap[sectionKey]
    const config = sectionRandomConfig[sectionKey]

    if (config && config.enabled && config.count > 0) {
      // This section needs random selection
      // 该部分需要随机抽取
      const count = Math.min(config.count, sectionQuestions.length)

      // Create a copy to avoid modifying original
      // 创建副本以避免修改原始数据
      const questionsCopy = [...sectionQuestions]
      const selectedQuestions = []

      // Randomly select questions using Fisher-Yates algorithm
      // 使用 Fisher-Yates 算法随机抽取题目
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * questionsCopy.length)
        selectedQuestions.push(questionsCopy[randomIndex])
        questionsCopy.splice(randomIndex, 1)
      }

      processedSections[sectionKey] = selectedQuestions
    } else {
      // Keep original order for non-random sections
      // 非随机部分保持原始顺序
      processedSections[sectionKey] = sectionQuestions
    }
  })

  // Step 4: Combine sections in original order
  // 第4步：按原始顺序组合各部分
  // We need to determine the order of sections based on the first occurrence of each section
  // 需要根据每个部分的第一次出现来确定部分的顺序
  const sectionOrder = []
  const seenSections = new Set()

  questionsWithOriginalIndex.forEach((question) => {
    const section = question.section || 'default'
    if (!seenSections.has(section)) {
      sectionOrder.push(section)
      seenSections.add(section)
    }
  })

  // Combine sections in the determined order
  // 按确定的顺序组合各部分
  const result = []
  sectionOrder.forEach((sectionKey) => {
    if (processedSections[sectionKey]) {
      result.push(...processedSections[sectionKey])
    }
  })

  return result
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

