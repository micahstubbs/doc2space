const runShellCommand = require('../util/run-shell-command.js')

const bucketName = process.env.DOC2SPACE_BUCKET_NAME
const configFile = '../config/cors-json-file.json'
const command = `gsutil cors set ${configFile} gs://${bucketName}`

runShellCommand(command)
