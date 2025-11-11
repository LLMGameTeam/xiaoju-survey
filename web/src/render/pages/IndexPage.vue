<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPublishedSurveyInfo, getPreviewSchema } from '../api/survey'
import AlertDialog from '../components/AlertDialog.vue'
import { useSurveyStore } from '../stores/survey'
import useCommandComponent from '../hooks/useCommandComponent'
import { randomSelectQuestions, randomSelectQuestionsBySection } from '../utils/randomQuestions'

const route = useRoute()
const surveyStore = useSurveyStore()

watch(
  () => route.query.t,
  (t) => {
    if (t) location.reload()
  }
)

onMounted(() => {
  const surveyId = route.params.surveyId
  surveyStore.setSurveyPath(surveyId)
  getDetail(surveyId as string)
})
const loadData = (res: any, surveyPath: string) => {
  if (res.code === 200) {
    const data = res.data
    const {
      bannerConf,
      baseConf,
      bottomConf,
      dataConf,
      skinConf,
      submitConf,
      logicConf,
      pageConf
    } = data.code
    
    // Apply random question selection
    // 应用随机抽题功能
    let randomizedDataList

    // Check if section-based random config exists
    // 检查是否有分部分随机配置
    if (dataConf.sectionRandomConfig && Object.keys(dataConf.sectionRandomConfig).length > 0) {
      // Use section-based random selection
      // 使用分部分随机抽题
      randomizedDataList = randomSelectQuestionsBySection(
        dataConf.dataList,
        dataConf.sectionRandomConfig
      )
    } else {
      // Use original random selection for backward compatibility
      // 使用原有随机抽题方式（向后兼容）
      randomizedDataList = randomSelectQuestions(dataConf.dataList)
    }

    const randomizedDataConf = {
      ...dataConf,
      dataList: randomizedDataList
    }
    
    const questionData = {
      bannerConf,
      baseConf,
      bottomConf,
      dataConf: randomizedDataConf,
      skinConf,
      submitConf,
      pageConf
    }

    if (!pageConf || pageConf?.length == 0) {
      questionData.pageConf = [randomizedDataConf.dataList.length]
    }

    document.title = data.title

    surveyStore.setSurveyPath(surveyPath)
    surveyStore.initSurvey(questionData)
    surveyStore.initShowLogicEngine(logicConf?.showLogicConf)
    surveyStore.initJumpLogicEngine(logicConf?.jumpLogicConf)
  } else {
    throw new Error(res.errmsg)
  }
}

function isObjectId(id: string) {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/
  return objectIdRegex.test(id)
}

const getDetail = async (surveyPath: string) => {
  const alert = useCommandComponent(AlertDialog)
  try {
    if (isObjectId(surveyPath)) {
      const res: any = await getPreviewSchema({ surveyPath })
      loadData(res, surveyPath)
    } else {
      const res: any = await getPublishedSurveyInfo({ surveyPath })
      // checkStatus(res.data)
      loadData(res, surveyPath)
      surveyStore.getEncryptInfo()
    }
  } catch (error: any) {
    console.log(error)
    alert({ title: error.message || '获取问卷失败' })
  }
}
</script>
