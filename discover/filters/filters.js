class Filters
{
    constructor(container, parentRef, type)
    {
        this.parentRef = parentRef
        this.container = container
        this.type = type
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
            "minimal_votes": 0,
            "min_rating": 0,
            "max_rating": 10,
            "original_language": null,
            "runtime" : 0,
            "actors": []
        }
    }

    clear()
    {
        this.sort_order_arrow.reset()
        for(let filter of this.filters_array) filter.reset()
        this.parentRef.update(JSON.stringify(this.filters_values))
    }

    createFilters()
    {
        this.sort_by_filter = new Filter(
            "Sort by",
            this.type === 'tv' ? ["Popularity", "Air date", "Rating"] : ["Popularity", "Release date", "Revenue", "Title", "Rating", "Votes number"],
            0,
            ()=>{
                let current_filters = JSON.stringify(this.filters_values)
                setTimeout(() => {
                    this.parentRef.update(current_filters)
                }, 1000);
        })
        this.sort_by_filter.filter.style.width = '120px'
        this.sort_order_arrow = new Arrow_filter(this)
        this.sort_by_filter.filter.appendChild(this.sort_order_arrow.sorting_arrow)

        let reset_img = createIMG('/img/clear_icon.svg', 'clear_filters_icon')
        reset_img.onclick = (e)=>{e.stopPropagation(); this.clear()}
        this.sort_by_filter.filter.prepend(reset_img)

        this.container.appendChild(this.sort_by_filter.filter)
        this.filters_container = document.createElement('div')
        this.filters_container.className = 'filter_container'

        this.filters_array = 
            this.type === 'tv' ? 
                [
                    new Genres_filter(this), 
                    new Release_date_filter(this),
                    new Minimal_votes(this),
                    new Rating_filter(this),
                    new Languages_filter(this)
                ]
            :
                [
                    new Genres_filter(this), 
                    new Release_date_filter(this),
                    new Runtime_filter(this),
                    new Minimal_votes(this),
                    new Rating_filter(this),
                    new Languages_filter(this),
                    new People_input(this)
                ]

        for(let filter of this.filters_array) this.filters_container.appendChild(filter.container)

        this.container.appendChild(this.filters_container)
        $(this.filters_container).slideToggle(0)
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

class Arrow_filter {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.sorting_arrow = createIMG('/img/sorting_arrow.svg', 'filter_sort_by_arrow')
        this.sorting_arrow.title = 'Descending'
        this.sorting_arrow.onclick = (e)=>{e.stopPropagation(); this.handle_arrow(-90)}
    }

    handle_arrow(degrees)
    {
        this.filtersRef.filters_values.sort_order = degrees === -90 ? 'asc': 'desc'
        this.sorting_arrow.title = degrees === -90 ? 'Ascending' : 'Descending'
        this.sorting_arrow.style.transform = 'rotate(' + degrees + 'deg)'
        this.sorting_arrow.onclick = (e)=>{e.stopPropagation();this.handle_arrow(degrees===90?-90:90)}
        let current_filters = JSON.stringify(this.filtersRef.filters_values)
        setTimeout(() => {
            this.filtersRef.parentRef.update(current_filters)
        }, 1000);
    }

    reset()
    {
        this.filtersRef.filters_values.sort_order = 'desc'
        this.sorting_arrow.title = 'Descending'
        this.sorting_arrow.style.transform = 'rotate(90deg)'
        this.sorting_arrow.onclick = (e)=>{e.stopPropagation();this.handle_arrow(-90)}
    }
}

class Genres_filter {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.className = "genres_filter"
        this.container.appendChild(createHeader("Genres", true))
        
        this.genres_container = document.createElement("div")
        this.genres_container.className = "genres_container"
        
        for(const [key, value] of Object.entries(this.filtersRef.type === 'tv' ? genresShow : genresMovie))
        {
            let tmp = document.createElement('div')
            tmp.className = "genre_item"
            tmp.innerText = value
            tmp.onclick = ()=>{this.handle(tmp, key)}
            this.genres_container.appendChild(tmp)
        }

        this.container.appendChild(this.genres_container)
    }

    handle(item, key)
    {
        if(item.getAttribute('selected'))
        {
            item.removeAttribute('selected')
            for(let i in this.filtersRef.filters_values.selected_genres)
            {
                if(this.filtersRef.filters_values.selected_genres[i] === key)
                { 
                    this.filtersRef.filters_values.selected_genres.splice(i, 1)
                    let current_filters = JSON.stringify(this.filtersRef.filters_values)
                    setTimeout(() => {
                        this.filtersRef.parentRef.update(current_filters)
                    }, 1000);
                    return 
                }
            }
        }
        else
        {
            item.setAttribute('selected', 'true')
            this.filtersRef.filters_values.selected_genres.push(key)
        }
        let current_filters = JSON.stringify(this.filtersRef.filters_values)
        setTimeout(() => {
            this.filtersRef.parentRef.update(current_filters)
        }, 1000);
    }

    reset()
    {
        this.filtersRef.filters_values.selected_genres = []
        for(let genre of this.genres_container.childNodes) genre.removeAttribute('selected')
    }
}

class Languages_filter {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')

        this.container.appendChild(createHeader('Original language', true))

        this.input = document.createElement('input')
        this.input.className = 'filter_languages_input'
        this.input.setAttribute('list', 'Languages')
        this.input.onblur = ()=>{this.handle(this.input.value)}

        let datalist = document.createElement('datalist')
        datalist.id = 'Languages'
        for(let language of languages)
        {
            let tmp = document.createElement('option')
            tmp.value = language.English
            datalist.appendChild(tmp)
        }

        this.container.append(this.input, datalist)
    }

    handle(value)
    {
        let tmp = this.filtersRef.filters_values.original_language
        if(this.filtersRef.filters_values.original_language !== null && value === '')
        {
            this.filtersRef.filters_values.original_language = null
            let current_filters = JSON.stringify(this.filtersRef.filters_values)
            this.input.style.borderColor = '#FCA311'
            setTimeout(() => {
                this.filtersRef.parentRef.update(current_filters)
            }, 1000);
            return;
        }
        this.filtersRef.filters_values.original_language = null
        if(value === '') {this.input.style.borderColor = '#FCA311'; return}
        for(let language of languages)
        {
            if(language.English === value)
            {
                this.filtersRef.filters_values.original_language = language.alpha2
                this.input.style.borderColor = '#FCA311'
                if(tmp !== language.alpha2) 
                {
                    let current_filters = JSON.stringify(this.filtersRef.filters_values)
                    setTimeout(() => {
                        this.filtersRef.parentRef.update(current_filters)
                    }, 1000);
                }
                return
            }
        }
    }

    reset()
    {
        this.filtersRef.filters_values.original_language = null
        this.handle('')
        this.input.value = ""
    }
}

class Minimal_votes {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.appendChild(createHeader('Minimal votes'))

        this.result = document.createElement('div')
        this.result.className = 'filters_minimal_votes_result'
        this.result.innerText = '0+'

        this.input = document.createElement('input')
        this.input.setAttribute('type', 'range')
        this.input.setAttribute('min', '0')
        this.input.setAttribute('max', '6')
        this.input.setAttribute('step', '1')
        this.input.oninput = ()=>{this.handle(this.input.value)}
        this.input.value = 0
        this.input.className = 'filters_minimal_votes_input'
        
        this.container.appendChild(this.result)
        this.container.appendChild(this.input)
    }

    handle(val)
    {
        let options = [0,10,50,100,500,1000,5000]
        if(options[val] === this.filtersRef.filters_values.minimal_votes) return
        this.filtersRef.filters_values.minimal_votes = options[val]
        this.result.innerText = options[val] + '+'
        let current_filters = JSON.stringify(this.filtersRef.filters_values)
        setTimeout(() => {
            this.filtersRef.parentRef.update(current_filters)
        }, 1000);
    }

    reset()
    {
        this.input.value = 0
        this.result.innerText = '0+'
        this.filtersRef.filters_values.minimal_votes = 0
    }
}

class People_input {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.appendChild(createHeader('Actors'))
        this.results = document.createElement('div')
        this.results.className = 'filters_results_dropdown'
        this.selected = document.createElement('div')
        this.selected.className = 'filters_selected_actors'

        this.input = document.createElement('input')
        this.input.className = 'filters_people_input'
        this.input.type = 'text'
        this.input.maxLength = 25
        this.input.oninput = ()=>{
            let tmp = this.input.value
            setTimeout(() => {
                if(tmp === this.input.value) 
                {
                    fetch_data(`https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${tmp}`, this, 'people', tmp)
                }
            }, 500);
        }
        this.input.onblur = ()=>{$(this.results).slideUp(200)}
        this.input.onfocus = ()=>{$(this.results).slideDown(200)}

        this.container.appendChild(this.input)
        this.container.appendChild(this.results)
        this.container.appendChild(this.selected)
    }

    create_cell(data = null)
    {
        let tmp = document.createElement('div')
        tmp.className = 'filters_people_result_cell'
        if(data !== null)
        {
            tmp.innerHTML = data.name
            tmp.title = data.name
            tmp.onmousedown = ()=>{
                if(this.filtersRef.filters_values.actors.includes(data.id))
                {
                    this.removeActor(data.id)
                }
                else
                {
                    let person_cell = document.createElement('div')
                    let remove_img = createIMG('/img/close.svg', "selected_person_remove_icon")
                    remove_img.onclick = ()=>{this.removeActor(data.id)}
                    person_cell.innerText = data.name
                    person_cell.appendChild(remove_img)
                    person_cell.className = 'filters_selected_person_cell'
                    person_cell.setAttribute('actorID', data.id)
                    this.selected.appendChild(person_cell)
                    this.filtersRef.filters_values.actors.push(data.id)
                    this.results.innerHTML = ''
                    this.input.value = ''
                    let current_filters = JSON.stringify(this.filtersRef.filters_values)
                    setTimeout(() => {
                        this.filtersRef.parentRef.update(current_filters)
                    }, 1000);
                }
                
            }
            tmp.setAttribute('selected', (this.filtersRef.filters_values.actors.includes(data.id) ? 'true' : 'false'))
            tmp.setAttribute('actorID', data.id)
        }
        else
        {
            tmp.innerHTML = 'No results'
        }
        return tmp
    }

    removeActor(id)
    {
        for(let i in this.filtersRef.filters_values.actors)
        {
            if(this.filtersRef.filters_values.actors[i] == id)
            {
                this.filtersRef.filters_values.actors.splice(i,1)
                break
            }
        }
        let selected = document.querySelector(`.filters_selected_person_cell[actorID="${id}"]`)
        if(selected) selected.remove()
        let result_element = document.querySelector(`.filters_people_result_cell[actorID="${id}"]`)
        if(result_element) result_element.setAttribute('selected', 'false')
        let current_filters = JSON.stringify(this.filtersRef.filters_values)
        setTimeout(() => {
            this.filtersRef.parentRef.update(current_filters)
        }, 1000);
    }

    reset()
    {
        for(let id of this.filtersRef.filters_values.actors) 
        {
            let selected = document.querySelector(`.filters_selected_person_cell[actorID="${id}"]`)
            if(selected) selected.remove()
            let result_element = document.querySelector(`.filters_people_result_cell[actorID="${id}"]`)
            if(result_element) result_element.setAttribute('selected', 'false')
        }
        this.filtersRef.filters_values.actors = []
    }

    setResult(result, type, value)
    {
        if(value !== this.input.value) return
        this.results.innerHTML = ''
        if(!result.total_results) this.results.appendChild(this.create_cell())
        else
        {
            for(let person of result.results.slice(0,5))
            {
                this.results.appendChild(this.create_cell(person))
            }
        }
    }

    showMessage()
    {
        this.results.innerHTML = ''
        this.results.appendChild(this.create_cell())
    }
}

class Rating_filter {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
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
        span.onclick = ()=>{this.handle_rating_click(val==='10.0'?'max':'min', val_container)}
        span.appendChild(star)
        return span
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.className = 'vote_average_filter'
        this.container.appendChild(createHeader('Rating', true))

        let stars_container = document.createElement('div')
        stars_container.className = 'vote_average_stars_container'

        this.input = document.createElement('input')
        this.input.setAttribute('type', 'range')
        this.input.setAttribute('min', '0')
        this.input.setAttribute('max', '10')
        this.input.setAttribute('step', '0.5')
        this.input.setAttribute('hide', 'true')
        this.input.className = 'vote_average_filter_input'

        this.stars = [
            this.createStarContainer('vote_average_minimum_star', '0.0'),
            this.createStarContainer('vote_average_maximum_star', '10.0')
        ]
        stars_container.append(
            this.stars[0],
            ' - ',
            this.stars[1]
        )

        this.input.oninput = ()=>{this.handle_rating_change()}

        this.container.appendChild(stars_container)
        this.container.appendChild(this.input)
    }

    handle_rating_change()
    {
        let name = this.input.getAttribute('mode') === 'min' ? 'min_rating' : 'max_rating'
        if(name)
        {
            let update = true
            if(name === 'min_rating')if(this.input.value > this.filtersRef.filters_values['max_rating']) {this.input.value = this.filtersRef.filters_values['max_rating'];update = false}
            if(name === 'max_rating')if(this.input.value < this.filtersRef.filters_values['min_rating']) {this.input.value = this.filtersRef.filters_values['min_rating'];update = false}
            this.filtersRef.filters_values[name] = parseFloat(this.input.value)
            this.stars[name==='min_rating'?0:1].childNodes[0].innerText = parseFloat(this.input.value).toFixed(1)

            if(!update) return
            let current_filters = JSON.stringify(this.filtersRef.filters_values)
            setTimeout(() => {
                this.filtersRef.parentRef.update(current_filters)
            }, 1000);
        }
    }

    handle_rating_click(type, value_container)
    {
        if(this.input.getAttribute('hide') === 'true')
        {
            this.input.setAttribute('hide', 'false')
        }
        else if(this.input.getAttribute('hide') === 'false' && this.input.getAttribute('mode') === type)
        {
            this.input.setAttribute('hide', 'true')
        }
        this.input.setAttribute('mode', type)
        this.input.value = parseFloat(value_container.innerText)
    }

    reset()
    {
        this.input.setAttribute('hide', 'true')
        this.stars[0].childNodes[0].innerText = "0.0"
        this.stars[1].childNodes[0].innerText = "10.0"
        this.filtersRef.filters_values.min_rating = 0
        this.filtersRef.filters_values.max_rating = 10
    }
}

class Release_date_filter {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.className = "release_date_filter"
        this.container.appendChild(createHeader("Air date", true))

        let inputs = document.createElement('div')
        inputs.className = 'release_date_inputs_container'

        let inputs2 = document.createElement('div')
        inputs2.className = 'release_date_inputs_container2'
        inputs.appendChild(inputs2)

        inputs2.appendChild(this.createDateInputContainer("FROM"))
        inputs2.appendChild(this.createDateInputContainer("TO"))

        this.container.appendChild(inputs)
    }

    createDateInputContainer(text)
    {
        let container = document.createElement('div')
        container.innerHTML = "<span class='filter_dates_text'>"+text+"</span>"
        container.className = 'date_input_container'
    
        let date = document.createElement('input')
        date.className = 'date_input'
        date.setAttribute('min', '1800-01-01')
        date.setAttribute('max', '2100-01-01')
        date.type = 'date'

        date.onchange = ()=>{this.handle(date.value, text==='FROM'?"min_release_date":"max_release_date")}

        container.appendChild(date)
        return container
    }

    handle(value, type)
    {
        if(value == this.filtersRef.filters_values[type]) return
        this.filtersRef.filters_values[type] = value ? value : null

        let current_filters = JSON.stringify(this.filtersRef.filters_values)
        setTimeout(() => {
            this.filtersRef.parentRef.update(current_filters)
        }, 1000);
    }

    reset()
    {
        let inputs = this.container.childNodes[1].childNodes[0]
        inputs.childNodes[0].childNodes[1].value = ""
        inputs.childNodes[1].childNodes[1].value = ""
        this.filtersRef.filters_values.min_release_date = null
        this.filtersRef.filters_values.max_release_date = null
    }
}

class Runtime_filter {
    constructor(filtersRef)
    {
        this.filtersRef = filtersRef
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.appendChild(createHeader('Runtime'))
        this.container.className = 'filter_runtime_container'

        let options = ["<b>ALL</b>","<b>SHORT</b> ( 0 - 60 minutes )","<b>NORMAL</b> ( 60 - 150 minutes )","<b>LONG</b> ( 150+ minutes )"]

        for(let i in options)
        {
            i = parseInt(i)
            let tmp = document.createElement('div')
            tmp.innerHTML = options[i]
            tmp.className = 'filter_runtime_option'
            tmp.onclick = ()=>{this.handle(tmp, i)}
            if(!i) tmp.setAttribute('selected', 'true')
            this.container.appendChild(tmp) 
        }
    }

    handle(elmnt,num)
    {
        if(num == this.filtersRef.filters_values.runtime) return
        document.getElementsByClassName('filter_runtime_option')[this.filtersRef.filters_values.runtime].removeAttribute('selected')
        this.filtersRef.filters_values.runtime = num
        elmnt.setAttribute('selected', 'true')

        let current_filters = JSON.stringify(this.filtersRef.filters_values)
        setTimeout(() => {
            this.filtersRef.parentRef.update(current_filters)
        }, 1000);
    }

    reset()
    {
        document.getElementsByClassName('filter_runtime_option')[this.filtersRef.filters_values.runtime].removeAttribute('selected')
        this.filtersRef.filters_values.runtime = 0
        document.getElementsByClassName('filter_runtime_option')[0].setAttribute('selected', 'true')
    }
}
