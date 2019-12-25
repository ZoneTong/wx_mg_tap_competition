// import './js/libs/weapp-adapter'
// import './js/libs/symbol'

// import Main from './js/main'

// new Main()
const canvas = wx.createCanvas()
const context = canvas.getContext('2d') // 创建一个 2d context
context.fillStyle = '#1aad19' // 矩形颜色
// context.fillRect(canvas.width/2 - 50 , 0, 100, 100) // 矩形左上角顶点为(0, 0)，右下角顶点为(100, 100)

const { windowWidth, windowHeight } = wx.getSystemInfoSync()
function drawRect(x, y) {
  context.clearRect(0, 0, windowWidth, windowHeight)
  context.fillRect(x, y, 100, 100)
}

const rectX = canvas.width / 2 - 50
let rectY = 0
function startDrop(){
  var ticker = setInterval(function () {
    if (collision){
      clearInterval(ticker);
      return
    }
    context.clearRect(rectX, rectY, 101, 100);
    if (rectY == windowHeight){
      rectY=0;
    }
    context.fillRect(rectX, ++rectY, 100, 100);
    checkCrash()
  }, 16)
}
startDrop()

const image = wx.createImage();
const imgX = canvas.width / 2 - 50;
let imgY = windowHeight - 150;
image.onload = function () {
  context.drawImage(image, imgX, imgY,100,100)
}
image.src = 'images/hero.png';

let touchX = imgX
let touchY = imgY

wx.onTouchMove(function (res) {
  context.clearRect(touchX, touchY, 100, 100); // 清除画布上原有的飞机
  touchX = res.changedTouches[0].clientX // 重新判断当前触摸点x坐标
  touchY = res.changedTouches[0].clientY // 重新判断当前触摸点y坐标
  context.drawImage(image, touchX, touchY,100,100);
  checkCrash()
})

let collision = false
function checkCrash(){
  if (collision){
    return
  }
  if (touchX >= rectX - 100 && touchX <= rectX + 100 && touchY >= rectY - 100 && touchY <= rectY + 100) { // 飞机与矩形发生碰撞
    collision = true;
    wx.showModal({
      title: '提示',
      content: '发生碰撞，游戏结束！',
      success(res){
        if (res.confirm){

          context.clearRect(rectX, rectY, 101, 100);
          rectY = 0;
          startDrop();

          context.clearRect(touchX, touchY, 100, 100);
          context.drawImage(image, imgX, imgY, 100, 100);

          collision = false
          // touchY = 
        } else if (res.cancel){
          console.log('you lose')
        }
      }
    })
  }
}