class Input
{
    constructor(app)
    {
        this.isVisible = false
        this.app = app
        this.create()
        this.create_filter()
        this.show()
    }

    create()
    {
        let cover = document.createElement('div')
        cover.className = 'cover'

        this.snippets_results_container = document.createElement('div')
        this.snippets_results_container.className = 'snippets_results_container'

        let inputContainer = document.createElement('div')
        inputContainer.className = 'inputContainer'
        
        let insideContainer = document.createElement('div')
        insideContainer.className = 'inside_container'

        let insideContainer2 = document.createElement('div')
        insideContainer2.className = 'inside_container icon_cover'

        this.create_input()

        let button = document.createElement('button')
        button.onclick = (e)=>{this.search(this.input.value)}
        button.className = 'submit'

        let searchIcon1 = document.createElement('div')
        searchIcon1.className = 'search_icon1'

        let searchIcon2 = document.createElement('span')
        searchIcon2.className = 'search_icon2'

        button.appendChild(searchIcon1)
        button.appendChild(searchIcon2)
        insideContainer2.appendChild(button)
        insideContainer.appendChild(this.input)
        inputContainer.appendChild(insideContainer)
        inputContainer.appendChild(insideContainer2)
        cover.appendChild(inputContainer)
        cover.appendChild(this.snippets_results_container)

        this.cover = cover
    }

    create_filter()
    {
        this.filtersContainer = document.createElement('div')
        this.filtersContainer.className = 'filters_container'
        this.filter = new Filter('Filter', ['Movies', 'TV Shows', 'People', 'All'], 3,()=>{
            if(this.input.value) fetch_data(`https://api.themoviedb.org/3/search/${this.getOption()}?api_key=${apiKey}&query=${this.input.value}`, this, this.getOption(), this.input.value)
        });
        this.filtersContainer.appendChild(this.filter.filter)
    }

    create_input()
    {
        this.input = document.createElement('input')
        this.input.className = 'search_input'
        this.input.placeholder = 'Search'
        this.input.type = "text"
        this.input.maxLength = 50
        this.input.onkeydown = (e)=>{if(e.code==='Enter'|| e.key === 'Enter'){this.input.blur();this.search(this.input.value)}}
        this.input.ondblclick = ()=>{this.input.value = '';this.snippets_results_container.innerHTML=''}
        this.input.oninput = ()=>{
            let tmp = this.input.value
            if(tmp==='') {this.snippets_results_container.innerHTML='';return}
            setTimeout(() => {
                if(tmp === this.input.value)
                {
                    fetch_data(`https://api.themoviedb.org/3/search/${this.getOption()}?api_key=${apiKey}&query=${tmp}`, this, this.getOption(), tmp)
                }
            }, 300);
        }
        this.input.onfocus = ()=>{
            $("body > *:not(.cover)").addClass("blurred")
            $(this.snippets_results_container).slideDown(150)
        }
        this.input.onblur = ()=>{
            $("body > *:not(.cover)").removeClass("blurred")
            $(this.snippets_results_container).slideUp(150)
        }
    }

    create_snippet_cell(data, type)
    {
        let cell = document.createElement('div')
        cell.className = 'snippets_result_element'
        let text = document.createElement("div")
        switch(type)
        {
            case "person":
                if(data.profile_path!==null)
                {
                    cell.appendChild(createIMG(`https://image.tmdb.org/t/p/w185${data.profile_path}`,"input_snippet_image"))
                }
                text.className = "input_snippet_text"
                text.innerHTML = data.name
                text.innerHTML += `<br><span>Person${this.getKnownForCredits(data.known_for.slice(0,3))}</span>`
                cell.appendChild(text)
                break
            case "tv":
                if(data.poster_path!==null)
                {
                    cell.appendChild(createIMG(`https://image.tmdb.org/t/p/w92${data.poster_path}`,"input_snippet_image"))
                }
                text.className = "input_snippet_text"
                text.innerHTML = data.name
                if(data.first_air_date) text.innerHTML += ' ('+data.first_air_date.slice(0,4)+')'
                text.innerHTML += `<br><span>TV show${this.getGenres(data.genre_ids, genresShow)}</span>`
                cell.appendChild(text)
                break
            case "movie":
                if(data.poster_path!==null)
                {
                    cell.appendChild(createIMG(`https://image.tmdb.org/t/p/w92${data.poster_path}`,"input_snippet_image"))
                }
                text.className = "input_snippet_text"
                text.innerHTML = data.title
                if(data.release_date) text.innerHTML += ' ('+data.release_date.slice(0,4)+')'
                text.innerHTML += `<br><span>Movie${this.getGenres(data.genre_ids, genresMovie)}</span>`
                cell.appendChild(text)
                break
        }
        cell.onmousedown = ()=>{
            let tmp = window.pageYOffset
            this.app.history.push(new Detailed_view(type, data.id, this.app.content), tmp)
            $('html,body').scrollTop(0);
        }
        return cell
    }

    getGenres(arr, genres)
    {
        if(arr.length === 0) return ""
        let toReturn = ' - '
        for(let genre in arr)
        {
            toReturn += genres[arr[genre]] + (genre < arr.length-1 ? ', ' : '')
        }
        return toReturn
    }

    getKnownForCredits(arr)
    {
        if(arr.length === 0) return ""
        let toReturn = ' - '
        for(let i in arr)
        {
            toReturn += (arr[i].media_type==='tv'?arr[i].name:arr[i].title) + (i < arr.length-1 ? ', ' : '')
        }
        return toReturn
    }

    getOption()
    {
        switch(this.filter.options[this.filter.option])
        {
            case 'Movies': return 'movie'
            case 'TV Shows': return 'tv'
            case 'People': return 'person'
            default: return 'multi'
        }
    }

    hide()
    {
        if(this.isVisible)
        {
            this.cover.remove()
            this.filtersContainer.remove()
            this.isVisible = false
        }
    }

    search(search_phrase, page = 1)
    {
        if(search_phrase.length === 0)
        {
            this.input.placeholder = 'Type any character'
            setTimeout(() => {
                this.input.placeholder = 'Search'
            }, 5000);
            return
        }
        let option = this.getOption()
        if(search_phrase !== this.app.content.result.query || option !== this.app.content.result.option || page !== this.app.content.result.data.page){
            this.app.content.contentDIV.innerHTML = '<img src="/img/loading.svg">'
            fetch_data(`https://api.themoviedb.org/3/search/${option}?api_key=${apiKey}&query=${encodeURIComponent(search_phrase)}&page=${page}`, 
                this.app.content, option, {'search_phrase':search_phrase, 'fetch_name': null})
        }
    }

    setResult(data, type, query_val)
    {
        if(query_val !== this.input.value) return
        this.snippets_results_container.innerHTML = ''
        for(let elmnt of data.results.slice(0,5))
        {
            this.snippets_results_container.appendChild(this.create_snippet_cell(elmnt,type==='multi'?elmnt.media_type:type))
        }
    }

    showMessage(){
        this.snippets_results_container.innerHTML = ''
        let tmp = document.createElement('div')
        tmp.className = 'snippets_result_element'
        tmp.innerText = "No results"
        tmp.style.cursor = 'default'
        this.snippets_results_container.appendChild(tmp)
    }
  
    show()
    {
        if(!this.isVisible)
        {
            document.body.prepend(this.filtersContainer)
            document.body.prepend(this.cover)
            this.isVisible = true
        } 
    }

}