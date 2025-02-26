const urlRegex = new RegExp(`(https?(?:[^\\s\\{\\}]+|\\{\\{.*?\\}\\})+)(\\s+(\\s|.)*)?$`);
const headerRegex = new RegExp(`:headers\\s+(\\{(.|\\s)*?[^\\}]\\}([^\\}]|$))`)
export default {
  parse: function (tagToken) {

    const match = tagToken.args.match(urlRegex);
    if (!match) { throw new Error(`Syntax error in 'connected_content'`) };

    this.url = match[1];
    const opts = match[2];

    this.options = {};

    if (opts) {
      const headersMatch = opts.match(headerRegex)
      if (headersMatch != null) {
        this.options.headers = JSON.parse(headersMatch[1])
      }

      opts.replace(headerRegex, '').split(/\s+:/).forEach((optStr) => {
        if (optStr === '') return

        const optsSplit = optStr.split(/\s+/)
        if (optsSplit[0] === 'headers') {
          console.error('Headers syntax is incorrect. Please use :headers {key: value} syntax')
        }
        this.options[optsSplit[0]] = optsSplit.length > 1 ? optsSplit[1] : true
      })
    }
  },
  render: async function (context) {
    const renderedUrl = await this.liquid.parseAndRender(this.url, context.getAll())

    const method = this.options.method || 'GET'

    let contentType = this.options.contentType || 'application/json'
    if (method === 'POST') {
      contentType = this.options.content_type || 'application/x-www-form-urlencoded'
    }

    const headers = {
      'User-Agent': 'email-pipeline-client',
      'Content-Type': contentType,
      'Accept': this.options.content_type
    }

    if (this.options.headers) {
      for (const key of Object.keys(this.options.headers)) {
        headers[key] = await this.liquid.parseAndRender(this.options.headers[key], context.getAll())
      }
    }

    let body = this.options.body

    if (this.options.body) {
      if (method.toUpperCase() === 'POST' && contentType.toLowerCase().includes('application/json')) {
        const jsonBody = {}
        for (const element of this.options.body.split('&')) {
          const bodyElementSplit = element.split('=')
          jsonBody[bodyElementSplit[0]] = (await this.liquid.parseAndRender(bodyElementSplit[1], context.getAll())).replace(/(?:\r\n|\r|\n|)/g, '')
        }
        body = JSON.stringify(jsonBody)
      } else {
        body = await this.liquid.parseAndRender(this.options.body, context.getAll())
      }
    }

    let fetchOptions = {
      method: method,
      headers: headers,
      body: body,
    }

    if (this.options.basic_auth) {
      const secrets = context.environments['__secrets']
      if (!secrets) {
        throw new Error('No secrets defined in context!')
      }
      const secret = secrets[this.options.basic_auth]
      if (!secret) {
        throw new Error(`No secret found for ${this.options.basic_auth}`)
      }

      if (!secret.username || !secret.password) {
        throw new Error(`No username or password set for ${this.options.basic_auth}`)
      }

      fetchOptions['auth'] = {
        user: secret.username,
        pass: secret.password
      }
    }

    let response;
    let schema;
    try {
      response = await fetch(renderedUrl, fetchOptions);
      schema = await response.json();
    } catch (error) {
      throw new Error(`Error fetching connected content: ${error}`);
    }

    //if response status code is between 200 and 299, return the schema
    if (response.status >= 200 && response.status < 300) {
      context.environments[this.options.save || 'connected'] = schema
    } else {
      throw new Error(`Error fetching connected content: ${response.statusText}`);
    }

  }

}