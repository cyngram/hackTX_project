const platforms = ['Netflix', 'Hulu', 'Max', 'Prime Video', 'Disney+']

function makeMovies(prefix, count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: `${prefix} Movie ${i + 1}`,
    poster: `https://picsum.photos/seed/${prefix}${i + 1}/300/450`,
    releaseDate: `${2012 + i}-0${(i % 9) + 1}-15`,
    stars: ['Actor One', 'Actor Two', 'Actor Three'],
    platform: platforms[i % platforms.length],
    description:
      'Placeholder description. A couple of sentences about the movie will go here.',
  }))
}

export const trendingMovies = makeMovies('Trending')

export const genreRows = ['Comedy', 'Thriller', 'Action', 'Romance'].map((genre) => ({
  genre,
  movies: makeMovies(genre),
}))