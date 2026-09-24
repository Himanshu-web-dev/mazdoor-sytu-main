// Google Website Translator utility for Mazdoor Sytu
// Ensures seamless, full-page dynamic translation across all 16 Indian languages

export const GOOGLE_LANG_MAP = {
  en: 'en',
  hi: 'hi',
  bho: 'bho',
  pa: 'pa',
  hr: 'hi', // Haryanvi maps to Hindi in Google Translate
  bn: 'bn',
  mr: 'mr',
  gu: 'gu',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  ml: 'ml',
  or: 'or',
  as: 'as',
  mai: 'mai',
  ur: 'ur',
}

function clearGoogleCookies() {
  const host = window.location.hostname
  const domains = [host, `.${host}`, '']
  const paths = ['/', window.location.pathname]

  domains.forEach((d) => {
    paths.forEach((p) => {
      const domPart = d ? `; domain=${d}` : ''
      const pathPart = p ? `; path=${p}` : '; path=/'
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC${domPart}${pathPart}`
    })
  })
}

export function setGoogleTransCookie(targetLang) {
  if (!targetLang || targetLang === 'en') {
    clearGoogleCookies()
    document.cookie = 'googtrans=/en/en; path=/'
    return
  }
  document.cookie = `googtrans=/en/${targetLang}; path=/`
  const host = window.location.hostname
  if (host && host !== 'localhost') {
    document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${host}`
  }
}

export function setGoogleTranslateLanguage(langCode) {
  const target = GOOGLE_LANG_MAP[langCode] || langCode || 'en'
  setGoogleTransCookie(target)

  if (target === 'en') {
    const wasTranslated =
      document.querySelector('font') ||
      document.documentElement.classList.contains('translated-ltr') ||
      document.documentElement.classList.contains('translated-rtl') ||
      localStorage.getItem('mazdoor_language') !== 'en'

    const combo = document.querySelector('.goog-te-combo')
    if (combo) {
      combo.value = ''
      combo.dispatchEvent(new Event('change'))
    }

    if (wasTranslated) {
      setTimeout(() => {
        window.location.reload()
      }, 50)
      return
    }
    return
  }

  const applyToCombo = () => {
    const combo = document.querySelector('.goog-te-combo')
    if (combo) {
      combo.value = target
      combo.dispatchEvent(new Event('change'))
      return true
    }
    return false
  }

  // Attempt immediately
  if (!applyToCombo()) {
    // If Google script is still initializing, retry with backoff
    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      if (applyToCombo() || attempts > 25) {
        clearInterval(interval)
      }
    }, 150)
  }
}
