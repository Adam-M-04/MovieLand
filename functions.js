// Function that creates HTMLElement img, set image source and className, and return this object
function createIMG(/*string: relative source of the image*/src, /*string: the name of the image class*/classname)
{
    let img = document.createElement('img')
    img.setAttribute('src', src)
    img.className = classname
    return img;
}

function createSlidersWithSwitcher(data, types, switcherTitles, minimal = false)
{
    let Container = document.createElement('div')
    Container.style.width = '100%'

    let Swiper1 = createSlider(data[0], types[0], app.content, minimal)

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
        let person = new Card(type, elmnt, objRef, minimalView)
        Elements.push(person.card)
    }

    return new Slider(Elements)
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
