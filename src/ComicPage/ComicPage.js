import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ComicPage extends Component {
    state = {
        comic: {comics: []}
    }

    componentDidMount() {
        fetch(new Request(`/comic/${this.props.match.params.id}`))
            .then(response => response.json())
            .then(comic => this.setState({comic}))
    }

    render() {
        return (
            <div>
                <Link to='/'>Go back.</Link>
                <h1>{this.state.comic.name}</h1>
                {this.state.comic.comics.map((comic, index) =>
                    <div key={index}>
                        <h2>{comic.date}</h2>
                        <div>Read: {String(comic.read)}</div>
                        <img src={comic.path} alt="haha"/>
                    </div>
                )}
            </div>
        )
    }
}

export default ComicPage
