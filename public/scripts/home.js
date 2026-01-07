const main = document.querySelector(".main")

const errorBox = document.createElement("div")
errorBox.className = "error"
errorBox.style.display = "none"
main.parentNode.insertBefore(errorBox, main)

const showError = message => {
  errorBox.textContent = message
  errorBox.style.display = "block"
}

fetchGenresList()

async function fetchGenresList() {
  const url = genres_list_http + new URLSearchParams({
    api_key: api_key
  })

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch genres: ${res.status}`)
    }

    const data = await res.json()
    data.genres.forEach(item => {
      fetchMoviesListByGenres(item.id, item.name)
    })
  } catch (err) {
    console.error("Error fetching genres list:", err)
    showError("Erro ao carregar lista de gêneros.")
  }
}

const fetchMoviesListByGenres = async (id, genres) => {
  const url = movie_genres_http + new URLSearchParams({
    api_key: api_key,
    with_genres: id,
    page: Math.floor(Math.random() * 3) + 1
  })

  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch movies for ${genres}: ${res.status}`)
    }

    const data = await res.json()
    const category = genres.replace("_", " ")
    makeCategoryElement(category, data.results)
  } catch (err) {
    console.error(`Error fetching movies for ${genres}:`, err)
    showError(`Erro ao carregar filmes para ${genres.replace("_", " ")}`)
  }
}

const makeCategoryElement = (category, data) => {
  const categoryHTML = `
  <div class="movie-list">

    <button class="pre-btn">
      <img src="images/prev.png" alt="previous button">
    </button>

    <h1 class="movie-category">${category.replace("_", " ")}</h1>
    
    <div class="movie-container" id="${category}">

    </div>

    <button class="next-btn">
      <img src="images/next.png" alt="next button">
    </button>

  </div>
  
  `
  main.innerHTML += categoryHTML
  makeCards(category, data)
}

const makeCards = (category, data) => {
  const movieContainer = document.getElementById(category.replace(" ", "_"));

  data.forEach((item, index) => {
    if (!item.backdrop_path) {
      item.backdrop_path = item.poster_path

      if (!item.backdrop_path) {
        return
      }
    }

    const movieHTML = `
    <div class="movie">
      <img src="${img_url}${item.backdrop_path}" alt="poster">
      <p class="movie-title">${item.title}</p>
    </div>
    `
    movieContainer.innerHTML += movieHTML

    if (index == data.length - 1) {
      setTimeout(() => {
        setupScrooling()
      }, 100)
    }

  })
}