class MovieDetails
{
    constructor(DV_ref, data)
    {
        this.DV_ref = DV_ref
        this.data = data

        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS'
        this.DETAILS.appendChild(this.createMainDiv())
        this.DETAILS.appendChild(this.createMainText())
        this.DETAILS.appendChild(this.createSecondDiv())

        DV_ref.contentDIV.appendChild(this.DETAILS)
    }

    createMainDiv()
    {
        let poster = createIMG(
            (this.data.poster_path !== null) ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : '../img/default_movie_poster.png',
            'DV_poster')

        let backdrop = createIMG(
            (this.data.backdrop_path !== null) ? `https://image.tmdb.org/t/p/original${this.data.backdrop_path}` : '../img/default_backdrop.png',
            'DV_backdrop')

        let MainDiv = document.createElement('div')
        MainDiv.className = 'DV_mainDiv'
        MainDiv.appendChild(poster)
        MainDiv.appendChild(backdrop)
        return MainDiv
    }

    createMainText()
    {
        let text = document.createElement('div')
        text.className = 'DV_mainText'

        let title = document.createElement('h2')
        title.className = 'DV_title'
        title.innerHTML = this.data.title
        text.appendChild(title)

        let tagline = document.createElement('h3')
        tagline.className = 'DV_tagline'
        tagline.innerHTML = this.data.tagline
        text.appendChild(tagline)

        let runtime = document.createElement('span')
        runtime.className = 'DV_runtime'
        runtime.innerText = `( ${this.data.runtime}  min )`
        runtime.title = parseInt(this.data.runtime / 60) + 'h ' + (this.data.runtime % 60) + ' min'
        text.appendChild(runtime)

        let genres = document.createElement('div')
        genres.className = 'DV_genres'
        this.data.genres.map((genre)=>{genres.appendChild(this.DV_ref.createGenre(genre.name))})
        text.appendChild(genres)

        let production_countries = document.createElement('div')
        production_countries.className = 'DV_productionCountries'
        this.data.production_countries.map((country)=>{
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
        text.appendChild(production_countries)

        return text
    }
    
    createSecondDiv()
    {
        let description = document.createElement('div')
        description.className = 'DV_description'
        description.innerHTML = `<b>Overview:</b><br> ${this.data.overview !== null ? this.data.overview : 'No description for this movie'}`

        let moreInfo = document.createElement('div')
        moreInfo.className = 'DV_moreInfo'
        
        let budget = this.data.budget == 0 ? '?' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.data.budget)
        let revenue = this.data.revenue == 0 ? '?' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.data.revenue)
        let homepage = (this.data.homepage === null || this.data.homepage === '') ? '' : 
            `<span>Homepage: </span><a href='${this.data.homepage}' target='_blank'>${this.data.homepage}</a><br>`        

        moreInfo.innerHTML = 
           `<span>Status:</span> ${this.data.status}<br>
            <span>Release date:</span> ${this.data.release_date !== null && this.data.release_date.length > 0 ? this.data.release_date : '?'}<br>
            <span>Budget:</span> ${budget}<br>
            <span>Revenue: </span>${revenue}<br>
            <span>Languages: </span> <l>${(this.data.spoken_languages.length > 0 ) ? this.data.spoken_languages.map((lang)=>{return ' '+lang.name}) : '?'}</l><br>
            ${homepage}`

        let secondDiv = document.createElement('div')
        secondDiv.className = 'DV_secondDiv'
        secondDiv.appendChild(description)
        secondDiv.appendChild(moreInfo)

        return secondDiv
    }
}