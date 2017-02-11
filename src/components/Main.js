require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';


//Read images
var imageData = require('../data/image-data.json');
imageData =(function genImageUrl(imageData){
  imageData.forEach(function(item){
    item.imageUrl = require('../images/'+item.fileName);
    console.log(item.imageUrl);
  });
  return imageData;
})(imageData);

/*
 * 获取区间内随机值
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/*
* 获取旋转角度的范围
*/
function getDegRandom(){
  let baseDeg = 30;
  return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*baseDeg);
}



class ImageFig extends React.Component{
  render(){
    return(
      <figure className="img-figure">
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        imgArrangeArr: [
          /*
          {
            pos: {
              left: 0,
              right: 0
            },
            rotate: 0,
            isInverse: false //图片正反面
          },
          isCenter:false //图片默认不居中
          */
      ]
      };

      this.Constant = { //常量的key ？
        centerPos: {
          left: 0,
          right: 0
        },
        hPosRange: { //水平方向取值范围
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: { //垂直方向取值范围
          x: [0, 0],
          topY: [0, 0]
        }
      }
    }

  componentDidMount(){
      var stageDOM = React.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth, //scrollWidth, clientwidth, offsetwidth
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

      var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW/2),
      halfImgH = Math.ceil(imgH/2);

      this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      }

      this.Constant.hPosRange.leftSecX[0] = -halfImgW;
      this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
      this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
      this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;

      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH*3;
      this.Constant.vPosRange.x[0] = halfStageW - halfImgW;
      this.Constant.vPosRange.x[1] = halfImgW;

      this.rearrange(0);
  }

  /*
     * 重新布局图片，传入居中的index
     */
rearrange(centerIndex) {
      var imgArrangeArr = this.state.imgArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        //上侧图片的数值，可有可无。0或者1
        topImgNum = Math.floor(Math.random() * 2),
        //上侧图片是从哪个位置拿出来的
        topImgSpliceIndex = 0,
        //中心图片的状态信息
        imgsArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
      //居中 centerIndex
      imgsArrangeCenterArr[0] ={
        pos: centerPos,
        rotate : 0,
        isCenter: true
      }

      //取出要布局上侧图片的状态信息
      topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
      imgsArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

      //布局上侧图片
      imgsArrangeTopArr.forEach(function(value,index){
        imgsArrangeTopArr[index] = {
          pos :{
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate:getDegRandom(),
          isCenter: false
        }
      });

      //布局左右两侧的图片
      for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
        var hPosRangeLORX = null; //左区域或者右区域的取值范围

        //前半部分布局左边，右半部分布局右边
        if (i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }
        imgArrangeArr[i] ={
          pos : {
            top: getRangeRandom(hPosRange.y[0], hPosRange.y[1]),
            left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate:getDegRandom(),
          isCenter:false
        };
      }

      //把取出来的图片放回去
      if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
      }
      imgArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
      this.setState({
        imgArrangeArr: imgArrangeArr
      });
    }

  render() {
    var controllerUnits = [];
    var imgFigures = [];
    imageData.forEach(function(value,index){
        if (!this.state.imgsArrangeArr[index]) {
          this.state.imgsArrangeArr[index] = {pos:{left:0,top:0}};
        }
        imgFigures.push(<ImageFig data={value} ref={'imgFigure'+index}  arrange={this.state.imgArrangeArr[index]}/>);
      }.bind(this));


    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {}

export default AppComponent;
