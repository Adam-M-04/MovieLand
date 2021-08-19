class Card
{
    constructor(type, data, contentRef, minimal = false)
    {
        this.contentRef = contentRef
        if(type === 'multi') this.type = data.media_type
        else this.type = type;
        this.data = data;
        this.minimal = minimal

        this.card = document.createElement('div')
        this.card.className = "card"
        if(!minimal) this.createDescription()
        this.createPoster()
        this.createText()
        if((type === 'movie' || type === 'tv') && !minimal) this.card.appendChild(createVoteContainer(this.data.vote_count, this.data.vote_average))
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
        this.poster.onclick = ()=>{this.showDetailedView()}
        this.poster.onerror = ()=>{this.poster.onerror = null; this.poster.src = `../img/default_${this.type === 'person' ? 'person.svg' : 'movie_poster.png'}`}
        this.card.appendChild(this.poster)
    }

    createText()
    {
        let text = document.createElement('div')
        text.className = this.minimal ? 'card_text_minimal' : 'card_text'
        text.innerHTML = this.getText()
        text.title = this.getTextTitle()
        text.onclick = ()=>{this.showDetailedView()}
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
        if(this.type === 'season')
        {
            return `<b>Air date: ${this.data.air_date}</b><br> ${this.data.overview}`
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
                `https://image.tmdb.org/t/p/w185${this.data.profile_path}` : '../img/default_person.svg'
        }
        return (this.data.poster_path !== null) ? `https://image.tmdb.org/t/p/w185${this.data.poster_path}` : '../img/default_movie_poster.png'
    }

    getRole()
    {
        if(this.data.character) return this.data.character
        if(this.data.job) return this.data.job
        if(this.data.roles) return this.getRoleArrayToString(this.data.roles, 'character') + 
            (this.data.total_episode_count ? ` - <i>${this.data.total_episode_count} episode${this.data.total_episode_count>1?'s':''}</i>` : '')
        if(this.data.jobs) return this.getRoleArrayToString(this.data.jobs, 'job')
        return '?'
    }

    getRoleArrayToString(arr, name)
    {
        let returnVal = ''
        for(let i in arr)
        {
            returnVal += arr[i][name] + (i < arr.length-1 ? ', ' : '')
        }
        return returnVal ? returnVal : '?'
    }

    getText()
    {
        if(this.minimal) 
            return '<b>'+(this.type === 'movie' ? this.data.title : this.data.name) + this.getDate() + '</b>' + '<br>(' + this.getRole() + ')'
        if(this.type === 'season') return this.data.name + '<br>Episodes: ' + this.data.episode_count
        return (this.type === 'movie' ? this.data.title : this.data.name) + this.getDate()
    }

    getTextTitle()
    {
        if(this.minimal) return (this.type === 'movie' ? this.data.title : this.data.name) + this.getDate() + ' - ' + this.getRole().replace(/<\/?[^>]+(>|$)/g, "")
        if(this.type === 'season') return this.data.name + ' (' + this.data.episode_count + ` episode${this.data.episode_count>1?'s':''})`
        return this.getText()
    }

    showInfo()
    {
        this.poster.style.height = (this.poster.style.height === '0px') ? '270px' : '0px'
    }

    showDetailedView()
    {
        if(this.type === 'season') this.contentRef.showDetailedView(this.type, this.data.tv_id, this.data.season_number)
        else this.contentRef.showDetailedView(this.type, this.data.id)
    }

}