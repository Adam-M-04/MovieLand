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
            fetch_data(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`, 'movie', this)
        }
        if(type === 'tv')
        {
            fetch_data(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`, 'tv', this)
        }
        if(type === 'person')
        {
            fetch_data(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}`, 'person', this)
        }
    }

    createBackButton()
    {
        this.backButton = document.createElement('button')
        this.backButton.className = 'DV_backButton'
        this.backButton.onclick = ()=>{this.contentRef.Back(this.contentRef)}
        this.backButton.innerText = 'Back'
        this.contentDIV.appendChild(this.backButton)
    }

    setResult(data, type)
    {
        this.data = data;
        this.contentDIV.innerHTML = ''
        this.showResult()
        this.createBackButton()
    }

    showResult()
    {
        if(this.type === 'movie') this.details = new MovieDetails(this, this.data)
        if(this.type === 'tv') this.details = new TvDetails(this, this.data)
        if(this.type === 'person') this.details = new PersonDetails(this, this.data)
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

    createGenre(text)
    {
        let genre = document.createElement('span')
        genre.className = 'DV_genre'
        genre.innerText = text
        return genre
    }

    showMessage(message)
    {
        this.contentRef.showMessage(message)
    }

    // TV SHOW
}