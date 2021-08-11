class Slider
{
    constructor(data)
    {
        this.data = data
        this.create()
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.className = 'swiper-container'

        this.wrapper = document.createElement('div')
        this.wrapper.className = 'swiper-wrapper'
        this.container.appendChild(this.wrapper)

        for(let element of this.data)
        {
            element.classList.add('swiper-slide')
            this.wrapper.appendChild(element)
        }
        
        this.pagination = document.createElement('div')
        this.pagination.className = 'swiper-pagination'
        this.container.appendChild(this.pagination)
        
        this.swiper = new Swiper(this.container, {
            freeMode: true,
            grabCursor: true,
            roundLengths: true,
            slidesPerView: 'auto',
            pagination: {
                el: this.pagination,
                type: 'progressbar'
            },
            observeParents: true
        });
    }
}