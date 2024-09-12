const cheerio = require('cheerio');
const axios = require('axios');

const scrap_movie_name = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;
  let moviname = "";
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const moviename = $('h1[slot=titleIntro]').text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      moviname = moviename;
      // console.log(moviename)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return moviname
}

const scrap_movie_info = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;
  let movieInfo = {}
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      const director = $('dt:contains("Director")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Director'] = director;

      const screenwriter = $('dt:contains("Screenwriter")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Writer'] = screenwriter;

      const runtime = $('rt-text[slot="duration"]').text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Runtime'] = runtime;

      const genre = $('dt:contains("Genre")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Genre'] = genre;

      const distributor = $('dt:contains("Distributor")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Distributor'] = distributor;

      const productionCo = $('dt:contains("Production Co")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Production_Co'] = productionCo;

      const producer = $('dt:contains("Executive Producer")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Producer'] = producer;

      const originalLanguage = $('dt:contains("Original Language")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Original_Language'] = originalLanguage;

      const releaseDateTheaters = $('dt:contains("Release Date (Theaters)")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Release_Date'] = releaseDateTheaters;

      const aspectRatio = $('dt:contains("Aspect Ratio")').next().first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      movieInfo['Aspect_Ratio'] = aspectRatio;

      // $('.content-wrap dl div.category-wrap').each((index, element) => {
      //   const label = $(element).find('.key').first().text().trim().replace(/:/g, "");
      //   let value = $(element).find('dd').first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      // // $('section#movie-info').find('div.media-body').find('div.panel-body').find('ul#info').find('li.info-item').each((index, element) => {
      // //   const label = $(element).find('b.info-item-label').text().trim().replace(/:/g, "");
      // //   const value = $(element).find('span.genre, span, a, span.runtime, span.distributor, span.production-co, span.aspect-ratio').first().text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
      //   if(label === 'Original Language'){
      //       movieInfo['Original_Language']=value
      //   }
      //   else if(label === 'Release Date (Theaters)'){
      //       movieInfo['Release_Date']=value
      //   }
      //   else if(label === 'Production Co'){
      //     movieInfo['Production_Co']=value
      //   }
      //   else if(label === 'Aspect Ratio'){
      //     movieInfo['Aspect_Ratio']=value
      //   }
      //   else{
      //       movieInfo[label]=value;
      //   }
      // });
      // console.log(movieInfo)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return movieInfo
}

const scrap_synopsis = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;

  let synop = ""
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      // const synopsis = $('p[data-qa="movie-info-synopsis"]').text().trim()
      const synopsis = $('.synopsis-wrap rt-text').text().trim().substring(8);
      synop = synopsis
      // console.log(synopsis);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return synop;
}

const scrap_cast_and_crew = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;
  let castCrew = [];
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('section.cast-and-crew .content-wrap a').each((index, element) => {
        const actorName = $(element).find('.name').text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
        const characterName = $(element).find('.role').text().trim().replace(/\n/g, '').replace(/\s+/g, ' ');
        let imageUrl = $(element).find('rt-img').attr('src');
        imageUrl = imageUrl.substring(70);
        castCrew.push({ actorName, characterName, imageUrl });
      });
      // console.log(castCrew);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return castCrew;
}

const scrap_ott = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;

  let ottData = [];
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('section.where-to-watch where-to-watch-meta').each((i, elem) => {
        const ottName = $(elem).attr('affiliate');
        const ottLink = $(elem).attr('href');

        ottData.push({ ottName, ottLink });

      });
      // console.log(ottData)
    })

    .catch(error => {
      console.error('Error:', error);
    });
  return ottData;
}

const scrap_movie_img = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;

  let poster = ""
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const posterUrl = $('media-scorecard rt-img[slot="posterImage"]').attr('src');
      poster = posterUrl.substring(70);
      // console.log(poster);
    })


    .catch(error => {
      console.error('Error:', error);
    });
  return poster;
}

const scrap_movie_photos = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/m/${movie_name}`;

  let imageUrls = [];
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('rt-img').each((index, element) => {
        const imageUrl = $(element).attr('srcdesktop'); // Assuming you want the desktop image URLs
        if (imageUrl) {
          photo = imageUrl.substring(77)
          imageUrls.push({photo});
        }
      });
      console.log(imageUrls)
    })

    .catch(error => {
      console.error('Error:', error);
    });
  return imageUrls;
}

const scrap_search = async (movie_name) => {
  const url = `https://www.rottentomatoes.com/search?search=${movie_name}`;

  let search = []
  await axios.get(url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      const movieResults = $('search-page-result[type="movie"]');

      movieResults.find('search-page-media-row').each((index, element) => {
        const movieTitle = $('a[slot="title"]', element).text().trim();
        let movieLink = $('a', element).attr('href');
        if (movieLink.match('https:\/\/www\.rottentomatoes\.com\/m\/.*')) {
          movieLink = movieLink.substring(33)
        }
        let movieImage = $('img', element).attr('src');
        movieImage = movieImage.substring(76)
        search.push({ movieTitle, movieLink, movieImage });
      });
      // console.log(search)
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return search;
}

// scrap_movie_photos('leo_2023_2')
// scrap_movie_info('leo_2023_2')

module.exports={scrap_search,scrap_movie_info,scrap_synopsis,scrap_cast_and_crew,scrap_movie_img,scrap_movie_name,scrap_movie_photos,scrap_ott}