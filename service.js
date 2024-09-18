function objectToQueryString(obj) {
    return Object.keys(obj)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
        .join('&');
}

function reqPost(uri,param,callback){
        fetch(uri, {
          method: 'POST',
          mode:'cors',
          credentials:'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(param)
        }).then((res) => {
            if (!res.ok) {
              throw new Error(`Server responded with status code ${res.status}`);
            }
            return res.json();
         }).then((msg) => { 
            console.log('Request Get uri:'+uri+':'+'param:'+ param +':'+JSON.stringify(msg)); 
         if(callback) callback(uri);
        })
         .catch(err => alert('Error :['+uri +']'+ err));
}

function reqGet(uri, param, callback) {
    const queryString = objectToQueryString(param);
    fetch(`${uri}?${queryString}`, { credentials: 'include' })
    .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status code ${res.status}`);
        }
        return res.json();
     }).then((msg) => {
            console.log('Request Get uri:' + uri + ': param:' + JSON.stringify(param) + ':' + JSON.stringify(msg));
            if(callback) callback(msg,param);
        })
        .catch(err => alert('Error' + err));
}
module.exports ={reqPost,reqGet};