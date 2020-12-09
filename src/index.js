const path = require('path')
const express = require('express')
const hbs = require('hbs')


const app = express()
//port is the deployment port if it exists, else 3000 (for local testing)
const port = process.env.port || 3000;

//Define paths for Express config
const viewsPath = path.join(__dirname, "../templates/views")
const publicDirectoryPath = path.join(__dirname, '../public')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use("/static", express.static('./static/'));
app.use(express.static(publicDirectoryPath))


//Sends main game page
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

//handles 404 pages (must come last)
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page Not Found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});