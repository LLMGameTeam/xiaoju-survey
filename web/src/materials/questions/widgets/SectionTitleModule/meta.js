export const meta = {
  title: '分部标题',
  type: 'section-title',
  componentName: 'SectionTitleModule',
  attrs: [
    {
      name: 'field',
      propType: 'String',
      description: '题目id',
      defaultValue: ''
    },
    {
      name: 'title',
      propType: 'String',
      description: '分部标题文本',
      defaultValue: '第一部分'
    },
    {
      name: 'type',
      propType: 'String',
      description: '题目类型',
      defaultValue: 'section-title'
    },
    {
      name: 'section',
      propType: 'String',
      description: '所属部分标识',
      defaultValue: 'part1'
    }
  ],
  formConfig: [
    {
      name: 'title',
      title: '标题文本',
      type: 'InputSetter',
      placeholder: '请输入分部标题',
      key: 'title'
    },
    {
      name: 'section',
      title: '所属部分',
      type: 'SelectSetter',
      key: 'section',
      options: [
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
      ]
    }
  ]
}

export default meta
