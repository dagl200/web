import logo from './logo.svg';
import './App.css';
import React from 'react';


    function ComicInfo({comicName}) {
      const [comic, setComic] = React.useState(null)

      React.useEffect(() => {
        if (!comicName) {
          return
        }
        fetchComic(comicName).then(comicData => {
          setComic(comicData)
        })
      }, [comicName])

      if (!comicName) {
        return 'Submit a comic name'
      }

      if (!comic) {
        return '...'
      }

      return <pre>{JSON.stringify(comic, null, 2)}</pre>
    }

    function App() {
      const [comicName, setcomicName] = React.useState('')

      function handleSubmit(event) {
        event.preventDefault()
        setcomicName(event.target.elements.comicName.value)
      }

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <label htmlFor="comicName">Comic Name</label>
            <div>
              <input id="comicName" />
              <button type="submit">Submit</button>
            </div>
          </form>
          <hr />
          <ComicInfo comicName={comicName} />
        </div>
      )
    }

    function fetchComic(name) {
      const comicQuery = `
        query ($name: String) {
          comic(name: $name) {
            id
            number
            name
            attacks {
              special {
                name
                type
                damage
              }
            }
          }
        }
      `

      return window
        .fetch('https://graphql-comic.now.sh', {
          // learn more about this API here: https://graphql-comic.now.sh/
          method: 'POST',
          headers: {
            'content-type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
            query: comicQuery,
            variables: {name},
          }),
        })
        .then(r => r.json())
        .then(response => response.data.comic)
    }
    

export default App;
