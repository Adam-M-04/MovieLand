class Card
{
    constructor(type, data, contentRef, minimal = false)
    {
        this.contentRef = contentRef
        this.type = type;
        this.data = data;
        this.minimal = minimal

        this.card = document.createElement('div')
        this.card.className = "card"
        if(!minimal) this.createDescription()
        this.createPoster()
        this.createText()
        if(type !== 'person' && !minimal) this.createVoteContainer()
        if(!minimal) this.createInfoIcon()
        
    }

    createDescription()
    {
        let descr = document.createElement('div')
        descr.className = 'description'
        descr.innerHTML = this.getDescriptionContent()
        descr.title = this.data.overview
        this.card.appendChild(descr)
    }

    createInfoIcon()
    {
        let info = createIMG('../img/info.svg', 'info_icon')
        info.onclick = ()=>{this.showInfo()}
        this.card.appendChild(info)
    }

    createPoster()
    {
        this.poster = createIMG(this.getPosterSRC(), 'poster')
        this.poster.onclick = ()=>{this.contentRef.showDetailedView(this.type, this.data.id)}
        this.card.appendChild(this.poster)
    }

    createText()
    {
        let text = document.createElement('div')
        text.className = this.minimal ? 'card_text_minimal' : 'card_text'
        text.innerHTML = this.getText()
        text.title = this.getTextTitle()
        text.onclick = ()=>{this.contentRef.showDetailedView(this.type, this.data.id)}
        this.card.appendChild(text)
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

    getPosterSRC()
    {
        if(this.type === 'person')
        {
            return (this.data.profile_path !== null) ? 
                `https://image.tmdb.org/t/p/w500${this.data.profile_path}` : '../img/default_person.svg'
        }
        return (this.data.poster_path !== null) ? `https://image.tmdb.org/t/p/w500${this.data.poster_path}` : '../img/default_movie_poster.png'
    }

    getText()
    {
        if(this.minimal) return '<i>'+(this.type === 'movie' ? this.data.title : this.data.name) + this.getDate() + '</i>' + 
                '<br>(' + (this.data.character ? this.data.character : '?') + ')'
        return (this.type === 'movie' ? this.data.title : this.data.name) + this.getDate() 
    }

    getTextTitle()
    {
        if(this.minimal) return (this.type === 'movie' ? this.data.title : this.data.name) + this.getDate() + 
                ' - ' + (this.data.character ? this.data.character : '?')
        return this.getText()
    }

    showInfo()
    {
        this.poster.style.height = (this.poster.style.height === '0px') ? '270px' : '0px'
    }

}