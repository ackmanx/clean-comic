import React, {Component} from 'react'
import {idGenerator} from './idGenerator'
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
            .then(response => {
                response.json().then(json => {
                    this.setState({
                        comics: json
                    })
                })
            })
    }

    render() {
        return (
            <div className="App">
                {this.state.comics.map(comic => <div key={idGenerator.next().value}>{comic.name}</div>)}
            </div>
        )
    }
}

export default App
