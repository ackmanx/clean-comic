import React, {Component} from 'react'
import {BrowserRouter, Link, Route} from 'react-router-dom'
import './App.css'

class App extends Component {
    constructor() {
        super()
        this.state = {
            comics: []
        }
    }

    componentDidMount() {
        fetch(new Request('/comics'))
            .then(response => response.json())
            .then(comics => this.setState({comics}))
    }

    render() {
        const {comics} = this.state

        const comicsList = () =>
            <div>
                {comics.map(comic =>
                    <div key={comic.id}>
                        <Link to={`/comic/${comic.id}`}>
                            {comic.name}
                        </Link>
                    </div>
                )}
            </div>

        return (
            <BrowserRouter>
                <main>
                    <Route path="/" exact={true} render={comicsList}/>
                    <Route path="/comic/:id" component={test}/>
                </main>
            </BrowserRouter>
        )
    }
}

const test = (route) => <div>{route.match.params.id}</div>

export default App
