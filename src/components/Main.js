require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//ES6中新增let命令，用法类似var,但是所申明的变量，只在let命令所在的代码块内有效
let yeomanImage = require('../images/yeoman.png');
//获取图片相关的数据
let imageDates = require('../data/imageDate.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDates = (function getimageurl(imagedataArr) {
  for(var i = 0,j = imagedataArr.length;i < j;i++){

    var singleImageData = imagedataArr[i];
    singleImageData.imageURl = require('../images/'+singleImageData.fileName);

    imagedataArr[i] = singleImageData;
  }

  return imagedataArr;
})(imageDates);

//imageDates = getimageurl(imageDates);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">

        <section className="img-sec">

        </section>
        <nav className="controller-nav">

        </nav>

      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
