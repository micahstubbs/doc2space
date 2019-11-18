const path = require('path')
const runShellCommand = require('../util/run-shell-command.js')

const bucketName = process.env.DOC2SPACE_BUCKET_NAME
const configFile = path.join(__dirname, '../../config/cors-json-file.json')
const command = `gsutil cors set ${configFile} gs://${bucketName}`

runShellCommand(command)
