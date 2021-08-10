class Menu
{
    constructor()
    {
        this.menu = document.createElement("div");
        this.menu.id = "menu";

        let titlesContainer = document.createElement('div')
        titlesContainer.id = 'titlesContainer'
        this.menu.appendChild(titlesContainer)
        

        for(let elmnt of menuElementsTitles){
            let tmpElmnt = document.createElement('h2');
            tmpElmnt.innerText = elmnt;
            tmpElmnt.className = 'menuElement'
            titlesContainer.appendChild(tmpElmnt);

            let breakDiv = document.createElement('div');
            breakDiv.className = 'break';
            titlesContainer.appendChild(breakDiv);
        }
        

        this.menuSwitch = document.createElement("button");
        this.menuSwitch.id = "menuSwitch"
        this.menuSwitch.innerHTML = "<img src='../img/menu_arrows.svg' id='menu_arrows'>"
        this.menuSwitch.onclick = ()=>{this.menuDown()}
        document.body.appendChild(this.menu);
        document.body.appendChild(this.menuSwitch);
        $('#menu').animate({height: 'toggle'},0)
    }

    menuDown()
    {
        $('#menu').animate({height: 'toggle'},500, () => {
            this.menuSwitch.innerHTML = "<img src='../img/close.svg' id='menu_close'>"
        })
        this.menuSwitch.onclick = ()=>{this.menuUp()}
    }

    menuUp(){
        $('#menu').animate({height: 'toggle'},500, () => {
            this.menuSwitch.innerHTML = "<img src='../img/menu_arrows.svg' id='menu_arrows'>"
        })
        this.menuSwitch.onclick = ()=>{this.menuDown()}
    }
}