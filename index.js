
class App
{
    constructor()
    {
		this.history = new History(this)

        this.menu = new Menu();

        this.mainInput = new Input(this)

        this.content = new Content(this);
    }

    go_home()
    {
        this.content.clear()
        this.mainInput.input.value=''
        this.mainInput.show()
		this.history.history = []
    }

}

app = new App()
/* https://gist.github.com/tobytailor/1164818/a325bcd4b6da72fe5116a5619e7276e6f47e1925
if(window.history && history.pushState){ // check for history api support
	window.addEventListener('load', function(){
		// create history states
		history.pushState(-1, null); // back state
		history.pushState(0, null); // main state
		history.pushState(1, null); // forward state
		history.go(-1); // start in main state
				
		this.addEventListener('popstate', function(event, state){
            
			// check history state and fire custom events
			if(state = event.state){
	
				event = document.createEvent('Event');
				event.initEvent(state > 0 ? 'next' : 'previous', true, true);
				this.dispatchEvent(event);
				
				// reset state
				history.go(-state);
			}
		}, false);
	}, false);
}

window.addEventListener('next', function(e){
                e.preventDefault()
    			console.log('forward button clicked');
    		}, false);
    
    		window.addEventListener('previous', function(e){
                e.preventDefault()
    			console.log('back button clicked');
    }, false);
*/