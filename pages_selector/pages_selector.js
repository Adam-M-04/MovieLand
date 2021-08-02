class Pages_selector
{
    constructor(content_ref)
    {
        this.content_ref = content_ref
        this.currentPage = null
        this.numberOfPages = null;
        this.create()
        
        this.current_query = null
        this.current_option = null
    }

    create()
    {
        this.container = document.createElement('div')
        this.container.className = 'PS_container'
        this.createPrevButton()
        this.createInput()
        this.numberOfPagesSpan = document.createElement('span')
        this.container.appendChild(this.numberOfPagesSpan)
        this.createNextButton()
    }

    createInput()
    {
        this.inputWithCurrentPage = document.createElement('input')
        this.inputWithCurrentPage.type = 'number'
        this.inputWithCurrentPage.min = 1
        this.inputWithCurrentPage.step = 1
        this.inputWithCurrentPage.className = 'PS_input_current_page'
        this.inputWithCurrentPage.onkeydown = (e)=>
        {
            if(e.code==='Enter'|| e.key === 'Enter')
            {
                this.inputWithCurrentPage.blur();                
                this.search(this.getPage(parseInt(this.inputWithCurrentPage.value), this), this)
            }
        }
        //this.inputWithCurrentPage.title = 
        this.container.appendChild(this.inputWithCurrentPage)
    }

    createNextButton()
    {
        this.nextButton = createIMG('../img/arrow.svg', 'PS_next')
        this.nextButton.onclick = ()=>{this.search(this.getPage('increment', this), this)}
        this.nextButton.title = 'Go to the next page'
        this.container.appendChild(this.nextButton)
    }

    createPrevButton()
    {
        this.prevButton = createIMG('../img/arrow.svg', 'PS_prev')        
        this.prevButton.onclick = ()=>{this.search(this.getPage('decrease', this), this)}
        this.prevButton.title = 'Go to the previous page'
        this.container.appendChild(this.prevButton)
    }

    search(page, ref)
    {
        if(page === null) return
        ref.content_ref.contentDIV.innerHTML = 'Loading...'
        fetch_data(`https://api.themoviedb.org/3/search/${ref.current_option}?api_key=${apiKey}&query=${ref.current_query}&page=${page}`,
            ref.current_option, ref)
    }

    getPage(val, ref)
    {
        if(val ==='increment') 
        {
            if(ref.currentPage < ref.numberOfPages) return ref.currentPage + 1
            else return null
        }
        else if(val === 'decrease')
        {
            if(ref.currentPage > 1) return ref.currentPage - 1
            else return null
        }
        else
        {
            let page = parseInt(ref.inputWithCurrentPage.value)
            if(page < 1) return 1
            if(page > ref.numberOfPages) return ref.numberOfPages
            if(page !== ref.currentPage) return page
            return null
        }
    }

    show()
    {
        this.inputWithCurrentPage.value = this.currentPage
        this.content_ref.contentDIV.appendChild(this.container)
    }

    resetPagesSelector(no_pages)
    {
        this.numberOfPages = no_pages
        this.numberOfPagesSpan.innerText = '/ '+no_pages
        this.inputWithCurrentPage.max = no_pages
        this.setPage(1)
    }

    setResult(data, option)
    {
        this.content_ref.setResult(data, option, false)
    }

    setPage(page)
    {
        if(page > 1)
        {
            this.buttonStyle(this.prevButton, 'show')
        }
        else
        {
            this.buttonStyle(this.prevButton, 'hide')
        }
        if(page < this.numberOfPages)
        {
            this.buttonStyle(this.nextButton, 'show')
        }
        else
        {
            this.buttonStyle(this.nextButton, 'hide')
        }
        this.currentPage = page
        this.inputWithCurrentPage.value = page
    }

    buttonStyle(button, mode)
    {
        if(mode === 'show')
        {
            button.style.opacity = 1
            button.style.cursor = 'pointer'
        }
        else
        {
            button.style.opacity = 0
            button.style.cursor = 'default'
        }
    }

}