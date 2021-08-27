class Pages_selector
{
    constructor(container_ref, search_function, set_result_function)
    {
        this.container_ref = container_ref
        this.search_function = search_function
        this.set_result_function = set_result_function
        this.currentPage = null
        this.numberOfPages = null;
        this.create()
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
                this.search(this.getPage(parseInt(this.inputWithCurrentPage.value)))
            }
        }
        this.container.appendChild(this.inputWithCurrentPage)
    }

    createNextButton()
    {
        this.nextButton = createIMG('/img/arrow.svg', 'PS_next')
        this.nextButton.onclick = ()=>{this.search(this.getPage('increment'))}
        this.nextButton.title = 'Go to the next page'
        this.container.appendChild(this.nextButton)
    }

    createPrevButton()
    {
        this.prevButton = createIMG('../img/arrow.svg', 'PS_prev')        
        this.prevButton.onclick = ()=>{this.search(this.getPage('decrease'))}
        this.prevButton.title = 'Go to the previous page'
        this.container.appendChild(this.prevButton)
    }

    getPage(val)
    {
        if(val ==='increment') 
        {
            if(this.currentPage < this.numberOfPages) return this.currentPage + 1
            else return null
        }
        else if(val === 'decrease')
        {
            if(this.currentPage > 1) return this.currentPage - 1
            else return null
        }
        else
        {
            let page = parseInt(this.inputWithCurrentPage.value)
            if(page < 1) return 1
            if(page > this.numberOfPages) return this.numberOfPages
            if(page !== this.currentPage) return page
            return null
        }
    }

    search(page)
    {
        if(page === null) return
        this.container_ref.innerHTML = '<img src="/img/loading.svg">'
        this.search_function(page)
    }

    setNumberOfPages(numOfPages)
    {
        this.numberOfPages = numOfPages
        this.numberOfPagesSpan.innerText = '/ '+ numOfPages
        this.inputWithCurrentPage.max = numOfPages
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

    setResult(data, option)
    {
        this.set_result_function(data, option)
    }

    show()
    {
        this.inputWithCurrentPage.value = this.currentPage
        this.container_ref.appendChild(this.container)
    }

}