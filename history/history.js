class History
{
    constructor(appRef)
    {
        this.appRef = appRef
        this.history = []
        this.createBackButton()
    }

    back()
    {
        if(this.history[this.history.length - 1] instanceof Search_result) this.history[this.history.length - 1].query = null
        this.history.pop()
        if(this.history.length === 0)
        {
            this.backButton.remove()
            this.appRef.mainInput.input.value = ''
            this.appRef.mainInput.snippets_results_container.innerHTML = "" 
            this.appRef.mainInput.show()
            this.appRef.content.homepage.showResult()
            $('html,body').scrollTop(0);
            window.scrollBy(0,this.appRef.content.homepage.scroll_value)
        }
        else
        {
            let currentElement = this.history[this.history.length-1]
            currentElement.showResult()
            $('html,body').scrollTop(0);
            window.scrollBy(0, currentElement.scroll_value)
        }
    }

    createBackButton()
    {
        this.backButton = document.createElement('button')
        this.backButton.className = 'backButton'
        this.backButton.onclick = ()=>{this.back();this.appRef.menu.menuUp()}

        let backImg = createIMG('../img/back.svg', 'backImg')
        this.backButton.appendChild(backImg)
    }

    push(elmntRef, scroll_value)
    {
        if(this.history.length === 0)
        {
            document.body.appendChild(this.backButton)
            this.appRef.content.homepage.scroll_value = scroll_value
        } 
        else this.history[this.history.length-1].scroll_value = scroll_value
        this.history.push(elmntRef)
        if(elmntRef instanceof Search_result) this.appRef.mainInput.show()
        else this.appRef.mainInput.hide()
    }

}