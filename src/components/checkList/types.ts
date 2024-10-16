import { PropType } from 'vue'

type OnChange = (
  e: Array<string | number>,
  d: Array<Record<string, any>>,
) => void

type SearchData = (keyWord: string) => Promise<Array<Record<string, any>>>

export type CheckListEmits = {
  onChange: [{ detail: Array<string | number> }, Array<Record<string, any>>]
  searchData: [string]
}

export const CheckListProps = {
  containerClass: {
    type: String,
    default: '',
    required: false,
  },
  placeholder: {
    type: String,
    default: '选择提示和弹窗标题',
    required: false,
  },
  placeholderColor: {
    type: String,
    default: '选择提示的颜色',
    required: false,
  },
  searchPlaceholder: {
    type: String,
    default: '搜索过滤的提示',
    required: false,
  },
  data: {
    type: Array<Object>,
    default: [],
    required: false,
  },
  modelValue: {
    type: Array<Number | String>,
    default: [],
    required: false,
  },
  checkAll: {
    type: Boolean,
    default: false,
    required: false,
  },
  onChange: {
    type: Function as PropType<OnChange>,
    default: undefined,
    required: false,
  },
  limit: {
    type: Number,
    default: Infinity,
    required: false,
  },
  labelName: {
    type: String,
    default: 'name',
    required: false,
  },
  fieldName: {
    type: String,
    default: 'id',
    required: false,
  },
  bodyHeight: {
    type: String,
    default: '40vh',
    required: false,
  },
  showArrowDown: {
    type: Boolean,
    default: false,
    required: false,
  },
  showArrowLeft: {
    type: Boolean,
    default: false,
    required: false,
  },
  searchShow: {
    type: Boolean,
    default: true,
    required: false,
  },
  searchLoading: {
    type: Boolean,
    default: false,
    required: false,
  },
  allowClear: {
    type: Boolean,
    default: true,
    required: false,
  },
  searchData: {
    type: Function as PropType<SearchData>,
    default: undefined,
    required: false,
  },
}
