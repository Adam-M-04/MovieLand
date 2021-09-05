class Discover_tvs {
    constructor(contentRef)
    {
        this.contentRef = contentRef
        this.container = document.createElement('div')
        this.container.className = 'discover_container'
        this.container.appendChild(createHeader('EXPLORE TV SHOWS'))
        
        this.filters = new Filters(this.container, this, 'tv')
        this.tvs = null

        this.result_container = document.createElement('div')
        this.result_container.className = 'discover_result_container'
        this.container.appendChild(this.result_container)

        let tmp = JSON.stringify(this.filters.filters_values)
        this.pages_selector = new Pages_selector(this.result_container, (page)=>{
            this.update(tmp, page)
        })

        fetch_data(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=1`, this, 'tvs', 
            {"filters":JSON.stringify(this.filters.filters_values), "reset_pages": true})
        this.showResult()
    }

    setResult(result, type, more)
    {
        let tmp = JSON.stringify(this.filters.filters_values)
        if(more.reset_pages) 
        {
            this.pages_selector.search_function = (page)=>{
                this.update(tmp, page)
            }
        }
        if(more.filters === tmp){
            this.tvs = result
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
        this.result_container.innerHTML = `<h2>${err}</h2>`
    }

    updateResult()
    {
        this.result_container.innerHTML = ''
        for(let tv of this.tvs.results)
        {
            let card = new Card('tv', tv, this.contentRef)
            this.result_container.appendChild(card.card)
        }
        this.pages_selector.setNumberOfPages(this.tvs.total_pages)
        this.pages_selector.setPage(this.tvs.page)
        this.pages_selector.show()
    }

    update(filters, page = '1')
    {
        if(filters == JSON.stringify(this.filters.filters_values))
        {
            this.result_container.innerHTML = '<img src="/img/loading.svg">'
            fetch_data(`https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&page=${page}${this.getFiltersValues()}`, this, 'tvs', 
            {"filters":filters, "reset_pages": typeof(page) === "string"})
        }
    }

    getFiltersValues()
    {
        let filter_values = this.filters.filters_values
        let sort_by_names = ['popularity', 'first_air_date','vote_average']
        let filters = '&sort_by=' + sort_by_names[this.filters.sort_by_filter.option] + '.' + filter_values.sort_order
        if(filter_values.selected_genres.length) filters += '&with_genres=' + filter_values.selected_genres.join()
        if(filter_values.min_release_date) filters += '&first_air_date.gte=' + filter_values.min_release_date
        if(filter_values.max_release_date) filters += '&first_air_date.lte=' + filter_values.max_release_date
        if(filter_values.minimal_votes !== 0) filters += '&vote_count.gte=' + filter_values.minimal_votes
        if(filter_values.min_rating !== 0) filters += '&vote_average.gte=' + filter_values.min_rating
        if(filter_values.max_rating !== 10) filters += '&vote_average.lte=' + filter_values.max_rating
        if(filter_values.original_language) filters += '&with_original_language=' + filter_values.original_language
        if(filter_values.actors.length) filters += '&with_people=' + filter_values.actors.join()
        return filters
    }
}