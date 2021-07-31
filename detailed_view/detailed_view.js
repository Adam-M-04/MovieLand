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
        if(this.type === 'movie') this.showMovieDetails()
    }

    showMovieDetails()
    {
        this.DETAILS = document.createElement('div')
        this.DETAILS.className = 'DV_DETAILS'
        this.DETAILS.appendChild(this.createMainDiv())
        this.DETAILS.appendChild(this.createMainText())
        this.DETAILS.appendChild(this.createSecondDiv())

        this.contentDIV.appendChild(this.DETAILS)
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
        title.innerText = (this.data.release_date.length > 0) 
            ? `${this.data.title} (${this.data.release_date.substring(0,4)})` : this.data.title

        text.appendChild(title)

        let genres = document.createElement('div')
        genres.className = 'DV_genres'
        this.data.genres.map((genre)=>{genres.appendChild(this.createGenre(genre.name))})
        text.appendChild(genres)
        return text
    }

    createGenre(text)
    {
        let genre = document.createElement('span')
        genre.className = 'DV_genre'
        genre.innerText = text
        return genre
    }

    createSecondDiv()
    {
        let description = document.createElement('div')
        description.className = 'DV_description'
        description.innerHTML = `Overview:<br> ${this.data.overview}`

        let moreInfo = document.createElement('div')
        moreInfo.className = 'DV_moreInfo'
        moreInfo.innerText = `Budget: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.data.budget)}`

        let secondDiv = document.createElement('div')
        secondDiv.className = 'DV_secondDiv'
        secondDiv.appendChild(description)
        secondDiv.appendChild(moreInfo)

        return secondDiv
    }
}