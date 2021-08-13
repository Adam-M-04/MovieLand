class SwitchButton 
{
    constructor(options, functionToExecute)
    {
        this.options = options
        this.current = 0
        this.elements = [document.createElement('span'), document.createElement('span')]

        this.container = document.createElement('div')
        this.container.className = 'switch_container'

        this.innercontainer = document.createElement('div')
        this.innercontainer.className = 'switch_innercontainer'
        this.container.appendChild(this.innercontainer)

        for(let i in options)
        {
            i = parseInt(i)
            if(i===0) this.elements[i].style.color = '#E5E5E5'
            this.elements[i].innerText = options[i]
            this.elements[i].className = 'switch_option'
            this.elements[i].style.left = 5 + i * 100 + 'px'
            this.elements[i].onclick = ()=>{this.change(i); functionToExecute()}
            this.innercontainer.appendChild(this.elements[i])
        }

        this.selector = document.createElement('span')
        this.selector.className = 'switch_selector'
        this.innercontainer.prepend(this.selector)
    }

    change(option)
    {
        if(this.current === option) return
        this.elements[this.current].style.color = '#14213D'
        this.elements[option].style.color = '#E5E5E5'
        this.selector.style.left = 5 + option * 100 + 'px'
        this.current = option
    }
}