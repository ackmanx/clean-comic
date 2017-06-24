import React, {Component} from 'react'
import './App.css'

class App extends Component {
    constructor() {
        super()
        this.state = {
            comics: [{name: 'before-fetch'}]
        }
    }

    componentDidMount() {
        fetch(new Request('/blah'))
            .then(res => {
                this.setState({
                    comics: [{name: 'after-fetch'}]
                })
            })
    }

    render() {
        return (
            <div className="App">
                {this.state.comics.map(comic => <div key={new Date().getTime()}>{comic.name}</div>)}
            </div>
        )
    }
}

export default App
