// Example
pagesfromdb = {
    home = {
        paths = ['/','/home','/koti'],
        render = 'home.ejs',
        fi_FI = {html='<h1>Hei maailma!</h1>'},
        en_US = {html='<h1>Hello World!</h1>'}
    },
    about = {
        paths = ['/about','/tietoja'],
        render = 'general.ejs',
        fi_FI = {html='Tietoja'},
        en_US = {html='About Us'}
    }
}
///
Object.keys(pagesfromdb).forEach(function(key) {
    var page = pagesfromdb[key];
    app.get(page.global.paths,function(req, res){
         res.render(page.render, page[language]);
    });
});
