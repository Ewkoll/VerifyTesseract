# VerifyTesseract

```
npm init
npm i tesseract.js selenium-webdriver --save
```

# 安装webdriver的chrome驱动


# 训练文件

## 安装jTessBoxEditor工具

1. [工具下载地址](https://sourceforge.net/projects/vietocr/files/jTessBoxEditor/)，FX版本需要OracleJDK所以如果下载运行不了，尝试另外一个版本。
2. 执行train或者train.bat

## 准备样本数

1. 可以使用WebDriver程序，获取对应需要识别网站的数据。
2. 把png文件转换成tiff文件。

``` python
from PIL import Image
import os
import sys


def png2tiff(path):
    tiff_path = os.path.join(path, "tiff")
    if (not (os.path.exists(tiff_path))):
        os.mkdir(tiff_path)

    imgList = os.listdir(path)
    for name in imgList:
        try:
            image_path = os.path.join(path, name)
            if os.path.isdir(image_path):
                continue
            
            images = Image.open(image_path)
            file_name, file_type = os.path.splitext(name)
            if file_type == 'tiff':
                continue
            else:
                file_path = os.path.join(path, "./tiff/%s.tiff" % (file_name))
                images.save(file_path, format='tiff')
        except IOError as e:
            print(e)
            print("one file was ignored")


png2tiff(sys.argv[1])
```
3. 执行python png2tiff.py $PATH

## 合并样本数据

1. 使用jTessBoxEditor即可合并图片。 #TODO 这个工具太难用了，自己搞个最好。

## 生成Box文件

1. tesseract eng.normal.exp0.tif eng.normal.exp0 batch.nochop makebox

## 字符位置校正

1. 这个工具手段校正真TMD难用。

## 生成TR文件

1. tesseract eng.normal.exp0.tif eng.normal.exp0 nobatch box.train

## 增加字体特征文件

1. echo font 0 0 0 0 0 > font_properties

## 提取字符

1. unicharset_extractor eng.normal.exp0.box

## 生成shape文件

1. shapeclustering -F font_properties -U unicharset eng.normal.exp0.tr

## 生成聚集字符特征文件

1. mftraining -F font_properties -U unicharset -O unicharset eng.normal.exp0.tr

## 合并所有tr文件

1. cntraining eng.normal.exp0.tr

## 修改文件名

```
mv inttemp eng.normal.inttemp
mv normproto eng.normal.normproto
mv pffmtable eng.normal.pffmtable
mv shapetable eng.normal.shapetable
mv unicharset eng.normal.unicharset
```

## 生成训练结果文件

1. combine_tessdata eng.normal

## 拷贝文件到tessdata目录

1. cp eng.normal.traineddata /usr/local/share/tessdata

## 测试图像识别

1. tesseract captcha1592358516333.png  result -l eng.normal

*识别率非常感人的低，入门的使用！*