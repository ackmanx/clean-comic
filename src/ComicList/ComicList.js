import React, {Component} from 'react'
import {Link} from 'react-router-dom'

class ComicList extends Component {
    state = {
        comics: []
    }

    componentDidMount() {
        fetch(new Request('/comics'))
            .then(response => response.json())
            .then(comics => this.setState({comics}))
    }

    render() {
        return (
            <div>
                {this.state.comics.map(comic =>
                    <div key={comic.id}>
                        <Link to={`/comic/${comic.id}`}>
                            {comic.name}
                        </Link>
                    </div>
                )}
            </div>
        )
    }
}

export default ComicList
