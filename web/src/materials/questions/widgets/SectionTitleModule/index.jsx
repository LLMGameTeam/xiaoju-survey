import { defineComponent, computed } from 'vue'
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
    indexNumber: {
      type: [Number, String],
      default: ''
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const sectionTitle = computed(() => {
      return props.moduleConfig?.title || '分部标题'
    })

    const handleInput = (event) => {
      const value = event.target.innerText
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
      handlePaste,
      readonly: props.readonly
    }
  },
  render() {
    const { sectionTitle, handleInput, handlePaste, readonly } = this

    return (
      <div class="section-title-wrapper">
        {!readonly ? (
          <div
            class="section-title editable"
            contenteditable="true"
            onInput={handleInput}
            onPaste={handlePaste}
          >
            {sectionTitle}
          </div>
        ) : (
          <div class="section-title">
            {sectionTitle}
          </div>
        )}
      </div>
    )
  }
})
