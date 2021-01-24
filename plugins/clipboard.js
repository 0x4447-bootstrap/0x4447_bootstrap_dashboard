import Vue from 'vue'

function copyToClipboard (text) {
  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)

  textarea.value = text
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

Vue.use({
  install (_Vue) {
    _Vue.prototype.$copyToClipboard = copyToClipboard
  }
})
