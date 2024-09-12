const cheerio = require('cheerio');
const axios = require('axios');

const scrap_actor_info = async (actor_name) =>{
    const url = `https://www.rottentomatoes.com/celebrity/${actor_name}`;
    let actor_info=[];
    await axios.get(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        // const actor_info = []

        const actor_bio = $('p[data-qa="celebrity-bio-summary"]').text().trim()

        const actor_bday = $('p[data-qa="celebrity-bio-bday"]').text().trim().replace(/\n/g, '').replace(/\s+/g, ' ')

        const actor_bplace = $('p[data-qa="celebrity-bio-birthplace"]').text().trim().replace(/\n/g, '').replace(/\s+/g, ' ')

        actor_info.push({actor_bday,actor_bplace,actor_bio})
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return actor_info[0]
}

module.exports={scrap_actor_info}