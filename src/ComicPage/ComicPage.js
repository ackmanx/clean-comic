import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ComicPage extends Component {
    state = {
        comics: []
    }

    componentDidMount() {
        fetch(new Request(`/comic/${this.props.match.params.id}`))
            .then(response => response.json())
            .then(comics => this.setState({comics}))
    }

    render() {
        return (
            <div>
                <Link to='/'>Go back.</Link>
                {this.state.comics.map((comic, index) =>
                    <div key={index}>
                        <h1>{comic.date}</h1>
                        <img src={comic.url} alt="haha"/>
                    </div>
                )}
            </div>
        )
    }
}

export default ComicPage
