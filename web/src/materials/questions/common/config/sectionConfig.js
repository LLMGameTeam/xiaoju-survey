export default {
  name: 'sectionConfig',
  title: '所属部分',
  type: 'SelectSetter',
  key: 'section',
  options: [
    {
      label: '不分组',
      value: ''
    },
    {
      label: '第一部分',
      value: 'part1'
    },
    {
      label: '第二部分',
      value: 'part2'
    },
    {
      label: '第三部分',
      value: 'part3'
    }
  ],
  tip: '用于分部分随机抽题功能，可在问卷配置中设置每个部分的随机策略',
  placement: 'top'
}
