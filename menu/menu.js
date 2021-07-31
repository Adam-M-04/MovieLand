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
        this.menuSwitch.onclick = ()=>{this.menuDown(this)}
        document.body.appendChild(this.menu);
        document.body.appendChild(this.menuSwitch);
        $('#menu').animate({height: 'toggle'},0)
    }

    menuDown(menu)
    {
        $('#menu').animate({height: 'toggle'},500, () => {
            app.menu.menuSwitch.innerHTML = "<img src='../img/close.svg' id='menu_close'>"
        })
        menu.menuSwitch.onclick = ()=>{this.menuUp(this)}
    }

    menuUp(menu){
        $('#menu').animate({height: 'toggle'},500, () => {
            app.menu.menuSwitch.innerHTML = "<img src='../img/menu_arrows.svg' id='menu_arrows'>"
        })
        menu.menuSwitch.onclick = ()=>{this.menuDown(this)}
    }
}