
console.log('Let\'s write JavaScript');

// Fetch Songs Lists
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    try {
        currFolder = folder;
        let response = await fetch(`https://musifyhub.netlify.app/${folder}/`);
        let html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");

        let as = doc.getElementsByTagName("a");
        songs = [];

        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href.split(`/${folder}/`)[1]);
            }
        }

        // Show all the songs in the playlist
        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) {
            songUL.innerHTML += `<li><img class="invert" width="34" src="img/music.svg" alt="">
                                 <div class="info">
                                     <div>${song.replaceAll("%20", " ")}</div>
                                     <div>Jutt</div>
                                 </div>
                                 <div class="playnow">
                                     <span>Play Now</span>
                                     <img class="invert" src="img/play1.svg" alt="">
                                 </div></li>`;
        }

        // Attach event listener to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML);
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })
        return songs;
    } catch (error) {
        console.error("Error fetching songs:", error);
        return [];
    }
}


const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"




}
 
let songs;
let currFolder;

async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`https://musifyhub.netlify.app/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`https://musifyhub.netlify.app/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += ` <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="https://musifyhub.netlify.app/songs/${folder}/cover.jpg" alt="">
                <h3>${response.title}</h3>
                <p>${response.description}</p>
            </div>`;
        }
    }

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}


async function main() {
    try {
        // Get list of all songs
        songs = await getSongs("songs/ncs");
        playMusic(songs[0], true);

        // Display all the albums on the page
        await displayAlbums();

        // Attach event listener to next, play, and previous buttons
        // ... (your existing code)
    } catch (error) {
        console.error("Error in main function:", error);
    }
}

main();

    

