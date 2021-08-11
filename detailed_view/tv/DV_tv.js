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
        if(data.credits.cast.length > 0 && data.credits.crew.length > 0) this.createCastAndCrewSlider()
        else 
        {
            if(data.credits.cast.length > 0) this.DETAILS.appendChild(this.createCastOrCrewSlider(data.credits.cast).container)
            if(data.credits.crew.length > 0) this.DETAILS.appendChild(this.createCastOrCrewSlider(data.credits.crew).container)
        }
    }

    createCastAndCrewSlider()
    {
        this.cast_crew_switch = new SwitchButton(['Cast', 'Crew'], this.switch_cast_crew, this)
 
        this.castSwiper = this.createCastOrCrewSlider(this.data.credits.cast)

        this.crewSwiper = this.createCastOrCrewSlider(this.data.credits.crew)

        this.DETAILS.appendChild(this.cast_crew_switch.container)
        this.DETAILS.appendChild(this.castSwiper.container)
    }

    createCastOrCrewSlider(data)
    {
        let Elements = []

        for(let person_data of data)
        {
            let person = new Card('person', person_data, this.DV_ref.contentRef, true)
            Elements.push(person.card)
        }

        return new Slider(Elements)
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
        let homepage = (this.data.homepage === null || this.data.homepage === '') ? '' : 
            `<span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Homepage: </span><a href='${this.data.homepage}' target='_blank'>${this.data.homepage}</a></span>`
        
        moreInfo.innerHTML = 
           `<span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Status:</span> ${this.data.status}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>First episode air date:</span> ${(this.data.first_air_date !== null && this.data.first_air_date.length > 0 ? this.data.first_air_date : '?')}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Last episode air date:</span> ${(this.data.last_air_date !== null && this.data.last_air_date.length > 0 ? this.data.last_air_date : '?')}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Number of seasons: </span>${this.data.number_of_seasons}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Number of episodes: </span>${this.data.number_of_episodes}</span>${br}
           <span class='DV_moreInfo_row'><span class='DV_moreInfo_title'>Languages: </span> <l>${(this.data.spoken_languages.length > 0 ) ? this.data.spoken_languages.map((lang)=>{return ' '+lang.name}) : '?'}</l></span>${br}
            ${homepage}`

        let secondDiv = document.createElement('div')
        secondDiv.className = 'DV_secondDiv'
        secondDiv.appendChild(description)
        secondDiv.appendChild(moreInfo)

        return secondDiv
    }

    switch_cast_crew(ref)
    {
        if(ref.cast_crew_switch.current)
        {
            ref.castSwiper.container.remove()
            ref.DETAILS.appendChild(ref.crewSwiper.container)
            ref.crewSwiper.swiper.update()
        }
        else
        {
            ref.crewSwiper.container.remove()
            ref.DETAILS.appendChild(ref.castSwiper.container)
            ref.crewSwiper.swiper.update()
        }
    }

}