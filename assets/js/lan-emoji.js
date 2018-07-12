var emoji = function(option) {
  this.option = option
  this.placeholder = option.placeholder
  let target = false

  const size = Object.keys(option.icons[0].alias).length
  let dom = ''

  for (i = 1; i < size; i++) {
    dom += `
      <div class="emoji_content" data-emoji_code="${option.icons[0].alias[i]}">
        <img src="assets/img/tieba/${i}.jpg" class="mCS_img_loaded">
      </div>
      `
  }
  const _emoji = document.getElementById('emoji')

  _emoji.classList.add('box-close')
  _emoji.innerHTML = dom

  const _emoji_content = document.getElementsByClassName('emoji_content')
  const _emoji_button = document.getElementById(this.option.btn)

  for (let i = 0; i < _emoji_content.length; i++) {
    _emoji_content[i].addEventListener(
      'click',
      function() {
        const emoji_code = this.dataset.emoji_code
        _insertAtCursor(emoji_code, option)
      },
      false
    )
  }

  _emoji_button.addEventListener(
    'click',
    function() {
      target = !target
      if (target) {
        _emoji.classList.remove('box-close')
        _emoji.classList.add('box-open')
      } else {
        _emoji.classList.remove('box-open')
        _emoji.classList.add('box-close')
      }
    },
    false
  )

  _insertAtCursor = function(emoji_code, option) {
    const editor = option.editor
    const alias = option.icons[0].alias
    const key = Object.keys(alias).find(key => alias[key] === emoji_code)
    const source = `<img src="assets/img/tieba/${key}.jpg" class="editor_img">`

    document.getElementById(editor).focus()
    var selection = window.getSelection
      ? window.getSelection()
      : document.selection
    var range = selection.createRange
      ? selection.createRange()
      : selection.getRangeAt(0)
    if (!window.getSelection) {
      var selection = window.getSelection
        ? window.getSelection()
        : document.selection
      var range = selection.createRange
        ? selection.createRange()
        : selection.getRangeAt(0)
      range.pasteHTML(source)
      range.collapse(false)
      range.select()
    } else {
      range.collapse(false)
      var hasR = range.createContextualFragment(source)
      var hasR_lastChild = hasR.lastChild
      while (
        hasR_lastChild &&
        hasR_lastChild.nodeName.toLowerCase() == 'br' &&
        hasR_lastChild.previousSibling &&
        hasR_lastChild.previousSibling.nodeName.toLowerCase() == 'br'
      ) {
        var e = hasR_lastChild
        hasR_lastChild = hasR_lastChild.previousSibling
        hasR.removeChild(e)
      }
      range.insertNode(hasR)
      if (hasR_lastChild) {
        range.setEndAfter(hasR_lastChild)
        range.setStartAfter(hasR_lastChild)
      }
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

emoji.prototype.emojiParse = function(dom) {
  const alias = this.option.icons[0].alias
  const placeholder = this.placeholder
  let revertAlias = {}

  for (var attr in alias) {
    if (alias.hasOwnProperty(attr)) {
      revertAlias[alias[attr]] = attr
    }
  }
  
  for (let index = 0; index < dom.length; index++) {
    const innerHTML = dom[index].innerHTML
    const replace = innerHTML.replace(/:([\s\S]+?):/g, function($0, $1) {
      var n = revertAlias[$1]
      if (n) {
        return `<img src="assets/img/tieba/${n}.jpg" class="editor_img">`
      } else {
        return $0
      }
    })
    dom[index].innerHTML = replace
  }
}

emoji.prototype.emojiChange = function() {
  const alias = this.option.icons[0].alias
  const emojiImage = document.querySelectorAll('.editor_img')

  for (let index = 0; index < emojiImage.length; index++) {
    const fullUri = emojiImage[index].src
    const filename = fullUri.replace(/^.*?([^\/]+)\..+?$/, '$1')
    const name = alias[filename]
    emojiImage[index].outerHTML = `:${name}:`
  }
}
