# @yycx/watermark

一个简单的水印插件




#### 调用方式

```js

import waterMark from '@airsky/watermark'

//渲染
waterMark.load(settings)

//移除

waterMark.remove()

```

#### Params
|  参数   | 说明  | 类型 | 默认值 | 
|  ----  | ----  |  ----  | ----  |
| watermark_id  | 挂载的wrapperId | string  | waterMark-wrap |
| watermark_prefix  | 小水印的id前缀 | string  | waterMark-item |
| watermark_txt  | 水印的内容 | string  | yycx |
| watermark_x  | 水印起始位置X轴坐标 | number  | 20 |
| watermark_y  | 水印起始位置Y轴坐标 | number  | 20 |
| watermark_rows  | 水印行数 | number  | 0 |
| watermark_cols  | 水印列数 | number  | 0 |
| watermark_x_space  | 水印X轴间隔 | number  | 50 |
| watermark_y_space  | 水印y轴间隔 | number  | 50 |
| watermark_font  | 水印字体 | string  | 微软雅黑 |
| watermark_color  | 水印字体颜色 | string  | #333 |
| watermark_alpha  | 水印透明度 | number  | 0.15(如手动设置请大雨等于0.005) |
| watermark_width  | 水印宽度 | number  | 100 |
| watermark_height  | 水印高度 | number  | 100 |
| watermark_angle  | 水印倾斜度数 | number  | 15 |
| watermark_parent_width  | 水印总体宽度 | number  | 0 |
| watermark_parent_height  | 水印总体高度 | number  | 0 |
| watermark_parent_node  | 水印挂载的父级元素El | Element  | body |
