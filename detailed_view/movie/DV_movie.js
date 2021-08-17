class MovieDetails
{
    constructor(DV_ref, data)
    {
        this.DV_ref = DV_ref
        this.data = data

        this.swipers = []

        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS'
        this.DETAILS.appendChild(this.createMainDiv())
        this.DETAILS.appendChild(this.createMainText())
        this.DETAILS.appendChild(this.createSecondDiv())

        if(data.credits.cast.length > 0 && data.credits.crew.length > 0)
        {
            this.DETAILS.appendChild(createSlidersWithSwitcher([this.data.credits.cast, this.data.credits.crew],['person','person'],['Cast', 'Crew'], true))
        }
        else 
        {
            if(data.credits.cast.length > 0)
            {
                this.DETAILS.appendChild(createHeader('Cast'))
                this.swipers.push(createSlider(data.credits.cast, 'person', this.DV_ref.contentRef, true))
                this.DETAILS.appendChild(this.swipers[this.swipers.length-1].container)
            } 
            if(data.credits.crew.length > 0)
            {
                this.DETAILS.appendChild(createHeader('Crew'))
                this.swipers.push(createSlider(data.credits.crew, 'person', this.DV_ref.contentRef, true))
                this.DETAILS.appendChild(this.swipers[this.swipers.length-1].container)
            } 
        }
        if(data.recommendations.results.length)
        {
            this.DETAILS.appendChild(createHeader('More similar'))
            this.swipers.push(createSlider(data.recommendations.results, 'movie', this.DV_ref.contentRef))
            this.DETAILS.appendChild(this.swipers[this.swipers.length-1].container)
        }
    }

    createMainDiv()
    {
        let poster = createIMG(
            (this.data.poster_path !== null) ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : '/img/default_movie_poster.png',
            'DV_poster')
        poster.onerror = ()=>{poster.onerror = null; poster.src = '/img/default_movie_poster.png'}

        let backdropDiv = document.createElement('div')
        backdropDiv.className = 'DV_backdrop'
        this.backdropSlideshow = this.DV_ref.createBackdrop(this, backdropDiv)

        let MainDiv = document.createElement('div')
        MainDiv.className = 'DV_mainDiv'
        MainDiv.appendChild(poster)
        MainDiv.appendChild(backdropDiv)
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
        runtime.title = parseInt(this.data.runtime / 60) + 'h ' + (this.data.runtime % 60) + 'min'
        runtime.appendChild(createVoteContainer(this.data.vote_count, this.data.vote_average, 'DV_voteContainer', true))
        text.appendChild(runtime)

        let genres = document.createElement('div')
        genres.className = 'DV_genres'
        this.data.genres.map((genre)=>{genres.appendChild(this.DV_ref.createGenre(genre.name))})
        text.appendChild(genres)

        text.appendChild(this.DV_ref.createProductionCountries(this.data.production_countries))

        return text
    }
    
    createSecondDiv()
    {
        let description = document.createElement('div')
        description.className = 'DV_description'
        description.innerHTML = `<b>Overview:</b><br> ${this.data.overview ? this.data.overview : 'No description for this movie'}`

        let moreInfo = document.createElement('div')
        moreInfo.className = 'DV_moreInfo'

        let br = '<div style="flex-basis: 100%;height: 4px;"></div>'
        
        let budget = this.data.budget == 0 ? '?' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.data.budget)
        let revenue = this.data.revenue == 0 ? '?' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.data.revenue)

        moreInfo.innerHTML = 
           `<span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Status:</span> ${this.data.status}</span>${br}
            <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Release date:</span> ${this.data.release_date !== null && this.data.release_date.length > 0 ? this.data.release_date : '?'}</span>${br}
            <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Budget:</span> ${budget}</span>${br}
            <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Revenue: </span>${revenue}</span>${br}
            <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Languages: </span> <l>${(this.data.spoken_languages.length > 0 ) ? this.data.spoken_languages.map((lang)=>{return ' '+lang.name}) : '?'}</l></span>${br}`

        let secondDiv = document.createElement('div')
        secondDiv.className = 'DV_secondDiv'
        secondDiv.appendChild(description)
        secondDiv.appendChild(moreInfo)

        return secondDiv
    }

}