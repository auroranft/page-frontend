import Clipboard from 'clipboard'

export default defineNuxtPlugin((/*nuxtApp*/) => {
  return {
    provide: {
      // 字符串截取
      truncateAccount: (text: string, beginLength = 5, endLength = 4, suffix = '...') => {
        text = text.toLowerCase();
        let atLeastLength = beginLength + endLength;
        if (text.length > atLeastLength) {
          return text.substring(0, beginLength) + suffix + text.substring(text.length - endLength, text.length);
        } else {
          return text;
        }
      },
      // 复制
      clip: (text: any, event: any) => {
        const clipResult = useClipResult();
        const clipboard = new Clipboard(event.target, {
          action: () => 'copy',
          text: () => text
        });
        clipboard.on('success', () => {
          clipboard.destroy();
          clipResult.value = true;
          setTimeout(() => {
            clipResult.value = false;
          }, 3000);
        });
        clipboard.on('error', () => {
          clipboard.destroy();
        });
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
