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

