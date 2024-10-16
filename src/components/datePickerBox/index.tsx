import { View } from '@tarojs/components'
import { computed, defineComponent, ref, watch } from 'vue'
import { Popup, DatePicker } from '@nutui/nutui-taro'
import { Props } from './types'
import classNames from 'classnames'
import dayjs from 'dayjs'
import './index.scss'

export default defineComponent({
  name: 'pickerBox',
  props: Props,
  setup(props, { emit }) {
    const show = ref(false)
    const innerValue = ref<Date | undefined>(undefined)
    const pickerValue = ref<Date | undefined>(undefined)

    watch(
      () => props.modelValue,
      () => {
        if (props.modelValue) {
          innerValue.value =
            props.modelValue instanceof Date
              ? props.modelValue
              : dayjs(props.modelValue).toDate()
        } else {
          innerValue.value = undefined
        }
      },
    )

    const curContent = computed(() => {
      if (innerValue.value) {
        if (props.formatContent) {
          return props.formatContent(innerValue.value)
        }

        return dayjs(innerValue.value).format('YYYY-MM-DD HH:mm')
      } else {
        return ''
      }
    })

    const clear = () => {
      emit('update:modelValue', [])
      props.onChange?.([])
      innerValue.value = undefined
      pickerValue.value = undefined
    }

    watch(
      () => show.value,
      () => {
        if (show.value) {
          if (innerValue.value)
            pickerValue.value = new Date(innerValue.value.getTime())
        } else {
          pickerValue.value = undefined
        }
      },
    )

    const handleConfirm = () => {
      if (pickerValue.value)
        innerValue.value = new Date(pickerValue.value?.getTime())
      props.onChange?.(innerValue.value)
      emit('update:modelValue', innerValue)
      show.value = false
    }

    return () => {
      const {
        containerClass,
        placeholder,
        allowClear,
        showArrowDown,
        showArrowLeft,
        visibleOptionNum,
        okText,
        cancelText,
        optionHeight,
        title,
        minDate,
        maxDate,
        type,
        filter,
        isShowChinese,
      } = props

      return (
        <View class={`components-date-picker-box ${containerClass}`}>
          <View
            class={classNames({
              'picker-box-content': true,
              'picker-box-content-placeholder': curContent.value === '',
            })}
            onClick={() => (show.value = true)}
          >
            {curContent.value ? curContent.value : placeholder}
          </View>
          {allowClear && curContent.value && (
            <View
              class="jmc-icon jmc-icon-clear clear-box"
              onClick={clear}
            ></View>
          )}
          {showArrowDown && (
            <View
              onClick={() => (show.value = true)}
              class="jmc-icon jmc-icon-xiajiantou components-picker-box-arrow"
            ></View>
          )}
          {showArrowLeft && (
            <View
              onClick={() => (show.value = true)}
              class="jmc-icon jmc-icon-youjiantou components-picker-box-arrow"
            ></View>
          )}

          <Popup v-model:visible={show.value} position="bottom">
            <DatePicker
              isShowChinese={isShowChinese}
              filter={filter}
              type={type}
              minDate={minDate}
              maxDate={maxDate}
              visibleOptionNum={visibleOptionNum}
              okText={okText}
              cancelText={cancelText}
              optionHeight={optionHeight}
              title={title}
              v-model={pickerValue.value}
              onConfirm={handleConfirm}
              onCancel={() => (show.value = false)}
            ></DatePicker>
          </Popup>
        </View>
      )
    }
  },
})
