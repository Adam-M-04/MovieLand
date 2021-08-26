class Homepage
{
    constructor(appRef)
    {
        this.appRef = appRef
        this.data = 
        {
            trending: {
                'movie': null, 'tv': null
            },
            upcoming: {
                'movie': null, 'tv': null
            }
        }
        this.today = new Intl.DateTimeFormat('en-US').format(new Date())

        this.get_data('trending', 'movie', `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`)
        this.get_data('trending', 'tv', `https://api.themoviedb.org/3/trending/tv/day?api_key=${apiKey}`)
        this.get_data('upcoming', 'movie', `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&region=us`)
        this.get_data('upcoming', 'tv', `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}`)
    }

    createResultContainer(data, types, names, title)
    {
        let popularContainer = createSlidersWithSwitcher(false, data, types, names)
        popularContainer.prepend(createHeader(title))
        return popularContainer
    }
    
    get_data(name, media_type, fetch_url)
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
        fetch_data(fetch_url, this, media_type, {'search_phrase': null, 'fetch_name': name})
    }

    setResult(result, type, name, set_date = true)
    {
        if(set_date)
        {
            result.date = this.today
            localStorage.setItem(name.fetch_name+'_'+type+'s', JSON.stringify(result))
        }
        this.data[name.fetch_name][type] = result
        if(this.data.trending.movie !== null && this.data.trending.tv !== null && this.data.upcoming.movie !== null && this.data.upcoming.tv !== null)
        {
            this.trendingContainer = this.createResultContainer([this.data.trending.movie.results, this.data.trending.tv.results], ['movie','tv'],
                ['Movies', 'TV shows'], "TRENDING")
            this.upcomingContainer = this.createResultContainer([this.data.upcoming.movie.results, this.data.upcoming.tv.results], ['movie','tv'],
                ['Movies', 'TV shows'], "LATEST")

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
        this.appRef.content.contentDIV.appendChild(this.trendingContainer)
        this.appRef.content.contentDIV.appendChild(this.upcomingContainer)
    }

}