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
        if(this.type === 'movie') this.details = new MovieDetails(this, this.data)
    }

    createProductionCountries()
    {

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