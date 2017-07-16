import React, {Component} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import ComicsList from '../ComicsList/ComicsList'
import ComicPage from '../ComicPage/ComicPage'
import './App.css'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <main>
                    <Route path="/" exact={true} component={ComicsList}/>
                    <Route path="/comic/:id" component={ComicPage}/>
                </main>
            </BrowserRouter>
        )
    }
}

export default App
