require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//ES6中新增let命令，用法类似var,但是所申明的变量，只在let命令所在的代码块内有效
//let yeomanImage = require('../images/yeoman.png');

//获取图片相关的数据，经测试能取得数据
let imageDates = require('json-loader!../data/imageDate.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDates = (function getimageurl(imagedataArr) {
  for(var i = 0,j = imagedataArr.length;i < j;i++){

    var singleImageData = imagedataArr[i];
    singleImageData.imageURl = require('../images/'+ singleImageData.fileName);

    // alert(singleImageData.imageURl);
    imagedataArr[i] = singleImageData;
  }

  return imagedataArr;
})(imageDates);

//imageDates = getimageurl(imageDates);

//获取区间内的一个随机值

var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
//获取0-30°之间一个任意正负值
var get30DegRandom = () => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
};

class ImgFigure extends React.Component {
  render(){
    var styleObj = {};
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return(
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURl}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>

    );
  }

}

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.Constant = {
      centerPos:{
        left: 0,
        top: 0
      },
      hPosRange:{  //水平方向的取值范围
        leftSexX: [0,0],
        rightSexX: [0,0],
        y: [0,0]

      },
      vPosRange:{   //垂直方向的取之范围
        x: [0,0],
        topY: [0,0]
      }
    };
    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false //正反面
        //isCenter:false 图片是否居中
        //}
      ]


    };

  }

  /*
  *
  * 在取值范围内重新布局所有的图片
  * @param centerIndex 指定居中排布哪个图片
  *
  * */
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSexX,
      hPosRangeRightSecX = hPosRange.rightSexX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

      imgsArrangeTopArr = [],//用来存储布局在上侧区域的图片的状态信息
      topImgNum = Math.ceil(Math.random() * 2), //取一个或者不取[0,2)
      topImgSpiceIndex = 0,//用来标记布局在上侧区域的这张图片是从数组对象的哪个位置拿出来的
      //splice() 方法向/从数组中添加/删除项目们，然后返回被删除的项目们。
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);//用来存放居中图片的状态信息

    //首先居中centerIndex的图片
    // imgsArrangeCenterArr[0] = {
    //   pos: centerPos,
    //   rotate: 0,
    //   isCenter: true
    // }

    imgsArrangeCenterArr[0].pos = centerPos;
    //取出要布局上侧的图片的状态信息
    //alert(imgsArrangeArr.length);//15
    // 为什么要减topImgNum？从索引位置往后取，防止取到topImgSpiceIndex=14位置上越界
    topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));//会不会取到第1张图片呢？不会，在居中位置时已经将该图片剔除掉了
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false

      };
    });
    //布局左两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i].pos = {

        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])


      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });


  };
  //组件加载以后，为每张图片计算其位置的范围(初始化)
  componentDidMount() {
    //首先拿到舞台的大小
    var  stageDom = ReactDOM.findDOMNode(this.refs.stage),
         stageW = stageDom.scrollWidth,
         stageH = stageDom.scrollHeight,
         halfStageW = Math.ceil(stageW / 2),
         halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),//化整
        halfImgH = Math.ceil(imgH / 2);


      //计算中心点的值
      this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      }
      //计算左分区,右分区图片的位置
      this.Constant.hPosRange.leftSexX[0] = -halfImgW;
      this.Constant.hPosRange.leftSexX[1] = halfStageW - halfImgW*3;

      this.Constant.hPosRange.rightSexX[0] = halfStageW + halfImgW;
      this.Constant.hPosRange.rightSexX[1] = stageW - halfImgW;

      this.Constant.hPosRange.y[0] = -halfImgH;
      this.Constant.hPosRange.y[1] = stageH - halfImgH;


      //计算上测区域图片排布的取值范围
      this.Constant.vPosRange.topY[0] = -halfImgH;
      this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

      this.Constant.vPosRange.x[0] = halfStageW - imgW;
      this.Constant.vPosRange.x[1] = halfStageW;
     // let num = Math.floor(Math.random() * 10);
      this.rearrange(0);
      // this. (0);
     //this.rearrange(num)
  };


  render() {

    var controllerUnits = [];
    var imgFigures = [];
    imageDates.forEach(function(value, index) {
      //初始化，将所有的图片定位在左上角
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index}
                                 arrange={this.state.imgsArrangeArr[index]}
      />);

    }.bind(this));//将imgsArrangeArr数组中每一个状态对象与imageDates中每一个真是图片的索引对应起来
    return(

      <section className="stage" ref="stage" >

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

AppComponent.defaultProps = {
};


export default AppComponent;

