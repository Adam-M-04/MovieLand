function fetch_data(url, objRef, type, more_options = {'search_phrase': null, 'fetch_name': null}){
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
            objRef.setResult(data, type, more_options)
        }
         
    }).catch(err=>{
        objRef.showMessage(err.message)
        console.log(err)
    })
}
