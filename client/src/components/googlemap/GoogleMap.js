const apiKey = process.env.REACT_APP_GOOGLEAPI_KEY;

export const loadGMapScripts = (onScriptLoad) => {
    if(!window.google){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ja`;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
        s.addEventListener('load', e => {
            onScriptLoad();
        })
    } else {
        onScriptLoad();
    }
}