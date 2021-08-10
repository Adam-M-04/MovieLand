class Search_result
{
    constructor(query, result, option, contentRef)
    {
        this.data = result
        this.query = query
        this.option = option
        this.contentRef = contentRef
    }

    showResult()
    {
        this.contentRef.result = this
        this.contentRef.app.mainInput.input.value = this.query
        this.contentRef.app.mainInput.filter.changeOption(['movie', 'tv', 'person', 'multi'].indexOf(this.option))
        this.contentRef.showResult()
    }

}