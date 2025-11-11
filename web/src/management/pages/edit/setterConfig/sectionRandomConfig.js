export default {
  section_random_part1: {
    key: 'sectionRandomConfig.part1.enabled',
    label: '第一部分随机抽题',
    type: 'CustomedSwitch',
    tip: '启用后，第一部分的题目将随机抽取指定数量'
  },
  section_random_part1_count: {
    key: 'sectionRandomConfig.part1.count',
    label: '抽取数量',
    type: 'InputNumber',
    min: 1,
    tip: '从第一部分随机抽取的题目数量',
    relyFunc: (data) => {
      return data?.sectionRandomConfig?.part1?.enabled
    }
  },
  section_random_part2: {
    key: 'sectionRandomConfig.part2.enabled',
    label: '第二部分随机抽题',
    type: 'CustomedSwitch',
    tip: '启用后，第二部分的题目将随机抽取指定数量'
  },
  section_random_part2_count: {
    key: 'sectionRandomConfig.part2.count',
    label: '抽取数量',
    type: 'InputNumber',
    min: 1,
    tip: '从第二部分随机抽取的题目数量',
    relyFunc: (data) => {
      return data?.sectionRandomConfig?.part2?.enabled
    }
  },
  section_random_part3: {
    key: 'sectionRandomConfig.part3.enabled',
    label: '第三部分随机抽题',
    type: 'CustomedSwitch',
    tip: '启用后，第三部分的题目将随机抽取指定数量'
  },
  section_random_part3_count: {
    key: 'sectionRandomConfig.part3.count',
    label: '抽取数量',
    type: 'InputNumber',
    min: 1,
    tip: '从第三部分随机抽取的题目数量',
    relyFunc: (data) => {
      return data?.sectionRandomConfig?.part3?.enabled
    }
  }
}
