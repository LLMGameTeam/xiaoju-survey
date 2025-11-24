import { defineComponent, computed } from 'vue'
import { filterXSS } from '@/common/xss'
import '@/render/styles/variable.scss'
import './index.scss'

export default defineComponent({
  name: 'SectionTitleModule',
  props: {
    moduleConfig: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const sectionTitle = computed(() => {
      return props.title || props.moduleConfig?.title || '分部标题'
    })

    const handleInput = (event) => {
      const value = event.target.innerText.trim()
      emit('change', {
        key: 'title',
        value
      })
    }

    const handlePaste = (event) => {
      // 阻止默认粘贴行为，只粘贴纯文本
      event.preventDefault()
      const text = (event.clipboardData || window.clipboardData).getData('text/plain')
      document.execCommand('insertText', false, text)
    }

    return {
      sectionTitle,
      handleInput,
      handlePaste
    }
  },
  render() {
    const { sectionTitle, handleInput, handlePaste, readonly } = this

    // 答题页面：只显示纯文本
    if (readonly) {
      return (
        <div class="section-title-readonly">
          <div class="section-title-text">{sectionTitle}</div>
        </div>
      )
    }

    // 编辑器：使用标准题目标题结构
    return (
      <div class="section-title-wrapper">
        <div class="module-title is-required">
          <i class="module-title-required">*</i>
          <div class="module-content">
            <div
              class="section-title-edit"
              contenteditable="true"
              onInput={handleInput}
              onPaste={handlePaste}
              v-html={filterXSS(sectionTitle)}
            ></div>
          </div>
        </div>
      </div>
    )
  }
})
