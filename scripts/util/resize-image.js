const fs = require('fs')
const sharp = require('sharp')
const path = require('path')

async function resizeImage(inFile, size) {
  console.log(`resizing ${inFile}`)
  const ext = path.extname(inFile)
  let fileStem = inFile.split(/\./)
  fileStem.pop()
  const outFile = `${fileStem}-${size}px${ext}`
  const image = await sharp(inFile)

  // get current width and height
  const { width, height } = await image.metadata()
  console.log(`current dimensions: [${width}, ${height}]`)

  // calculate nearest power of two width and height
  // start at 2^4, which is 16, since most images will be at least that big
  // let powerOfTwo = 16
  // let newWidth
  // let newHeight
  // while (!(newWidth && newHeight)) {
  //   if (powerOfTwo > width) newWidth = powerOfTwo
  //   if (powerOfTwo > height) newHeight = powerOfTwo
  //   powerOfTwo = powerOfTwo * 2
  //   console.log(`powerOfTwo ${powerOfTwo}, [${newWidth}, ${newHeight}]`)
  // }

  const newWidth = size
  const newHeight = size

  // write out resized image
  image
    .resize(newWidth, newHeight, {
      fit: 'contain',
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1,
      },
    })
    .toFile(outFile)
    .then(info => {
      console.log(info)
    })
    .catch(err => {
      console.log(err)
    })
}

module.exports = resizeImage
