class Content
{
    contentDIV = document.createElement('div')
    constructor(app)
    {
        this.app = app
        
        this.contentDIV.id = 'content'
        document.body.appendChild(this.contentDIV)

        $(document).ready(()=>{
            this.result = new Search_result(null, null, this);
            this.pages_selector = new Pages_selector(this.contentDIV, (page)=>{
                let inputRef = this.app.mainInput
                inputRef.input.value = this.result.query
                inputRef.filter.changeOption(['movie', 'tv', 'person', 'multi'].indexOf(this.result.option))
                inputRef.search(this.result.query, page)
            },
            (data, options)=>{
                this.setResult(data, options, false)
            })
        })

    }

    getType(data)
    {
        if(this.result.option === 'multi')
        {
            return data.media_type
        }
        return this.result.option
    }

    setResult(data, option, more_options)
    {
        data.search_phrase = more_options.search_phrase
        this.result = new Search_result(data, option, this)
        let tmp = window.pageYOffset
        this.app.history.push(this.result, tmp)
        this.showResult()
    }
    
    showDetailedView(type, id, season_number)
    {
        let tmp = window.pageYOffset
        this.app.history.push(new Detailed_view(type, id, this, season_number), tmp)
        $('html,body').scrollTop(0);
    }
    
    showMessage(message)
    {
        this.contentDIV.innerHTML = message
    }

    showResult()
    {
        this.contentDIV.innerHTML = ''
        for(let elmnt of this.result.data.results)
        {
            let card = new Card(this.getType(elmnt), elmnt, this)
            this.contentDIV.appendChild(card.card);
        }
        this.pages_selector.setNumberOfPages(this.result.data.total_pages)
        this.pages_selector.setPage(this.result.data.page)
        this.pages_selector.show()
    }
}