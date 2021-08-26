class Search_result
{
    constructor(result, option, contentRef)
    {
        this.data = result
        this.query = result !== null ? result.search_phrase : null
        this.option = option
        this.contentRef = contentRef
        
    }

    showResult()
    {
        this.contentRef.result = this
        this.contentRef.app.mainInput.input.value = this.query
        this.contentRef.app.mainInput.filter.changeOption(['movie', 'tv', 'person', 'multi'].indexOf(this.option))
        this.contentRef.app.mainInput.show()
        this.contentRef.showResult()
    }

}