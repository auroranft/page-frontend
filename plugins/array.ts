export default defineNuxtPlugin((/*nuxtApp*/) => {
  return {
    provide: {
      // 数值排序
      compare: (property: string | number) => {
        return function(a: any, b: any) {
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        };
      },
    }
  }
})




// import Vue from 'vue'

// function clipboardSuccess() {
//   Vue.prototype.$message({
//     message: '复制成功',
//     type: 'success',
//     duration: 1500
//   })
// }

// function clipboardError() {
//   Vue.prototype.$message({
//     message: '复制失败',
//     type: 'error'
//   })
// }

// export default function handleClipboard(text, event) {
//   const clipboard = new Clipboard(event.target, {
//     text: () => text
//   })
//   clipboard.on('success', () => {
//     clipboardSuccess()
//     clipboard.destroy()
//   })
//   clipboard.on('error', () => {
//     clipboardError()
//     clipboard.destroy()
//   })
//   clipboard.onClick(event)
// }
