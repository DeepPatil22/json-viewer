import React from 'react'
import ReactDOM from 'react-dom'
import Options from './options'

export function render(headers: any) {
  const el = document.body.children[0]

  // Save button click event
  window.addEventListener('contentMessage', (event) => {
    const e = event as CustomEvent
    console.log('contentMessage', e.detail)
    switch (e.detail.type) {
      case 'save':
        const link = document.createElement('a')
        link.href = e.detail.value || ''

        // /a -> a.json
        // /a.json -> a.json
        // /a.txt -> a.txt.json
        // / -> download
        let filename = location.href.split('/').slice(-1)[0] || 'download'
        if (!/\.json$/.test(filename)) {
          filename += '.json'
        }

        link.download = filename
        link.click()
    }
  })

  const JSONView = {
    json: new Text(el.innerHTML),
    Locale: require('devtools/client/locales/en-US/jsonview.properties'),
    headers,
  }
  console.log('JSONView', JSONView)
  ;(window as any).JSONView = JSONView

  // Set <html> attributes
  let os: string
  if (navigator.platform.startsWith('Win')) {
    os = 'win'
  } else if (navigator.platform.startsWith('Mac')) {
    os = 'mac'
  } else {
    os = 'linux'
  }
  document.documentElement.setAttribute('platform', os)
  // TODO: Set dir to ltr or rtl by browser default locale
  // document.documentElement.setAttribute('dir', 'ltr')
  // setTheme(theme)

  document.body.innerHTML = '<div id="content"></div><div id="options"></div>'

  // Inject CSS
  require('devtools/client/jsonview/css/main.css')

  // Render JSONView component
  require('devtools/client/jsonview/json-viewer')

  // Render options
  ReactDOM.render(<Options />, document.getElementById('options'))
}
