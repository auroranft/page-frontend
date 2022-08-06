export default defineNuxtPlugin((/*nuxtApp*/) => {
  return {
    provide: {
      // 格式化时间戳
      parseTime: (time: any, cFormat?: string) => {
        if (!time) {
          return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
          date = time
        } else {
          if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
          }
          if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
          }
          date = new Date(time)
        }
        const formatObj = {
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
          h: date.getHours(),
          i: date.getMinutes(),
          s: date.getSeconds(),
          a: date.getDay()
        }
        const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
          const value = formatObj[key]
          // Note: getDay() returns 0 on Sunday
          if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
          return value.toString().padStart(2, '0')
        })
        return time_str;
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
