const MeiliSearch = require("meilisearch");

const config = {
  host: 'http://127.0.0.1:7700',
  apiKey: 'masterKey',
}

const client = new MeiliSearch(config)

;(async () => {
    const index = await client.getIndex('captainify')
    const resp = await index.getStopWords()
    console.log({ resp })
  })()
