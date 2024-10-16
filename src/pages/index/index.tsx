import { Container } from '@/components/index'
import { View } from '@tarojs/components'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'xxx',
  setup() {
    return () => {
      return (
        <Container class="pages-home-index">
          <View>home</View>
        </Container>
      )
    }
  },
})
