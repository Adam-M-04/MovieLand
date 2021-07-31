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

    create_input()
    {
        this.input = document.createElement('input')
        this.input.className = 'search_input'
        this.input.placeholder = 'Search'
        this.input.type = "text"
        this.input.maxLength = 50
        this.input.onkeydown = (e)=>{if(e.code==='Enter'|| e.key === 'Enter'){this.input.blur();this.search(this.input.value)}}
    }

    create_filter()
    {
        this.filtersContainer = document.createElement('div')
        this.filtersContainer.className = 'filters_container'
        this.filter = new Filter('Filter', ['Movies', 'TV Shows', 'People', 'All'], 3);
        this.filtersContainer.appendChild(this.filter.filter)
    }

    create()
    {
        let cover = document.createElement('div')
        cover.className = 'cover'

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

        this.cover = cover
    }

    search(search_phrase)
    {
        let option = this.getOption()
        if(search_phrase !== this.app.content.pages_selector.current_query || option !== this.app.content.pages_selector.current_option){
            this.app.content.contentDIV.innerHTML = 'Loading...'
            fetch_data(`https://api.themoviedb.org/3/search/${option}?api_key=${apiKey}&query=${search_phrase}`, option, this.app.content)
            this.app.content.pages_selector.current_query = search_phrase
            this.app.content.pages_selector.current_option = option
        }
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