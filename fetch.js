function fetch_data(url, objRef, type, search_phrase = null){
    fetch(url).then(res => {
        if(!res.ok)
        {
            throw Error('Could not get the data from the server');
        }
        return res.json()
    }).then(data => {
        if(data.total_results === 0) objRef.showMessage('Sorry, we could not find anything')
        else
        {
            if(search_phrase) objRef.setResult(data, type, search_phrase)
            else objRef.setResult(data, type)
        }
         
    }).catch(err=>{
        objRef.showMessage(err.message)
        console.log(err)
    })
}
