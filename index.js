class App
{
    constructor()
    {
        this.menu = new Menu();

        this.mainInput = new Input(this)

        this.content = new Content(this);
    }

    go_home()
    {
        this.content.clear()
        this.mainInput.input.value=''
        this.mainInput.show()
    }
}

app = new App()
