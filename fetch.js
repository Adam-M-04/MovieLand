function fetch_data(url, type, objRef){
    fetch(url).then(res => {
        if(!res.ok)
        {
            throw Error('Could not get the data from the server');
        }
        return res.json()
    }).then(data => {
        if(data.total_results === 0) objRef.showMessage('Sorry, we could not find anything')
        else objRef.setResult(data, type);
    }).catch(err=>{
        objRef.showMessage(err.message)
    })
}
