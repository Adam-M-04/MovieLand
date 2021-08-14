class TvDetails
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
        if(data.aggregate_credits.cast.length > 0 && data.aggregate_credits.crew.length > 0)
        {
            this.DETAILS.appendChild(createSlidersWithSwitcher([this.data.aggregate_credits.cast, this.data.aggregate_credits.crew],['person','person'],['Cast', 'Crew'], true))
        }
        else 
        {
            let text = document.createElement('h2')
            if(data.aggregate_credits.cast.length > 0)
            {
                text.innerText = 'Cast'
                this.DETAILS.appendChild(text)
                this.DETAILS.appendChild(createSlider(data.aggregate_credits.cast, 'person', this.DV_ref.contentRef, true).container)
            } 
            if(data.aggregate_credits.crew.length > 0)
            {
                text.innerText = 'Crew'
                this.DETAILS.appendChild(text)
                this.DETAILS.appendChild(createSlider(data.aggregate_credits.crew, 'person', this.DV_ref.contentRef, true).container)
            } 
        }
    }

    createMainDiv()
    {
        let poster = createIMG(
            (this.data.poster_path !== null) ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : '../img/default_movie_poster.png',
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
        title.innerHTML = this.data.name
        text.appendChild(title)

        let tagline = document.createElement('h3')
        tagline.className = 'DV_tagline'
        tagline.innerHTML = this.data.tagline
        tagline.appendChild(createVoteContainer(this.data.vote_count, this.data.vote_average, 'DV_voteContainer_tv', true))
        text.appendChild(tagline)

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
        
        moreInfo.innerHTML = 
           `<span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Status:</span> ${this.data.status}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>First episode air date:</span> ${(this.data.first_air_date !== null && this.data.first_air_date.length > 0 ? this.data.first_air_date : '?')}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Last episode air date:</span> ${(this.data.last_air_date !== null && this.data.last_air_date.length > 0 ? this.data.last_air_date : '?')}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Number of seasons: </span>${this.data.number_of_seasons}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Number of episodes: </span>${this.data.number_of_episodes}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Languages: </span> <l>${(this.data.spoken_languages.length > 0 ) ? this.data.spoken_languages.map((lang)=>{return ' '+lang.name}) : '?'}</l></span>${br}`

        let secondDiv = document.createElement('div')
        secondDiv.className = 'DV_secondDiv'
        secondDiv.appendChild(description)
        secondDiv.appendChild(moreInfo)

        return secondDiv
    }

}