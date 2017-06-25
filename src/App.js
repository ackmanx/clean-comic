import React, {Component} from 'react'
import './App.css'

const id = (function* idMaker() {
    let id = 0
    while (true) {
        yield id++
    }
})()

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
                {this.state.comics.map(comic => <div key={id.next().value}>{comic.name}</div>)}
            </div>
        )
    }
}

export default App
