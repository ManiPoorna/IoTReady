import { useState, useEffect } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [playingFile, setPlayingFile] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Handle file upload
  const handleFileUpload = (e) => {
    const newFiles = [...files];
    // getting the selected file
    const file = e.target.files[0];
    // creating url of the audio file
    const url = URL.createObjectURL(file);
    newFiles.push({ name: file.name, url });
    // updating the playlist
    setFiles(newFiles);
    localStorage.setItem("audioFiles", JSON.stringify(newFiles));
  };

  // Load files from localStorage if any files present
  useEffect(() => {
    const storedFiles = localStorage.getItem("audioFiles");
    if (storedFiles) {
      const loadedFiles = JSON.parse(storedFiles);
      setFiles(loadedFiles);
    }
  }, []);

  // Updates audio time progress
  const handleProgress = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // Handle audio end and play's next song/audio
  const handleAudioEnd = () => {
    // getting current playing song index from files
    const currentIdx = files.indexOf(playingFile);
    if (currentIdx < files.length - 1) {
      // if indes is found, updating to next song
      const nextFile = files[currentIdx + 1];
      setPlayingFile(nextFile);
      setCurrentTime(0);
      // settign current song index and curren time of song to localstorage
      localStorage.setItem("playingFileIndex", currentIdx + 1);
      localStorage.setItem("currentTime", currentTime);
    }
  };

  // Load last played audio on reload
  useEffect(() => {
    // getting last played song and audio duration
    const savedTime = localStorage.getItem("audioTime");
    const savedFile = localStorage.getItem("audioFile");
    // if any song is played before reload it will give details of that song
    if (savedFile && savedTime) {
      const file = files.find((f) => f.name === savedFile);
      if (file) {
        setPlayingFile(file);
        setCurrentTime(parseFloat(savedTime));
      }
    }
  }, [files]);

  // Storing audio time on state change
  useEffect(() => {
    if (playingFile) {
      localStorage.setItem("audioTime", currentTime);
      localStorage.setItem("audioFile", playingFile.name);
    }
  }, [currentTime, playingFile]);

  return (
    <div>
      <label htmlFor="audio">Add Song to PlayList + </label>
      <input
        id="audio"
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
      />
      <div className="playlist">
        <h2>My Playlist</h2>
        <div className="songs">
          {/* if no songs are added to playlist it wills show this saying create playlist */}
          {files.length === 0 ? (
            <div className="no-songs">
              <h1>Create your playlist by adding songs..</h1>
            </div>
          ) : (
            ""
          )}
          {/* Displays list of songs uploaded */}
          {files.map((file, index) => (
            <div
              className={
                files.indexOf(playingFile) === index ? "song active" : "song"
              }
              onClick={() => setPlayingFile(file)}
              key={file.name}>
              {index + 1}. {file.name.split(".mp3")[0].toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {/* audio player */}
      {playingFile !== null ? (
        <div className="song-player">
          <h2>Playing: {playingFile.name.split(".mp3")[0].toUpperCase()}</h2>
          <br />
          <audio
            autoPlay
            src={playingFile.url}
            onTimeUpdate={handleProgress}
            onEnded={handleAudioEnd}
            controls
          />
        </div>
      ) : (
        <div className="song-player-dummy">
          <h2>Playing: __</h2>
          <br />
          <audio autoPlay src="" controls />
        </div>
      )}
    </div>
  );
}

export default App;
