class SlideShow
{
    constructor(imagesToShow, linkPrefix, container, historyRef)
    {
        this.historyRef = historyRef
        this.img = createIMG(`https://image.tmdb.org/t/p/original${imagesToShow[0].file_path}`,'DV_backdrop_img')
        this.img.title = 'Click to stop/resume slideshow'
        this.img.onerror = ()=>{this.img.onerror = null; this.img.src = '../img/default_backdrop.png'}
        container.appendChild(this.img)
        this.images = imagesToShow
        this.linkPrefix = linkPrefix
        this.container = container
        this.current = 0
        this.interval = null
        this.container.style.backgroundImage = `url('${this.linkPrefix}${this.images[++this.current % this.images.length].file_path}')`
        this.img.onclick = ()=>{this.stop()}
    }

    handle(ref)
    {
        if(ref.historyRef.history.length === 0){ref.stop();return}
        if(!(ref.historyRef.history[ref.historyRef.history.length-1] instanceof Detailed_view)){ref.stop();return}
        if(ref.historyRef.history[ref.historyRef.history.length-1].details.backdropSlideshow !== ref){ref.stop();return} 
        $(ref.img).animate({opacity: 0}, 300, ()=>{
            ref.img.src = ref.linkPrefix + ref.images[ref.current % ref.images.length].file_path
            ref.img.style.opacity = 1
            ref.container.style.backgroundImage = `url('${ref.linkPrefix}${ref.images[++ref.current % ref.images.length].file_path}')`
        })
    }

    start()
    {
        this.interval = setInterval(()=>{this.handle(this)}, 5000)
        this.img.onclick = ()=>{this.stop()}
    }

    stop()
    {
        clearInterval(this.interval)
        this.img.onclick = ()=>{this.start()}
    }

}