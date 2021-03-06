class Menu
{
    constructor(appRef)
    {
        this.menu = document.createElement("div");
        this.menu.id = "menu";

        this.menuElementsTitles = [
            'Home','Movies', 'TV Shows', 'Random'
        ]

        this.menuElementsFunctions = [
            ()=>{appRef.go_home(); this.menuUp()},
            ()=>{
                if(!(appRef.history.history[appRef.history.history.length-1] instanceof Discover_movies)) appRef.history.push(new Discover_movies(appRef.content), window.pageYOffset)
                this.menuUp()
            },
            ()=>{
                if(!(appRef.history.history[appRef.history.history.length-1] instanceof Discover_tvs)) appRef.history.push(new Discover_tvs(appRef.content), window.pageYOffset)
                this.menuUp()
            },
            ()=>{
                let tmp = window.pageYOffset
                appRef.content.contentDIV.innerHTML = '<img src="/img/loading.svg">'
                this.menuUp()
                let type = Math.random() < 0.5 ? 'movie' : 'tv'
                fetch_random(type).then((id)=>{
                    if(id === null) {appRef.content.contentDIV.innerText="An error occured, please try again."; return;}
                    appRef.history.push(new Detailed_view(type, id, appRef.content), tmp)
                    $('html,body').scrollTop(0);
                })
            }
        ]

        let titlesContainer = document.createElement('div')
        titlesContainer.id = 'titlesContainer'
        this.menu.appendChild(titlesContainer)
        

        for(let i in this.menuElementsTitles){
            let tmpElmnt = document.createElement('h2');
            tmpElmnt.innerText = this.menuElementsTitles[i];
            tmpElmnt.onclick = this.menuElementsFunctions[i]
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
    }

    menuDown()
    {
        $('#menu').animate({height: '100vh'},500, () => {
            this.menuSwitch.innerHTML = "<img src='../img/close.svg' id='menu_close'>"
        })
        this.menuSwitch.onclick = ()=>{this.menuUp()}
    }

    menuUp(){
        $('#menu').animate({height: '0vh'},500, () => {
            this.menuSwitch.innerHTML = "<img src='../img/menu_arrows.svg' id='menu_arrows'>"
        })
        this.menuSwitch.onclick = ()=>{this.menuDown()}
    }
}