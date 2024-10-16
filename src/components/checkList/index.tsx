import { View } from '@tarojs/components'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { CheckListProps } from './types'
import { Button, Checkbox, Empty, Popup, Searchbar } from '@nutui/nutui-taro'
import { useDebounceWatch } from '@/hooks'
import './index.scss'
import classNames from 'classnames'

export default defineComponent({
  name: 'checkList',
  props: CheckListProps,
  setup(props, { emit }) {
    const show = ref(false)
    const keyWord = ref('')
    const loading = ref(false)
    const checked = ref<Array<number | string>>([])
    const checkedData = ref<Array<Record<string, any>>>([])
    const innerData = ref<Array<Record<string, any>>>([])
    const innerAllData = ref<Array<Record<string, any>>>([])

    const clear = () => {
      emit('update:modelValue', [], [])
      props.onChange?.([], [])
      checked.value = []
      checkedData.value = []
    }

    const handleCheck = (d: number | string) => {
      if (loading.value) return
      let checkedNew = [...checked.value]
      if (checkedNew.includes(d)) {
        checkedNew = checkedNew.filter((it) => it !== d)
      } else {
        checkedNew.push(d)
      }
      checked.value = checkedNew
    }

    watch(
      () => props.modelValue,
      () => {
        if (props.modelValue && Array.isArray(props.modelValue)) {
          const ddd = props.data?.length ? props.data : innerAllData.value
          const checkedData_ = ddd.filter((it) =>
            props.modelValue.includes(it[props.fieldName]),
          )
          checkedData.value = checkedData_
        }
      },
      {
        immediate: true,
      },
    )

    watch(
      () => show.value,
      (newValue) => {
        if (!newValue) {
          checked.value = []
          keyWord.value = ''
        } else {
          const cc = checkedData.value.map((it) => {
            return it[props.fieldName]
          })
          checked.value = cc
        }
      },
      {
        immediate: true,
      },
    )

    useDebounceWatch(
      keyWord,
      () => {
        if (show.value) {
          if (props.searchData) {
            searchDataInner(keyWord.value)
            return
          }
          if (keyWord.value) {
            const fData =
              props.data?.filter((it) => {
                return it[props.labelName].includes(keyWord.value)
              }) || []
            innerData.value = fData
          } else {
            innerData.value = props.data
          }
        } else {
          const ddd = props.data?.length ? props.data : innerAllData.value

          innerData.value = ddd
        }
      },
      1000,
    )

    const handleConfirm = () => {
      const ddd = props.data?.length ? props.data : innerAllData.value
      const cData = ddd.filter((d) =>
        checked.value.includes(d[props.fieldName]),
      )
      checkedData.value = cData
      props.onChange?.(checked.value, cData)
      emit('update:modelValue', checked.value, cData)
      show.value = false
    }

    const handleCheckAll = () => {
      if (loading.value) return
      const ddd = props.data?.length ? props.data : innerAllData.value
      if (checked.value.length === ddd.length) {
        checked.value = []
      } else {
        checked.value = ddd.map((it) => it[props.fieldName])
      }
    }

    const searchDataInner = async (vv: string) => {
      if (props.searchData) {
        loading.value = true
        try {
          const res = await props.searchData(vv)
          if (!vv) {
            innerAllData.value = res
          }
          innerData.value = res
        } catch (err) {
          throw new Error(err?.toString())
        } finally {
          loading.value = false
        }
      }
    }

    onMounted(() => {
      if (!!props.searchData && !innerAllData.value?.length) {
        searchDataInner('')
      } else if (!!props.searchData) {
        innerData.value = innerAllData.value
      }
      if (!props.searchData) {
        innerData.value = props.data
      }
    })

    const disabledItem = (key) => {
      if (
        checked.value.length === props.limit &&
        !checked.value.includes(key)
      ) {
        return true
      } else return false
    }

    return () => {
      const {
        bodyHeight,
        checkAll,
        fieldName,
        placeholder,
        allowClear,
        labelName,
        showArrowDown,
        showArrowLeft,
        searchShow,
        containerClass,
        searchPlaceholder,
        limit,
        data,
      } = props

      const renderShowInner = () => {
        if (!checkedData.value?.length) {
          return placeholder
        } else if (checkedData.value.length === 1) {
          return checkedData.value[0]?.[labelName] || '--'
        } else {
          return `已选${checkedData.value.length}项`
        }
      }

      return (
        <View class={`components-check-list-wrapper ${containerClass}`}>
          <View
            class={classNames({
              'check-list-content': true,
              'check-list-nocontent': checkedData.value.length === 0,
            })}
            onClick={() => (show.value = true)}
          >
            {renderShowInner()}
          </View>
          {allowClear && !!checkedData.value?.length && (
            <View
              class="jmc-icon jmc-icon-clear clear-box"
              onClick={clear}
            ></View>
          )}
          {showArrowDown && (
            <View
              onClick={() => (show.value = true)}
              class="jmc-icon jmc-icon-xiajiantou check-list-arrow"
            ></View>
          )}
          {showArrowLeft && (
            <View
              onClick={() => (show.value = true)}
              class="jmc-icon jmc-icon-youjiantou check-list-arrow"
            ></View>
          )}
          <Popup
            closeable
            v-model:visible={show.value}
            onClickCloseIcon={() => (show.value = false)}
            onClickOverlay={() => (show.value = false)}
            position="bottom"
            teleportDisable={true}
          >
            <View class="check-list-title">{placeholder}</View>
            {searchShow && (
              <Searchbar
                v-model={keyWord.value}
                placeholder={searchPlaceholder}
                background="#f5f5f5"
                inputBackground="#fff"
              />
            )}
            <View
              class="check-list-body"
              style={{ height: bodyHeight || '40vh' }}
            >
              {loading.value && (
                <View class="check-list-loading">
                  <View class="jmc-icon jmc-icon-loading"></View>
                </View>
              )}
              {!loading.value && innerData.value.length === 0 && (
                <View class="check-list-empty">
                  <Empty description="暂无数据" />
                </View>
              )}
              {checkAll && limit === undefined && (
                <View class="check-list-item" onClick={handleCheckAll}>
                  <Checkbox
                    iconSize={20}
                    modelValue={
                      checked.value.length !== 0 &&
                      (checked.value.length === data?.length ||
                        checked.value.length === innerAllData.value.length)
                    }
                    disabled={disabledItem('ALL')}
                  ></Checkbox>
                  <View class="check-label-name">全选</View>
                </View>
              )}
              {innerData.value?.map((it, index) => (
                <View
                  class="check-list-item"
                  key={`check-list-${index}-${it[labelName]}`}
                  onClick={() => handleCheck(it[fieldName])}
                >
                  <Checkbox
                    iconSize={20}
                    disabled={disabledItem(it[fieldName])}
                    modelValue={checked.value.includes(it[fieldName])}
                  >
                    <View class="check-label-name">{it[labelName] || '-'}</View>
                  </Checkbox>
                </View>
              ))}
            </View>
            <View class="check-list-footer">
              <Button
                class="check-list-footer-btn"
                onClick={() => (show.value = false)}
              >
                取消
              </Button>
              <Button
                class="check-list-footer-btn"
                type="primary"
                onClick={handleConfirm}
              >
                确定
              </Button>
            </View>
          </Popup>
        </View>
      )
    }
  },
})
