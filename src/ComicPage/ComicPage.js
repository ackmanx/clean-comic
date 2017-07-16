import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ComicPage extends Component {
    state = {
        comic: {
            episodes: []
        }
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
                {this.state.comic.episodes.map((episode, index) =>
                    <div key={index}>
                        <h2>{episode.date}</h2>
                        <div>Read: {String(episode.read)}</div>
                        <img src={episode.localPath} alt="haha"/>
                    </div>
                )}
            </div>
        )
    }
}

export default ComicPage
