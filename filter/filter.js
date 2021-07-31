class Filter
{
    constructor(name, options, defOption = 0)
    {
        this.name = name
        this.options = options
        this.option = defOption

        this.create()
    }

    create()
    {
        this.filter = document.createElement('div')
        this.filter.className = 'filter'
        this.filter.onclick = ()=>{this.toggle(this)}
        this.filter.innerText = this.name
        this.createOptions()
    }

    createOptions()
    {
        this.optionsContainer = document.createElement('div')
        this.optionsContainer.className = 'filter_optionsContainer'

        this.optionsContainerHTML = []
        for(let i in this.options)
        {
            i = parseInt(i)
            let option = document.createElement('div')
            option.className = this.getClassNames(i)
            option.innerText = this.options[i]
            option.onclick = ()=>{this.changeOption(this, i)}
            this.optionsContainer.appendChild(option)
            this.optionsContainerHTML.push(option)
        }
        $(this.optionsContainer).slideToggle(0);
        this.filter.append(this.optionsContainer)
    }

    toggle(ref)
    {
        ref.filter.onclick = null
        $(ref.optionsContainer).slideToggle(200);
        ref.filter.onclick = ()=>{ref.toggle(ref)}
    }

    getClassNames(i)
    {
        return 'filter_option' + (i + 1 < this.options.length ? ' filter_option_border' : '') + 
            (i === this.option ? ' filter_option_selected' : ' filter_option_not_selected')
    }

    changeOption(ref,new_id)
    {
        let prev_id = ref.option
        ref.option = new_id
        ref.optionsContainerHTML[prev_id].className = ref.getClassNames(prev_id)
        ref.optionsContainerHTML[new_id].className = ref.getClassNames(new_id)
    }

}