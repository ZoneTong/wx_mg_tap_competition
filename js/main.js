
import GameInfo   from './runtime/gameinfo'
import Music from './runtime/music'
let ctx   = canvas.getContext('2d')
let databus = {
  gameOver: false,
  score: 0,
  frame: 0,
}
const TOUCH_INTERVAL = 100; // 避免同时多手指作弊,多手指也要有间隔的连弹才行
const TOUCH_STEP = 20;

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId    = 0

    this.Divider = canvas.height/2
    this.image = wx.createImage();
    this.image.src = 'images/eyes.png';

    this.diamond = wx.createImage();
    this.diamond.src = 'images/diamond_origin.png';
    this.diamond_float = 0;
    this.diamond_direction = true;

    this.music = new Music()
    this.gameinfo = new GameInfo()
    
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

    this.playing = false;
    this.enemyLastTouchTime = 0;
    this.playerLastTouchTime = 0;

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
      if (!this.playing){
        this.playing = true;
        return
      }
      
      let touchY = res.changedTouches[0].clientY // 重新判断当前触摸点y坐标
      const edge = 60;
      let step = TOUCH_STEP;
      if (this.distanceLitttThanEdge(edge * 3)){
        step /= 2;
      }

      let now = (new Date()).getTime();// 真机上才是微秒。仿真器毫秒
      console.log('touch height:',touchY,', time:', now)
      if (touchY < this.Divider ){
        if (now - this.enemyLastTouchTime < TOUCH_INTERVAL){
          console.log('enemy too quick', now - this.enemyLastTouchTime)
          // return
        }
        this.enemyLastTouchTime = now;
        this.enemyHeight += step;
        this.music.playDong()
      }else if(touchY > this.Divider){
        if (now - this.playerLastTouchTime < TOUCH_INTERVAL){
          console.log('player too quick', now - this.playerLastTouchTime)
          // return
        }
        this.playerLastTouchTime = now;
        this.enemyHeight -= step;
        this.music.playTa()
      }
      

      if (this.distanceLitttThanEdge(edge) ){
        databus.gameOver = true;
        if ( this.enemyHeight < this.Divider){
          databus.score = '蓝方胜利'
        } else {
          databus.score = '橙方胜利'
        }
      }
  }

  distanceLitttThanEdge(edge){
    return this.enemyHeight < edge || this.enemyHeight > canvas.height - edge
  }

  drawBackgroud(){
    let p_gradient  =  ctx.createLinearGradient(0, 0, 0, canvas.height);   //创建一个线性渐变
    p_gradient.addColorStop(0,"#ffcf6f");
    p_gradient.addColorStop(this.enemyHeight/canvas.height-0.01 ,"lightyellow");
    p_gradient.addColorStop(this.enemyHeight/canvas.height ,"black");
    p_gradient.addColorStop(this.enemyHeight/canvas.height+0.01 ,"lightblue");
    p_gradient.addColorStop(1,"#4d90fe");
    ctx.fillStyle = p_gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawPlayer() {
    let h = canvas.height-this.enemyHeight;
    ctx.drawImage(this.image, 0, this.enemyHeight, canvas.width ,h);
  }

  drawEmeny() {
    ctx.save()
    ctx.rotate(Math.PI)
    ctx.translate(-canvas.width, -this.enemyHeight);
    ctx.drawImage(this.image, 0, 0, canvas.width,this.enemyHeight);
    ctx.restore()
  }

  drawDiamond(){
    if (!this.playing){
      this.gameinfo.renderGameBefore(ctx)
    }
    const size = 64;
    if (this.diamond_direction){
      this.diamond_float++;
      if (this.diamond_float > 8){
        this.diamond_direction = false;
      }
    } else {
      this.diamond_float--;
      if (this.diamond_float < -8){
        this.diamond_direction = true;
      }
    }
    ctx.drawImage(this.diamond, (canvas.width-size)/2, this.Divider-size/2+this.diamond_float/4, size, size);
    // console.log("diamond")
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
    // this.gameinfo.renderGameScore(ctx, databus.score)
    this.drawBackgroud()
    this.drawPlayer()
    this.drawEmeny()
    this.drawDiamond()

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