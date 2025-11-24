/**
 * 处理单题的配置
 */

import { get as _get } from 'lodash-es'

export default function (questionConfig) {
  let dataList = _get(questionConfig, 'dataConf.dataList')
  // 将题目列表转成对象，并且对题目类型、题目的选项做一些字段的增加和转换
  const questionData = dataList.reduce((pre, item, index) => {
    // Use originalIndex if available (for jump logic to work correctly with randomized questions)
    // 如果存在 originalIndex 则使用它（确保随机题目的跳转逻辑正确工作）
    const questionIndex = item.originalIndex !== undefined ? item.originalIndex : index

    Object.assign(pre, {
      [item.field]: {
        indexNumber: '',
        voteTotal: 0,
        index: questionIndex,
        originalIndex: questionIndex,
        ...item
      }
    })
    return pre
  }, {})

  return {
    questionData
  }
}
