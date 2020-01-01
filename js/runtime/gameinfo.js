const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      score,
      10,
      30
    )
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '结果: ' + score,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }

  renderGameBefore(ctx){
    ctx.drawImage(atlas, 270, 125, 114, 85, screenWidth / 2 - 150, screenHeight / 2 - 150, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

    ctx.fillText(
      '故事背景',
      screenWidth / 2 - 40,
      screenHeight / 2 - 150 + 50
    )
    ctx.fillText(
      '有一天，阿黄和阿蓝在路',
      screenWidth / 2 - 150 + 60,
      screenHeight / 2 - 150 + 90
    )
    ctx.fillText(
      '上偶然相遇。他们同时发现了',
      screenWidth / 2 - 150 + 20,
      screenHeight / 2 - 150 + 120
    )
    ctx.fillText(
      '地上的一块宝石，争夺之战由',
      screenWidth / 2 - 150 + 20,
      screenHeight / 2 - 150 + 150
    )
    ctx.fillText(
      '此开始...',
      screenWidth / 2 - 150 + 20,
      screenHeight / 2 - 150 + 180
    )

    ctx.fillStyle = "gold"
    ctx.fillText(
      '游戏方法：双方以宝石为界，',
      screenWidth / 2 - 150 + 20,
      screenHeight / 2 - 150 + 215
    )
    ctx.fillText(
      '各自点击半个屏幕，手速快的',
      screenWidth / 2 - 150 + 20,
      screenHeight / 2 - 150 + 245
    )
    ctx.fillText(
      '获胜',
      screenWidth / 2 - 150 + 20,
      screenHeight / 2 - 150 + 275
    )
  }
}

