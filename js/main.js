
import GameInfo   from './runtime/gameinfo'
let ctx   = canvas.getContext('2d')
let databus = {
  gameOver: false,
  score: 0,
  frame: 0,
}

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0

    this.Divider = canvas.height/2
    this.enemyHeight = this.Divider;
    this.image = wx.createImage();
    this.image.src = 'images/eyes.png';

    this.restart()
  }

  restart() {
    databus = {
      gameOver: false,
      score: 0,
      frame: 0,
    }
  
    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.playHandler =  this.play.bind(this);
    canvas.addEventListener('touchstart',this.playHandler)

    this.enemyHeight = this.Divider;
    this.gameinfo = new GameInfo()

    this.bindLoop     = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);


    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  play(res) {
    // wx.onTouchStart(function (res) {
      let touchY = res.changedTouches[0].clientY // 重新判断当前触摸点y坐标
      const edge = 50;
      let step = 24;
      if (this.distanceLitttThanEdge(edge * 3)){
        step /= 2;
      }

      if (touchY < this.Divider ){
        this.enemyHeight += step;
      }else if(touchY > this.Divider){
        this.enemyHeight -= step;
      }

      if (this.distanceLitttThanEdge(edge) ){
        databus.gameOver = true;
      }
      console.log('touch',this.enemyHeight)
  }

  distanceLitttThanEdge(edge){
    return this.enemyHeight < edge || this.enemyHeight > canvas.height - edge
  }

  drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, this.enemyHeight, canvas.width ,canvas.height-this.enemyHeight);
    ctx.drawImage(this.image, 0, this.enemyHeight, canvas.width ,canvas.height-this.enemyHeight);
  }

  drawEmeny() {
    ctx.save()
    ctx.rotate(Math.PI)
    ctx.translate(-canvas.width, -this.enemyHeight);
    ctx.fillStyle = 'orange';
    ctx.fillRect(0, 0, canvas.width,this.enemyHeight);
    ctx.drawImage(this.image, 0, 0, canvas.width,this.enemyHeight);
    ctx.restore()
  }


  // 全局碰撞检测
  collisionDetection() {
    let that = this
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()

   let x = e.touches[0].clientX
   let y = e.touches[0].clientY

   let area = this.gameinfo.btnArea

   if (   x >= area.startX
       && x <= area.endX
       && y >= area.startY
       && y <= area.endY  )
     this.restart()
 }

  /**
    * canvas重绘函数
    * 每一帧重新绘制所有的需要展示的元素
    */
  render() {
    // console.log('render')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.gameinfo.renderGameScore(ctx, databus.score)
    this.drawPlayer()
    this.drawEmeny()

    // 游戏结束停止帧循环
    if ( databus.gameOver ) {
      this.gameinfo.renderGameOver(ctx, databus.score)
      canvas.removeEventListener(
        'touchstart',
        this.playHandler
      )

      if ( !this.hasEventBind ) {
        this.hasEventBind = true
        this.touchHandler = this.touchEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchHandler)
      }
    }
  }

  // 游戏逻辑更新主函数
  update() {
    if ( databus.gameOver )
      return;

    this.collisionDetection()

    if ( databus.frame % 20 === 0 ) {
      
    }
  }
  
  // 实现游戏帧循环
  loop() {
    databus.frame++
    // console.log(databus.frame)

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}