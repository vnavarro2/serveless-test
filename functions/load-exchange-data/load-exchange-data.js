// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const fetch = require('node-fetch')

const handler = async (event, context, callback) => {
  const { base } = event.queryStringParameters;

  try {
    const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
    const data = await response.json()
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
