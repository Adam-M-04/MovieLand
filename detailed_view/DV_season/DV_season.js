class SeasonDetails
{
    constructor(DV_ref, data)
    {
        this.DV_ref = DV_ref
        this.data = data

        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS_season'
        this.DETAILS.append(...this.createMainContent())
        this.DETAILS.appendChild(this.createEpisodes())
        this.DETAILS.appendChild(createHeader('Cast'))
        this.swipers = [createSlider(data.aggregate_credits.cast, 'person', this.DV_ref.contentRef, true)]
        this.DETAILS.appendChild(this.swipers[0].container)
    }

    createEpisodes()
    {
        let episodesContainer = document.createElement('div')

        for(let episode of this.data.episodes)
        {
            let elmnt = new Episode(episode)
            episodesContainer.appendChild(elmnt.container)
        }

        return episodesContainer
    }

    createMainContent()
    {
        let profilePhoto = createIMG(
            (this.data.profile_path !== null) ? `https://image.tmdb.org/t/p/original${this.data.poster_path}` : '/img/default_movie_poster.png',
            'DV_season_img')
        profilePhoto.onerror = ()=>{profilePhoto.onerror = null; profilePhoto.src = '/img/default_movie_poster.png'}

        let name = document.createElement('h1')
        name.className = 'DV_name_of_season'
        name.innerHTML = this.data.name

        return [profilePhoto, name, this.getOverview()]
    }

    getOverview()
    {
        let overview = document.createElement('p')
        overview.className = 'DV_season_overview'
        overview.innerHTML = '<br>' + this.data.overview
        return overview
    }

}