import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

import BackBtn from '../BackButton'
import Sidebar from '../Sidebar'
import Loading from '../LoadingPage'
import Failure from '../ErrorPage'
import AlbumItem from '../AlbumItem'
import AudioPlayer from '../AudioPlayer'
import {apiConstant, modifyAlbumData} from '../../utils'

class Album extends Component {
  state = {
    fetchStatus: apiConstant.initial,
    albumList: {},
    selectedSong: {},
  }

  componentDidMount() {
    this.getAlbums()
  }

  getAlbums = async () => {
    this.setState({fetchStatus: apiConstant.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookies.get('jwt_token')
    const url = `https://apis2.ccbp.in/spotify-clone/album-details/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const newData = modifyAlbumData(data)
      this.setState({fetchStatus: apiConstant.success, albumList: newData})
    } else {
      this.setState({fetchStatus: apiConstant.failure})
      console.log(data.error_msg)
    }
  }

  chosenSong = data => {
    this.setState({selectedSong: data})
  }

  albumHeader = () => {
    const {albumList} = this.state
    const {albumName, albumImage, albumArtist} = albumList

    return (
      <div className="album-header">
        <div>
          <img src={albumImage} alt={albumName} className="album-image" />
        </div>
        <div className="album-details">
          <p className="album-type">New Releases</p>
          <h2 className="album-name">{albumName}</h2>
          <p className="album-artist">
            <span>Album by</span> {albumArtist}
          </p>
        </div>
      </div>
    )
  }

  renderAlbumTracks = () => {
    const {albumList} = this.state
    const {albumTracks} = albumList

    return (
      <>
        {this.albumHeader()}
        <div className="album-tracks">
          <ul className="track-headings">
            <li className="heading-item hash">
              <p className="track-heading">#</p>
            </li>
            <li className="heading-item">
              <p className="track-heading">Track</p>
            </li>
            <li className="heading-item">
              <p className="track-heading">Artist</p>
            </li>
            <li className="heading-item">
              <p className="track-heading">Time</p>
            </li>
          </ul>
          <hr className="line" />
          <ul className="album-tracks-list">
            {albumTracks.map(eachTrack => (
              <AlbumItem
                trackData={eachTrack}
                key={eachTrack.id}
                playSong={this.chosenSong}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  viewAlbumComponent = () => {
    const {fetchStatus} = this.state
    switch (fetchStatus) {
      case apiConstant.inProgress:
        return <Loading />
      case apiConstant.success:
        return this.renderAlbumTracks()
      case apiConstant.failure:
        return <Failure retry={this.getAlbums} />
      default:
        return null
    }
  }

  render() {
    const {albumList, selectedSong} = this.state

    return (
      <>
        <Sidebar />
        <div data-testid="albumsPage" className="albums-page">
          <BackBtn />
          {this.viewAlbumComponent()}
          {selectedSong.trackId !== undefined && (
            <AudioPlayer
              trackData={selectedSong}
              image={albumList.albumIamge}
            />
          )}
        </div>
      </>
    )
  }
}

export default Album
