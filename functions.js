function create_copied_message()
{
    let copied_message = document.createElement("div")
    copied_message.innerText = "Copied!"
    copied_message.className = "copied_message"
    copied_message.setAttribute('visible', 'false')
    return copied_message
}

function copy_to_clipboard(message_box, text_to_write)
{
    navigator.clipboard.writeText(text_to_write)
    .then(() => {
        message_box.setAttribute('visible', 'true')
        setTimeout(() => {
            message_box.setAttribute('visible', 'false')
        }, 1000);
    })
    .catch(err => {
        console.log('Could not copy to clipboard');
    });
}

function createHeader(header_text, smaller = false)
{
    let span = document.createElement('span')
    span.innerText = header_text
    span.className = 'decorated_header'
    if(smaller) span.style.fontSize = '26px'

    let text = document.createElement('h2')
    text.className = 'decorated_header_container'
    text.appendChild(span)
    return text
}

// Function that creates HTMLElement img, set image source and className, and return this object
function createIMG(/*string: source of the image*/src, /*string: the name of the image class*/classname)
{
    let img = document.createElement('img')
    img.setAttribute('src', src)
    img.className = classname
    return img;
}

function createSlidersWithSwitcher(ref, data, types, switcherTitles, minimal = false)
{
    let Container = document.createElement('div')
    Container.style.width = '100%'

    let Swiper1 = createSlider(data[0], types[0], app.content, minimal)
    if(ref) ref.swiper_to_update = Swiper1

    let Swiper2 = createSlider(data[1], types[1], app.content, minimal)

    let switcher = new SwitchButton(switcherTitles, ()=>{
        switchSliders(Swiper1, Swiper2, Container, switcher)
    })

    Container.appendChild(switcher.container)
    Container.appendChild(Swiper1.container)
    return Container
}

function createSlider(data, type, objRef, minimalView = false)
{
    let Elements = []

    for(let elmnt of data)
    {
        let card = new Card(type, elmnt, objRef, minimalView)
        Elements.push(card.card)
    }

    return new Slider(Elements)
}

function createVoteContainer(vote_count, vote_average, className = 'voteContainer', detailed = false){
    let votes = document.createElement('div')
    votes.className = className
    if(!detailed) votes.title = `Votes: ${vote_count} | average: ${vote_average.toFixed(1)}/10`

    let star = createIMG('../img/star.svg', 'votes_star')
    votes.appendChild(star)

    let number = document.createElement('span')
    number.innerText = vote_average.toFixed(1)
    if(detailed) number.innerText += '/10 (' + vote_count + ' votes)'
    votes.appendChild(number)

    return votes
}

async function fetch_random(type)
{
    const response = await fetch(`https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&page=${parseInt(Math.random()*500)+1}`);

    if (!response.ok) {
        return null;
    }

    const result = await response.json();
    try
    {
        return result.results[parseInt(Math.random() * result.results.length)].id
    }
    catch(error)
    {
        return null
    }
}

function loadCSS(href)
{
    let cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet'
    cssLink.href = href
    document.head.appendChild(cssLink)
}

function loadMultipleCSS()
{
    arr = [
        '/detailed_view/detailed_view.css', 
        '/epsiode/episode.css', 
        '/detailed_view/DV_season/DV_season.css', 
        '/detailed_view/person/DV_person.css', 
        '/detailed_view/tv/DV_tv.css',
        '/detailed_view/movie/DV_movie.css',
        '/discover/movies/discover_movies.css',
        '/discover/filters/filters.css'
    ]
    for(let css of arr) loadCSS(css)
}

function switchSliders(swiper1, swiper2, container, switcher)
{
    if(switcher.current)
    {
        swiper1.container.remove()
        container.appendChild(swiper2.container)
        swiper2.swiper.update()
    }
    else
    {
        swiper2.container.remove()
        container.appendChild(swiper1.container)
        swiper1.swiper.update()
    }
}
