const fs = require('fs')
const path = require('path')
const csv = require('csv-parser')
const fastcsv = require('fast-csv')
const sanitizeFilename = require('./util/sanitize-filename')

const dataDir = path.join(__dirname, '../frontends/webvr')
const inputFile = 'tsne-coords-labels-run-1.csv'
const inputPath = path.join(dataDir, inputFile)
const outputFile = 'tsne-coords-labels-run-1-cleaned.csv'
const outputPath = path.join(dataDir, outputFile)

const outputData = []

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', row => {
    console.log(row)
    row.pdf = sanitizeFilename(row.label)
      .replace(/-\d+\.txt/, '.pdf')
      .replace(/\.txt/, '.pdf')
    outputData.push(row)
  })
  .on('end', () => {
    console.log(`${inputPath} successfully processed`)
    writeCsv(outputData, outputPath)
  })

function writeCsv(data, outputFile) {
  const ws = fs.createWriteStream(outputFile)
  fastcsv.write(data, { headers: true }).pipe(ws)
}
