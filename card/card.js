class Card
{
    constructor(type, data, app)
    {
        this.app = app
        this.type = type;
        this.data = data;

        this.card = document.createElement('div')
        this.card.className = "card"
        this.createDescription()
        this.createPoster()
        this.createText()
        if(type !== 'person') this.createVoteContainer()
        this.createInfoIcon()
        
    }

    createPoster()
    {
        this.poster = createIMG(this.getPosterSRC(), 'poster')
        this.poster.onclick = ()=>{app.content.showDetailedView(this.type, this.data.id)}
        this.card.appendChild(this.poster)
    }

    createText()
    {
        let text = document.createElement('div')
        text.className = 'card_text'
        text.innerText = this.getText()
        text.title = this.getText()
        text.onclick = ()=>{app.content.showDetailedView(this.type, this.data.id)}
        this.card.appendChild(text)
    }

    createDescription()
    {
        let descr = document.createElement('div')
        descr.className = 'description'
        descr.innerHTML = this.getDescriptionContent()
        descr.title = this.data.overview
        this.card.appendChild(descr)
    }

    getDescriptionContent()
    {
        if(this.type === 'movie')
        {
            return `<b>Movie - ${this.getGenres(this.data.genre_ids, genresMovie)}</b><br><i>${this.data.overview}</i>`
        }
        if(this.type === 'tv')
        {
            return `<b> TV Show - ${this.getGenres(this.data.genre_ids, genresShow)}</b><br><i>${this.data.overview}</i>`
        }
        if(this.type === 'person')
        {
            let toReturn = `Known for (${this.data.known_for_department}): <br>`
            for(let i of this.data.known_for)
            {
                toReturn += `- <i>${i.title !== undefined ? i.title : i.name} ${this.getDate(i)}</i><br>`
            }
            return toReturn
        }
    }

    getGenres(arr, genres)
    {
        let toReturn = ''
        for(let genre in arr)
        {
            toReturn += genres[arr[genre]] + (genre < arr.length-1 ? ', ' : '')
        }
        return toReturn
    }

    createVoteContainer(){
        let votes = document.createElement('div')
        votes.className = 'voteContainer'
        votes.title = `Votes: ${this.data.vote_count} | average: ${this.data.vote_average.toFixed(1)}/10`

        let star = createIMG('../img/star.svg', 'votes_star')
        votes.appendChild(star)

        let number = document.createElement('span')
        number.innerText = this.data.vote_average.toFixed(1)
        votes.appendChild(number)

        this.card.appendChild(votes)
    }

    createInfoIcon()
    {
        let info = createIMG('../img/info.svg', 'info_icon')
        info.onclick = ()=>{this.showInfo(this)}
        this.card.appendChild(info)
    }

    showInfo(cardRef)
    {
        cardRef.poster.style.height = (cardRef.poster.style.height === '0px') ? '270px' : '0px'
    }

    getText()
    {
        return (this.type === 'movie' ? this.data.title : this.data.name) + this.getDate() 
    }

    getDate(data = this.data)
    {
        if(data.release_date !== undefined)
        {
            if(data.release_date.length > 0)
            return ` (${data.release_date.substring(0,4)})`
        }
        if(data.first_air_date !== undefined) 
        {
            if(data.first_air_date.length > 0)
            return ` (${data.first_air_date.substring(0,4)})`
        }
        return ''
    }

    getPosterSRC()
    {
        if(this.type === 'person')
        {
            return (this.data.profile_path !== null) ? 
                `https://image.tmdb.org/t/p/w500${this.data.profile_path}` : '../img/default_person.svg'
        }
        return (this.data.poster_path !== null) ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : '../img/default_movie_poster.png'
    }
}