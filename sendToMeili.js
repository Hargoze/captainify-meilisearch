const fetch = require("node-fetch");
const MeiliSearch = require("meilisearch");

const config = {
  host: 'http://127.0.0.1:7700',
  apiKey: 'masterKey',
}

const client = new MeiliSearch(config)

async function fetchAPI(query, { variables } = {}) {
    const res = await fetch(`http://localhost:1337/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  
    const json = await res.json()
    if (json.errors) {
      console.error(json.errors)
      throw new Error('Failed to fetch API')
    }
  
    return json.data
  }
  

async function getAllSongsForHome() {
    const data = await fetchAPI(
      `
      query Songs{
        songs {
          id
          title
          thumbnail {
            url
          }
          author {
            name
            picture {
              url
            }
          }
        }
      }
    `
    )
    return data?.songs
}

async function sendToMeili() {
  const data = await getAllSongsForHome();
  const index = await client.getOrCreateIndex('captainify')
  const { updateId } = await index.addDocuments(data)
  await index.waitForPendingUpdate(updateId)
}

sendToMeili()