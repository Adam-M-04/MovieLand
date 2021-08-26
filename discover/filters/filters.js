class Filters
{
    constructor(container, parentRef)
    {
        this.parentRef = parentRef
        this.container = container
        this.createFilters()

        let arrows = createIMG('/img/menu_arrows.svg', 'show_hide_filters')
        arrows.onclick = ()=>{this.toggle(arrows, -1)}
        this.container.appendChild(arrows)

        this.filters_values = 
        {
            "sort_order": "desc",
            "selected_genres" : [],
            "min_release_date" : null,
            "max_release_date" : null,
            "min_rating": 0,
            "max_rating": 10,
            "original_language": null,
            "runtime" : 0,
            "actors": [] // Not ready yet
        }
    }

    createDateInputContainer(text)
    {
        let container = document.createElement('div')
        container.innerHTML = "<span class='filter_dates_text'>"+text+"</span>"
        container.className = 'date_input_container'
    
        let date = document.createElement('input')
        date.className = 'date_input'
        date.setAttribute('min', '1900-01-01')
        date.setAttribute('max', '2100-01-01')
        date.type = 'date'

        date.onchange = ()=>{this.handle_release_date_input(date.value, text==='FROM'?"min_release_date":"max_release_date")}

        container.appendChild(date)
        return container
    }

    createFilters()
    {
        this.sort_by_filter = new Filter("Sort by", ["Popularity", "Release date", "Revenue", "Title", "Rating", "Votes number"],0,()=>{
            let current_filters = JSON.stringify(this.filters_values)
            setTimeout(() => {
                this.parentRef.update(current_filters)
            }, 1000);
        })
        this.sort_by_filter.filter.style.width = '120px'

        let sorting_arrow = createIMG('/img/sorting_arrow.svg', 'filter_sort_by_arrow')
        sorting_arrow.title = 'Descending'
        sorting_arrow.onclick = (e)=>{e.stopPropagation(); this.handle_arrow(sorting_arrow, -90)}
        this.sort_by_filter.filter.appendChild(sorting_arrow)

        this.container.appendChild(this.sort_by_filter.filter)

        this.filters_container = document.createElement('div')
        this.filters_container.className = 'filter_container'

        this.filters_container.appendChild(this.createGenresFilter())
        this.filters_container.appendChild(this.createReleaseDateFilter()) 
        this.filters_container.appendChild(this.createRuntimeFIlter())
        this.filters_container.appendChild(this.createVotesAverageFilter())
        this.filters_container.appendChild(this.createLanguagesInput())

        this.container.appendChild(this.filters_container)
        $(this.filters_container).slideToggle(0)
    }

    createGenresFilter()
    {
        let genres_filter = document.createElement('div')
        genres_filter.className = "genres_filter"
        genres_filter.appendChild(createHeader("Genres", true))
        
        let genres_container = document.createElement("div")
        genres_container.className = "genres_container"
        for(const [key, value] of Object.entries(genresMovie))
        {
            let tmp = document.createElement('div')
            tmp.className = "genre_item"
            tmp.innerText = value
            tmp.onclick = ()=>{this.handle_genres(tmp, key)}
            genres_container.appendChild(tmp)
        }

        genres_filter.appendChild(genres_container)

        return genres_filter
    }

    createLanguagesInput()
    {
        let container = document.createElement('div')

        container.appendChild(createHeader('Original language', true))

        let input = document.createElement('input')
        input.className = 'filter_languages_input'
        input.setAttribute('list', 'Languages')
        input.onblur = ()=>{this.handle_languages_blur(input.value, input)}

        let datalist = document.createElement('datalist')
        datalist.id = 'Languages'
        for(let language of languages)
        {
            let tmp = document.createElement('option')
            tmp.value = language.English
            datalist.appendChild(tmp)
        }

        container.append(input, datalist)
        return container
    }

    createReleaseDateFilter()
    {
        let release_date_filter = document.createElement('div')
        release_date_filter.className = "release_date_filter"
        release_date_filter.appendChild(createHeader("Release date", true))

        let inputs = document.createElement('div')
        inputs.className = 'release_date_inputs_container'

        let inputs2 = document.createElement('div')
        inputs2.className = 'release_date_inputs_container2'
        inputs.appendChild(inputs2)

        inputs2.appendChild(this.createDateInputContainer("FROM"))
        inputs2.appendChild(this.createDateInputContainer("TO"))

        release_date_filter.appendChild(inputs)

        return release_date_filter
    }

    createRuntimeFIlter()
    {
        let container = document.createElement('div')
        container.appendChild(createHeader('Runtime'))
        container.className = 'filter_runtime_container'

        let options = ["<b>ALL</b>","<b>SHORT</b> ( 0 - 60 minutes )","<b>NORMAL</b> ( 60 - 150 minutes )","<b>LONG</b> ( 150+ minutes )"]

        for(let i in options)
        {
            i = parseInt(i)
            let tmp = document.createElement('div')
            tmp.innerHTML = options[i]
            tmp.className = 'filter_runtime_option'
            tmp.onclick = ()=>{this.handleRuntime(tmp, i)}
            if(!i) tmp.setAttribute('selected', 'true')
            container.appendChild(tmp) 
        }
        return container
    }

    createRuntimeFIlterOption(main, description = null)
    {
        let tmp = document.createElement('div')
        if(description !== null) tmp.innerHTML = `<div class='filter_runtime_title'>${options[i]}</div>`
        tmp.innerHTML = `<div class='filter_runtime_title_full'>${options[i]}</div>`
    }

    createStarContainer(className, val, input)
    {
        let span = document.createElement('span')
        span.className = 'filter_star_container'
        let val_container = document.createElement('div')
        val_container.className = 'filter_star_value_container'
        val_container.innerText = val
        span.appendChild(val_container)
        let star = createIMG('/img/star.svg', className)
        span.onclick = ()=>{this.handle_rating_click(input, val==='10.0'?'max':'min', val_container)}
        span.appendChild(star)
        return span
    }

    createVotesAverageFilter()
    {
        let container = document.createElement('div')
        container.className = 'vote_average_filter'
        container.appendChild(createHeader('Rating', true))

        let stars_container = document.createElement('div')
        stars_container.className = 'vote_average_stars_container'

        let input = document.createElement('input')
        input.setAttribute('type', 'range')
        input.setAttribute('min', '0')
        input.setAttribute('max', '10')
        input.setAttribute('step', '0.5')
        input.setAttribute('hide', 'true')
        input.className = 'vote_average_filter_input'

        let stars = [
            this.createStarContainer('vote_average_minimum_star', '0.0', input),
            this.createStarContainer('vote_average_maximum_star', '10.0', input)
        ]
        stars_container.append(
            stars[0],
            ' - ',
            stars[1]
        )

        input.oninput = ()=>{this.handle_rating_change(input, stars)}

        container.appendChild(stars_container)
        container.appendChild(input)
        return container
    }

    handle_arrow(arrow, degrees)
    {
        this.filters_values.sort_order = degrees === -90 ? 'asc': 'desc'
        arrow.title = degrees === -90 ? 'Ascending' : 'Descending'
        arrow.style.transform = 'rotate(' + degrees + 'deg)'
        arrow.onclick = (e)=>{e.stopPropagation();this.handle_arrow(arrow, degrees===90?-90:90)}
        let current_filters = JSON.stringify(this.filters_values)
        setTimeout(() => {
            this.parentRef.update(current_filters)
        }, 1000);
    }

    handle_genres(item, key)
    {
        if(item.getAttribute('selected'))
        {
            item.removeAttribute('selected')
            for(let i in this.filters_values.selected_genres)
            {
                if(this.filters_values.selected_genres[i] === key)
                { 
                    this.filters_values.selected_genres.splice(i, 1)
                    let current_filters = JSON.stringify(this.filters_values)
                    setTimeout(() => {
                        this.parentRef.update(current_filters)
                    }, 1000);
                    return 
                }
            }
        }
        else
        {
            item.setAttribute('selected', 'true')
            this.filters_values.selected_genres.push(key)
        }
        let current_filters = JSON.stringify(this.filters_values)
        setTimeout(() => {
            this.parentRef.update(current_filters)
        }, 1000);
    }

    handle_languages_blur(value, input)
    {
        let tmp = this.filters_values.original_language
        this.filters_values.original_language = null
        if(value === '') {input.style.borderColor = '#FCA311'; return}
        for(let language of languages)
        {
            if(language.English === value)
            {
                this.filters_values.original_language = language.alpha2
                input.style.borderColor = '#FCA311'
                if(tmp !== language.alpha2) 
                {
                    let current_filters = JSON.stringify(this.filters_values)
                    setTimeout(() => {
                        this.parentRef.update(current_filters)
                    }, 1000);
                }
                return
            }
        }
        input.style.borderColor = 'red'
    }

    handle_rating_change(input, stars)
    {
        let name = input.getAttribute('mode') === 'min' ? 'min_rating' : 'max_rating'
        if(name)
        {
            let update = true
            if(name === 'min_rating')if(input.value > this.filters_values['max_rating']) {input.value = this.filters_values['max_rating'];update = false}
            if(name === 'max_rating')if(input.value < this.filters_values['min_rating']) {input.value = this.filters_values['min_rating'];update = false}
            this.filters_values[name] = parseFloat(input.value)
            stars[name==='min_rating'?0:1].childNodes[0].innerText = parseFloat(input.value).toFixed(1)

            if(!update) return
            let current_filters = JSON.stringify(this.filters_values)
            setTimeout(() => {
                this.parentRef.update(current_filters)
            }, 1000);
        }
    }

    handle_rating_click(input, type, value_container)
    {
        if(input.getAttribute('hide') === 'true')
        {
            input.setAttribute('hide', 'false')
        }
        else if(input.getAttribute('hide') === 'false' && input.getAttribute('mode') === type)
        {
            input.setAttribute('hide', 'true')
        }
        input.setAttribute('mode', type)
        input.value = parseFloat(value_container.innerText)
    }

    handle_release_date_input(value, type)
    {
        if(value == this.filters_values[type]) return
        this.filters_values[type] = value ? value : null

        let current_filters = JSON.stringify(this.filters_values)
        setTimeout(() => {
            this.parentRef.update(current_filters)
        }, 1000);
    }

    handleRuntime(elmnt,num)
    {
        if(num == this.filters_values.runtime) return
        document.getElementsByClassName('filter_runtime_option')[this.filters_values.runtime].removeAttribute('selected')
        this.filters_values.runtime = num
        elmnt.setAttribute('selected', 'true')

        let current_filters = JSON.stringify(this.filters_values)
        setTimeout(() => {
            this.parentRef.update(current_filters)
        }, 1000);
    }

    toggle(arrows, state)
    {
        $(this.filters_container).slideToggle(300)
        setTimeout(() => {
            $(arrows).css({transform: 'scale(1,'+state+')'})
        }, 280);
        arrows.onclick = ()=>{this.toggle(arrows, state === 1 ? -1 : 1)}
    }
}