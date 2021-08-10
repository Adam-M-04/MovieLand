class Detailed_view
{
    constructor(type, id, contentRef)
    {
        this.contentRef = contentRef
        this.type = type
        this.id = id
        this.contentDIV = contentRef.contentDIV
        
        if(type === 'movie')
        {
            fetch_data(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits`, this, 'movie')
        }
        if(type === 'tv')
        {
            fetch_data(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits`, this, 'tv')
        }
        if(type === 'person')
        {
            fetch_data(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=combined_credits`, this, 'person')
        }
    }

    createGenre(text)
    {
        let genre = document.createElement('span')
        genre.className = 'DV_genre'
        genre.innerText = text
        return genre
    }

    createProductionCountries(countries)
    {
        let production_countries = document.createElement('div')
        production_countries.className = 'DV_productionCountries'
        countries.map((country)=>{
            let elmnt = document.createElement('div')
            elmnt.className = 'DV_production_country'
            
            let img = createIMG(`https://www.countryflags.io/${country.iso_3166_1.toLowerCase()}/shiny/48.png`,'DV_production_country_flag' )
            elmnt.appendChild(img)

            let forceBreak = document.createElement('div')
            forceBreak.style.cssText = 'flex-basis: 100%;height: 0;'
            elmnt.appendChild(forceBreak)
            
            let name = document.createElement('span')
            name.className = 'DV_production_country_name'
            name.innerText = country.name
            elmnt.appendChild(name)

            production_countries.appendChild(elmnt)
        })
        return production_countries
    }

    setResult(data, type)
    {
        this.data = data;
        if(this.type === 'movie') this.details = new MovieDetails(this, this.data)
        if(this.type === 'tv') this.details = new TvDetails(this, this.data)
        if(this.type === 'person') this.details = new PersonDetails(this, this.data)
        this.showResult()
    }

    showMessage(message)
    {
        this.contentRef.showMessage(message)
    }

    showResult()
    {
        this.contentDIV.innerHTML = ''
        this.contentDIV.appendChild(this.details.DETAILS)
    }

}