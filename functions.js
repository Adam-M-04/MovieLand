function createHeader(header_text)
{
    let span = document.createElement('span')
    span.innerText = header_text
    span.className = 'decorated_header'

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
