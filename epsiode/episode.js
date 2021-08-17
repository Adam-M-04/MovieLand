class Episode
{
    constructor(data)
    {
        this.data = data
        this.container = document.createElement('div')
        this.container.className = 'episode_container'
        this.container.appendChild(createIMG(
            (data.still_path ? 'https://image.tmdb.org/t/p/w500'+data.still_path : '/img/default_backdrop.png'),
            'episode_poster'
        ))
        this.container.appendChild(this.createDescription())
    }

    createDescription()
    {
        let description = document.createElement('div')
        description.className = 'episode_description'

        let title = document.createElement('h2')
        title.className = 'episode_title'
        title.innerText =  `S${this.data.season_number}:E${this.data.episode_number} - ${this.data.name}`
        description.appendChild(title)

        let overview = document.createElement('p')
        overview.className = 'episode_overview'
        overview.innerText = this.data.overview
        description.appendChild(overview)

        let air_date = document.createElement('p')
        air_date.className = 'episode_air_date'
        air_date.innerText =  `(Air date: ${this.data.air_date ? this.data.air_date : '?'})`
        description.appendChild(air_date)

        return description
    }

}