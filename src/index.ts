/* 测试3 */
interface waterMarkP {
  load?: Function /** 加载的函数 */
  remove?: Function /** 移除的函数 */
}

const waterMark: waterMarkP = {}
//初始项
var defaultSettings = {
  watermark_id: 'waterMark-wrap',          //水印总体的id
  watermark_prefix: 'waterMark-item',    //小水印的id前缀
  watermark_txt: "yycx",             //水印的内容
  watermark_x: 20,                     //水印起始位置x轴坐标
  watermark_y: 20,                     //水印起始位置Y轴坐标
  watermark_rows: 0,                   //水印行数
  watermark_cols: 0,                   //水印列数
  watermark_x_space: 50,              //水印x轴间隔
  watermark_y_space: 50,               //水印y轴间隔
  watermark_font: '微软雅黑',           //水印字体
  watermark_color: '#333',            //水印字体颜色
  watermark_fontsize: '18px',          //水印字体大小
  watermark_alpha: 0.15,               //水印透明度，要求设置在大于等于0.005
  watermark_width: 100,                //水印宽度
  watermark_height: 100,               //水印长度
  watermark_angle: 15,                 //水印倾斜度数
  watermark_parent_width: 0,      //水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
  watermark_parent_height: 0,     //水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
  watermark_parent_node: null,     //水印插件挂载的父元素element,不输入则默认挂在body上
};

//加载mark
const loadMark = (setting) => {
  //如果外层传递的进来的有设置了属性就替换掉当前的初始化的选项
  const src = setting || {};
  for (const key in src) {
    if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) continue;
    /*veronic: resolution of watermark_angle=0 not in force*/
    else if (src[key] || src[key] === 0) defaultSettings[key] = src[key];
  }
  // 当且仅当元素存在的时候 才会执行
  // 如果元素存在则移除
  const watermark_element = document.getElementById(defaultSettings.watermark_id);
  watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element);


  // 获取挂载的父元素节点
  const watermark_parent_element = document.getElementById(defaultSettings.watermark_parent_node);
  const watermark_wrapper_element = watermark_parent_element ? watermark_parent_element : document.body;

  //获取页面的宽度
  const page_width = Math.max(watermark_wrapper_element.scrollWidth, watermark_wrapper_element.clientWidth);

  // 获取页面的高度
  const page_height = Math.max(watermark_wrapper_element.scrollHeight, watermark_wrapper_element.clientHeight);

  let page_offsetTop = 0;
  let page_offsetLeft = 0;

  const currentSetting = setting || {}
  //如果传递进来的外部有声明了水印的总体宽度和总体高度 
  // 就要计算好父元素的偏移量
  // 偏移的x轴 和y轴
  if (currentSetting.watermark_parent_width || currentSetting.watermark_parent_height) {
    if (watermark_wrapper_element) {
      page_offsetTop = watermark_wrapper_element.offsetTop || 0;
      page_offsetLeft = watermark_wrapper_element.offsetLeft || 0;
      defaultSettings.watermark_x = defaultSettings.watermark_x + page_offsetLeft;
      defaultSettings.watermark_y = defaultSettings.watermark_y + page_offsetTop;
    }
  } else {
    //如果没有的话就直接取当前元素的偏移量
    if (watermark_wrapper_element) {
      page_offsetTop = watermark_wrapper_element.offsetTop || 0;
      page_offsetLeft = watermark_wrapper_element.offsetLeft || 0;
    }
  }

  let wapperEl = document.getElementById(defaultSettings.watermark_id);
  let shadowRoot = null
  if (!wapperEl) {
    wapperEl = document.createElement('div')
    wapperEl.id = defaultSettings.watermark_id
    //不引起加载的消耗直接写成内联样式
    wapperEl.setAttribute('style', 'pointer-events: none !important; display: block !important');
    //是否支持attachShadow
    if (typeof wapperEl.attachShadow === 'function') {
      shadowRoot = wapperEl.attachShadow({ mode: 'open' })
    } else {
      shadowRoot = wapperEl
    }
    var nodeList = watermark_wrapper_element.children;
    var index = Math.floor(Math.random() * (nodeList.length - 1));
    if (nodeList[index]) {
      watermark_wrapper_element.insertBefore(wapperEl, nodeList[index]);
    } else {
      watermark_wrapper_element.appendChild(wapperEl);
    }
  } else if (wapperEl.shadowRoot) {
    shadowRoot = wapperEl.shadowRoot
  }
  // 1.水印列数为0的时候
  //  2.水印的宽度大于页面的宽度
  //  3.水印宽度小于页面的宽度
  //  以上三种情况会重新计算水印列数和x轴的方向间隔

  // 页面的宽度 - 水印x轴的起始坐标
  defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space))
  let temp_watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / defaultSettings.watermark_cols)
  // 如果算出来的有间距的话 保持当前的间距 如果没有间距的话 就取0
  defaultSettings.watermark_x_space = temp_watermark_x_space ? defaultSettings.watermark_x_space : temp_watermark_x_space

  // 同上面计算的一致 只是计算的是y轴的间距
  defaultSettings.watermark_rows = parseInt((page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space))
  let temp_watermark_y_space = parseInt((page_height - defaultSettings.watermark_y - defaultSettings.watermark_height * defaultSettings.watermark_rows) / defaultSettings.watermark_rows)
  defaultSettings.watermark_y_space = temp_watermark_y_space ? defaultSettings.watermark_y_space : temp_watermark_y_space

  //  总体水印的宽度
  let allWatermarkWidth = 0
  // 总体水印的高度
  let allWatermarkHeight = 0

  if (watermark_parent_element) {
    allWatermarkWidth = defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
    allWatermarkHeight = defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
  } else {
    allWatermarkWidth = page_offsetLeft + defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
    allWatermarkHeight = page_offsetTop + defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
  }

  let x;
  let y;
  for (let i = 0;i < defaultSettings.watermark_rows;i++) {
    if (watermark_parent_element) {
      y = page_offsetTop + defaultSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
    } else {
      y = defaultSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
    }
    for (let j = 0;j < defaultSettings.watermark_cols;j++) {
      if (watermark_parent_element) {
        x = page_offsetLeft + defaultSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
      } else {
        x = defaultSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
      }
      //创建水印单元
      const waterMarkItem = document.createElement('div')
      waterMarkItem.appendChild(document.createTextNode(defaultSettings.watermark_txt))
      //不引起加载的消耗直接写成内联样式
      waterMarkItem.id = defaultSettings.watermark_prefix + i + j
      waterMarkItem.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      waterMarkItem.style.visibility = ""
      waterMarkItem.style.position = "absolute"
      waterMarkItem.style.left = x + 'px'
      waterMarkItem.style.top = y + 'px'
      waterMarkItem.style.overflow = 'hidden'
      waterMarkItem.style.zIndex = "9999999"
      waterMarkItem.style.opacity = defaultSettings.watermark_alpha.toString()
      waterMarkItem.style.fontSize = defaultSettings.watermark_fontsize
      waterMarkItem.style.fontFamily = defaultSettings.watermark_font
      waterMarkItem.style.color = defaultSettings.watermark_color
      waterMarkItem.style.textAlign = 'center'
      waterMarkItem.style.width = defaultSettings.watermark_width + 'px'
      waterMarkItem.style.height = defaultSettings.watermark_height + 'px'
      waterMarkItem.style.display = "block"
      waterMarkItem.style['-ms-user-select'] = "none"
      shadowRoot.appendChild(waterMarkItem)

    }
  }

}

const removeMark = () => {
  const waterMarkEl = document.getElementById(defaultSettings.watermark_id)
  waterMarkEl.parentNode.removeChild(waterMarkEl)
}
waterMark.load = (setting) => {
  loadMark(setting)
}
waterMark.remove = () => {
  removeMark()
}
export default waterMark