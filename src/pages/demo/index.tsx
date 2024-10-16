import {
  Container,
  CascaderBox,
  CheckList,
  PickerBox,
  DatePickerBox,
  UploaderBox,
} from '@/components/index'
import { Button, Form, FormItem } from '@nutui/nutui-taro'
import { defineComponent, onMounted, ref } from 'vue'
import './inex.scss'

const defaultForm = {
  status: [],
  picker: [],
  date: '',
  cas: [],
  idCard: [],
}

export default defineComponent({
  name: 'xxx',
  setup() {
    type Form = {
      status: number[]
      picker: number[]
      date: string
      cas: string[]
      idCard: any[]
    }

    const form = ref<Form>(defaultForm)

    onMounted(() => {
      setTimeout(() => {
        form.value = {
          status: [4],
          picker: [2, 3],
          date: '2024-12-12',
          cas: ['浙江', '温州', '鹿城区'],
          idCard: [],
        }
      }, 2000)
    })

    const reset = () => {
      form.value = defaultForm
    }

    const submit = () => {
      console.info(form)
    }

    definePageConfig({
      navigationBarTitleText: '首页',
    })

    return () => {
      return (
        <Container class="pages-demo-index">
          <Form>
            <FormItem
              prop="status"
              label="车辆状态"
              required
              rules={[{ required: true, message: '请填写姓名' }]}
            >
              <CheckList
                v-model={form.value.status}
                containerClass="flex-end"
                placeholder="请选择"
                showArrowLeft
                data={[
                  { id: 1, name: 'xxx1' },
                  { id: 2, name: 'xxx2' },
                  { id: 3, name: 'xxx3' },
                  { id: 4, name: 'xxx4' },
                ]}
              ></CheckList>
            </FormItem>

            <FormItem
              prop="picker"
              label="承运商"
              required
              rules={[{ required: true, message: '请填写承运商' }]}
            >
              <PickerBox
                v-model={form.value.picker}
                container-class="flex-end"
                placeholder="请选择"
                show-arrow-left
                columns={[
                  [
                    { id: 1, name: 'xxx1' },
                    { id: 2, name: 'xxx2' },
                    { id: 3, name: 'xxx3' },
                    { id: 4, name: 'xxx4' },
                  ],
                  [
                    { id: 1, name: 'AA1' },
                    { id: 2, name: 'AA2' },
                    { id: 3, name: 'AA3' },
                    { id: 4, name: 'AA4' },
                  ],
                ]}
              ></PickerBox>
            </FormItem>

            <FormItem prop="date" label="创建时间" required>
              <DatePickerBox
                type="year-month"
                v-model={form.value.date}
                show-arrow-left
                container-class="flex-end"
                placeholder="请选择"
              ></DatePickerBox>
            </FormItem>

            <FormItem prop="cas" label="级联数据" required>
              <CascaderBox
                v-model={form.value.cas}
                show-arrow-left
                container-class="flex-end"
                placeholder="请选择"
                options={[
                  {
                    value: '浙江',
                    text: '浙江',
                    children: [
                      {
                        value: '杭州',
                        text: '杭州',
                        disabled: true,
                        children: [
                          { value: '西湖区', text: '西湖区' },
                          { value: '余杭区', text: '余杭区' },
                        ],
                      },
                      {
                        value: '温州',
                        text: '温州',
                        children: [
                          { value: '鹿城区', text: '鹿城区' },
                          { value: '瓯海区', text: '瓯海区' },
                        ],
                      },
                    ],
                  },
                ]}
              ></CascaderBox>
            </FormItem>

            <FormItem prop="idCard" label="身份证" required>
              <UploaderBox
                container-class="flex-end"
                v-model:fileList={form.value.idCard}
              />
            </FormItem>
          </Form>

          <Button type="primary" block onClick={submit}>
            提交
          </Button>
          <Button block onClick={reset}>
            重置
          </Button>
        </Container>
      )
    }
  },
})
