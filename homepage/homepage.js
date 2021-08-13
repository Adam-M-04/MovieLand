class Homepage
{
    constructor(appRef)
    {
        this.appRef = appRef
        this.data = 
        {
            popular: {
                'movie': null, 'tv': null
            },
            top_rated: {
                'movie': null, 'tv': null
            }
        }
        this.today = new Intl.DateTimeFormat('en-US').format(new Date())

        this.get_data('popular', 'movie')
        this.get_data('popular', 'tv')
        this.get_data('top_rated', 'movie')
        this.get_data('top_rated', 'tv')
    }

    createResultContainer(data, types, names, title)
    {
        let popularContainer = createSlidersWithSwitcher(data, types, names)

        let text = document.createElement('h2')
        text.innerHTML = '<br>'+title
        popularContainer.prepend(text)
        return popularContainer
    }
    
    get_data(name, media_type)
    {
        let item = JSON.parse(localStorage.getItem(`${name}_${media_type}s`))
        if(item)
        {
            if(item.date === this.today)
            {
                this.setResult(item, media_type, {'fetch_name': name}, false)
                return
            }
        }
        fetch_data(`https://api.themoviedb.org/3/${media_type}/${name}?api_key=${apiKey}`, this, media_type, {'search_phrase': null, 'fetch_name': name})
    }

    setResult(result, type, name, set_date = true)
    {
        if(set_date)
        {
            result.date = this.today
            localStorage.setItem(name.fetch_name+'_'+type+'s', JSON.stringify(result))
        }
        this.data[name.fetch_name][type] = result
        if(this.data.popular.movie !== null && this.data.popular.tv !== null && this.data.top_rated.movie !== null && this.data.top_rated.tv !== null)
        {
            this.popularContainer = this.createResultContainer([this.data.popular.movie.results, this.data.popular.tv.results], ['movie','tv'],
                ['Movies', 'TV shows'], "Popular")
            this.topRatedContainer = this.createResultContainer([this.data.top_rated.movie.results, this.data.top_rated.tv.results], ['movie','tv'],
                ['Movies', 'TV shows'], "Top Rated")

            this.showResult()
        }
    }

    showMessage(message)
    {
        console.log(message)
    }

    showResult()
    {
        this.appRef.content.contentDIV.innerHTML = ''
        this.appRef.content.contentDIV.appendChild(this.popularContainer)
        this.appRef.content.contentDIV.appendChild(this.topRatedContainer)
    }

}