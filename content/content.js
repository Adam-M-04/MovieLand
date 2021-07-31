class Content
{
    contentDIV = document.createElement('div')
    constructor(app){
        this.app = app
        this.result = null;
        this.contentDIV.id = 'content'
        document.body.appendChild(this.contentDIV)
        this.contentQueue = []
        this.pages_selector = new Pages_selector(this)
    }

    setResult(data, option, resetPageSelector=true)
    {
        this.result = data
        this.option = option
        if(resetPageSelector) this.pages_selector.setData(data.total_pages)
        this.showResult()
    }

    showResult()
    {
        this.contentDIV.innerHTML = ''
        for(let elmnt of this.result.results)
        {
            let card = new Card(this.getType(elmnt), elmnt, app)
            this.contentDIV.appendChild(card.card);
        }
        this.pages_selector.show()
    }

    showMessage(message)
    {
        this.contentDIV.innerHTML = message
    }

    showDetailedView(type, id)
    {
        if(this.contentQueue.length === 0)
        {
            this.app.mainInput.hide()
        }
        this.contentQueue.push(new Detailed_view(type, id, this))
        $('html,body').scrollTop(0);
    }

    Back(content)
    {
        content.contentQueue.pop()
        if(content.contentQueue.length > 0) content.contentQueue[content.contentQueue.length-1].showResult()
        else 
        {
            content.app.mainInput.show()
            content.showResult()
        }
    }

    clear()
    {
        this.result = null;
        this.contentDIV.innerHTML = ''
        this.contentQueue = []
    }

    getType(data)
    {
        if(this.option === 'multi')
        {
            return data.media_type
        }
        return this.option
    }
}