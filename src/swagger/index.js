const { readFileSync } = require('fs');

const swaggerUi = require('swagger-ui-express')

const YAML = require('yaml') // parse the YAML file.
const path = require('path')
const filePath = path.join(__dirname, '../../docs/swagger.yaml');


function configSwagger(app) {
    let swaggerDocument = readSwaggerFile()
  
    app.use('/api-docs', swaggerUi.serve, (req , res , next) => {
      swaggerDocument = readSwaggerFile()
      return swaggerUi.setup(swaggerDocument)(req, res, next)
    })
  }
// This function reads the YAML file and returns the parsed YAML file.
function readSwaggerFile() {
  // read the YAML file.
  const swaggerFile = readFileSync(filePath, 'utf8')
  // parse the YAML file.
  const swaggerDocument = YAML.parse(swaggerFile)
  // remove the servers field from the YAML file. -> xoá field servers in file YAML.
  //   if (swaggerDocument.servers) {
  //     delete swaggerDocument.servers
  //   }
  return swaggerDocument
}

function configSwagger(app) {
    let swaggerDocument = readSwaggerFile()
  
    app.use('/api-docs', swaggerUi.serve, (req , res , next) => {
      swaggerDocument = readSwaggerFile()
      return swaggerUi.setup(swaggerDocument)(req, res, next)
    })
  }
  
  module.exports = { configSwagger }
  