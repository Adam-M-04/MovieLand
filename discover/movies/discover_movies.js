class Discover_movies {
    constructor(contentRef)
    {
        this.contentRef = contentRef
        this.container = document.createElement('div')
        this.container.className = 'discover_container'
        this.container.appendChild(createHeader('EXPLORE MOVIES'))
        
        this.filters = new Filters(this.container, this)
        this.movies = null

        this.result_container = document.createElement('div')
        this.result_container.className = 'discover_result_container'
        this.container.appendChild(this.result_container)

        fetch_data(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1`, this, 'movies', JSON.stringify(this.filters.filters_values))
        this.showResult()
    }

    setResult(result, type, filters)
    {
        if(filters === JSON.stringify(this.filters.filters_values)){
            this.movies = result
            this.updateResult()
        }
    }

    showResult()
    {
        this.contentRef.contentDIV.innerHTML = ''
        this.contentRef.app.mainInput.hide()
        this.contentRef.contentDIV.appendChild(this.container)
    }

    showMessage(err)
    {
        console.log(err)
    }

    updateResult()
    {
        this.result_container.innerHTML = ''
        for(let movie of this.movies.results)
        {
            let card = new Card('movie', movie, this.contentRef)
            this.result_container.appendChild(card.card)
        }
    }

    update(filters)
    {
        if(filters == JSON.stringify(this.filters.filters_values))
        {
            fetch_data(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=1${this.getFiltersValues()}`, this, 'movies', filters)
        }
    }

    getFiltersValues()
    {
        let filter_values = this.filters.filters_values
        let sort_by_names = ['popularity', 'primary_release_date', 'revenue', 'original_title', 'vote_average', 'vote_count']
        let filters = '&sort_by=' + sort_by_names[this.filters.sort_by_filter.option] + '.' + filter_values.sort_order
        if(filter_values.selected_genres.length) filters += '&with_genres=' + filter_values.selected_genres.join()
        if(filter_values.min_release_date) filters += '&primary_release_date.gte=' + filter_values.min_release_date
        if(filter_values.max_release_date) filters += '&primary_release_date.lte=' + filter_values.max_release_date
        if(filter_values.min_rating !== 0) filters += '&vote_average.gte=' + filter_values.min_rating
        if(filter_values.max_rating !== 10) filters += '&vote_average.lte=' + filter_values.max_rating
        if(filter_values.original_language) filters += '&with_original_language=' + filter_values.original_language
        if(filter_values.actors.length) filters += '&with_people=' + filter_values.actors.join()
        switch(filter_values.runtime)
        {
            case 1: filters += '&with_runtime.lte=60'; break;
            case 2: filters += '&with_runtime.gte=60&&with_runtime.lte=150'; break;
            case 3: filters += '&with_runtime.gte=150'; break;
            default: break;
        }
        return filters
    }
    
}