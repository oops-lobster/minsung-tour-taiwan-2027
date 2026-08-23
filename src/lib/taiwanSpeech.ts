export const isSpeechSynthesisSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window

export function getPreferredTaiwanVoice() {
  if (!isSpeechSynthesisSupported()) return null
  const voices = window.speechSynthesis.getVoices()
  return voices.find((voice) => voice.lang.toLowerCase() === 'zh-tw')
    ?? voices.find((voice) => /taiwan|traditional|zh-hant/i.test(`${voice.name} ${voice.lang}`))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'))
    ?? null
}

export function speakTaiwan(text: string, rate = 0.75) {
  return new Promise<void>((resolve, reject) => {
    if (!isSpeechSynthesisSupported()) {
      reject(new Error('speech_not_supported'))
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = getPreferredTaiwanVoice()?.lang ?? 'zh-TW'
    utterance.voice = getPreferredTaiwanVoice()
    utterance.rate = rate
    utterance.pitch = 1
    utterance.onend = () => resolve()
    utterance.onerror = () => reject(new Error('speech_failed'))
    window.speechSynthesis.speak(utterance)
  })
}

export function stopTaiwanSpeech() {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
