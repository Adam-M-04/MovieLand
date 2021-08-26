class Filter
{
    constructor(name, options, defOption = 0, change_function = ()=>{})
    {
        this.name = name
        this.options = options
        this.option = defOption
        this.open = false
        this.change_function = change_function
        this.create()
    }

    changeOption(new_id)
    {
        let prev_id = this.option
        this.option = new_id
        this.optionsContainerHTML[prev_id].className = this.getClassNames(prev_id)
        this.optionsContainerHTML[new_id].className = this.getClassNames(new_id)
        this.change_function()
    }

    create()
    {
        this.filter = document.createElement('div')
        this.filter.className = 'filter'
        this.filter.onclick = (e)=>{this.toggle(e);}
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
            option.onclick = ()=>{this.changeOption(i)}
            this.optionsContainer.appendChild(option)
            this.optionsContainerHTML.push(option)
        }
        $(this.optionsContainer).slideToggle(0);
        this.filter.append(this.optionsContainer)
    }

    getClassNames(i)
    {
        return 'filter_option' + (i + 1 < this.options.length ? ' filter_option_border' : '') + 
            (i === this.option ? ' filter_option_selected' : ' filter_option_not_selected')
    }

    toggle(e)
    {
        e.stopPropagation()
        this.filter.onclick = null
        $(this.optionsContainer).slideToggle(200);
        this.filter.onclick = (e)=>{this.toggle(e)}
        this.open = !this.open
        if(this.open)
        {
            document.body.onclick = (e)=>{
                this.toggle(e)
            }
        }
        else
        {
            document.body.onclick = null
        }
    }

}