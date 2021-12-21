class Detailed_view
{
    constructor(type, id, contentRef,season_number = null)
    {
        this.contentRef = contentRef
        this.type = type
        this.id = id
        this.contentDIV = contentRef.contentDIV
        this.contentDIV.innerHTML = '<img src="/img/loading.svg">'
        if(type === 'movie')
        {
            fetch_data(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,images,recommendations,external_ids`, this, 'movie')
        }
        if(type === 'tv')
        {
            fetch_data(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=aggregate_credits,images,recommendations`, this, 'tv')
        }
        if(type === 'person')
        {
            fetch_data(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=combined_credits`, this, 'person')
        }
        if(type === 'season')
        {
            fetch_data(`https://api.themoviedb.org/3/tv/${id}/season/${season_number}?api_key=${apiKey}&append_to_response=aggregate_credits`, this, 'season')
        }
    }

    createBackdrop(ref, backdropDiv)
    {
        let slideshow = null
        if(ref.data.images.backdrops.length > 1)
        {
            slideshow = new SlideShow(ref.data.images.backdrops, 'https://image.tmdb.org/t/p/original', backdropDiv, this.contentRef.app.history)
        }
        else
        {
            let backdrop = null
            if(ref.data.images.backdrops.length > 0)
            {
                backdrop = createIMG('https://image.tmdb.org/t/p/original'+ref.data.images.backdrops[0].file_path,'DV_backdrop_img') 
                backdrop.onerror = ()=>{backdrop.onerror = null; backdrop.src = '../img/default_backdrop.png'}
            }
            else backdrop = createIMG('../img/default_backdrop.png','DV_backdrop_img')
            backdropDiv.appendChild(backdrop)
        }
        return slideshow
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
        if(countries.length === 0) return production_countries

        let title = document.createElement('h3')
        title.className = 'DV_production_countries_title'
        title.innerText = "Production countries"
        production_countries.appendChild(title)

        countries.map((country)=>{
            let elmnt = document.createElement('div')
            elmnt.className = 'DV_production_country'
            
            let img = createIMG(`https://flagcdn.com/48x36/${country.iso_3166_1.toLowerCase()}.png`,'DV_production_country_flag' )
            img.alt = 'flag not found'
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
        if(this.type === 'season') this.details = new SeasonDetails(this, this.data)
        this.showResult()
    }

    showMessage(message)
    {
        this.contentRef.showMessage(message)
    }

    showResult()
    {
        this.contentDIV.innerHTML = ''
        this.contentRef.app.mainInput.hide()
        this.contentDIV.appendChild(this.details.DETAILS)
        if(this.details.swiper_to_update) this.details.swiper_to_update.swiper.update()
        
        for(let swiper of this.details.swipers) swiper.swiper.update()
        if(this.details.backdropSlideshow) this.details.backdropSlideshow.start()
    }

}