let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    // this.bgmAudio = new Audio()
    // this.bgmAudio.loop = true
    // this.bgmAudio.src  = 'audio/bgm.mp3'

    this.dongAudio     = new Audio()
    this.dongAudio.src = 'audio/dong.mp3'

    this.taAudio     = new Audio()
    this.taAudio.src = 'audio/ta.mp3'

    // this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playDong() {
    this.dongAudio.currentTime = 0
    this.dongAudio.play()
  }

  playTa() {
    this.taAudio.currentTime = 0
    this.taAudio.play()
  }
}
