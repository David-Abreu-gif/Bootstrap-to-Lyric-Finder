// ----------------------------Interacción con el Accordión
const $btn_lyric = $('#btn_lyric')
const $song_lyric = $('#song_lyric')
const $btn_artist = $('#btn_artist')
const $info_artist = $('#info_artist')

let class_song = $song_lyric[0].classList
let class_lyric = $btn_lyric[0].classList

function lyric_desactive(){
  class_song.remove('show')
  class_lyric.add('collapsed')
}

function lyric_active(){
  class_song.add('show')
  class_lyric.remove('collapsed')
}

$btn_lyric.on("click", function(){
  if (class_song.contains('show')) {
    lyric_desactive()
  } else {
    lyric_active()
    artist_desactive()
  }
});

let class_info = $info_artist[0].classList
let class_artist = $btn_artist[0].classList

function artist_desactive(){
  class_info.remove('show')
  class_artist.add('collapsed')
}

function artist_active(){
  class_info.add('show')
  class_artist.remove('collapsed')
}

$btn_artist.on("click", function(){
  if (class_info.contains('show')) {
    artist_desactive()
  } else {
    artist_active()
    lyric_desactive()
  }
});

// ----------------------------Spinner de Cargando
const $loading = $('#loading')

function loading_active(){
  $loading[0].classList.remove('visually-hidden')
  $loading[0].classList.add('visually-show')
}

function loading_desactive(){
  $loading[0].classList.remove('visually-show')
  $loading[0].classList.add('visually-hidden')
}

// ----------------------------Mensajes de Alerta
const $error_value = $('#error_value')
const $error_info = $('#error_info')

function alert_desactive(){
  $error_value[0].classList.remove('visually-show')
  $error_value[0].classList.add('visually-hidden')
  $error_info[0].classList.remove('visually-show')
  $error_info[0].classList.add('visually-hidden')
}

function errvalue_active(){
  $error_value[0].classList.remove('visually-hidden')
  $error_value[0].classList.add('visually-show')
}

function errinfo_active(){
  $error_info[0].classList.remove('visually-hidden')
  $error_info[0].classList.add('visually-show')
}


// ----------------------------Datos del Formulario
const $name_artist = $('#name_artist')
const $name_music = $('#name_music')
const $btn_form = $('#btn_form')
const $form = $('#form')

let value_artist = $name_artist[0]
let value_music = $name_music[0]


$form.on('submit', function(){
  alert_desactive()
  $accordion.hide()
  if (value_artist.value === '' || value_music.value === '' ) {
    errvalue_active()

  } else {
    $accordion.hide()
    alert_desactive()
    loading_active()
    api_lyric(value_artist.value, value_music.value)
    api_artist(value_artist.value)
  }
})



// ----------------------------Busqueda de la Letra de la Canción
const $accordion = $('.accordion')
const $text_song = $('#text_song')

function api_lyric(artist, song) {
  fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
  .then(resp => resp.json())
  .then((data) => {
    let database = data.lyrics
    let nofound = data.error

    if (database) {
      loading_desactive()
      $text_song.text(database)
      $accordion.show()
      lyric_active()
    } if (nofound) {
      loading_desactive()
      errinfo_active()
    }
  })
}

// ----------------------------Busqueda de la Información del Artista
const $data_search = $('#data_search')
const $img_artist = $('#img_artist')
const $title_artist = $('#title_artist')
const $p_artist = $('#p_artist')

function description_artist(id){
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'genius.p.rapidapi.com',
      'X-RapidAPI-Key': '49c18413b0msh66a8464e54dc142p1c438ajsnfd7fe374832a'
    }
  };

  fetch(`https://genius.p.rapidapi.com/artists/${id}`, options)
    .then(response => response.json())
    .then(data => {
      let database = data.response.artist

      let src_img = database.image_url
      let src_name = database.name
      let src_info = database.description.dom.children[0].children[0]

      $img_artist.attr("src", src_img)
      $title_artist.text(src_name)
      $p_artist.text(src_info)
    })
    .catch(err => console.error(err));
}


function api_artist(data_artist) {
  const options = {
  	method: 'GET',
  	headers: {
  		'X-RapidAPI-Host': 'genius.p.rapidapi.com',
  		'X-RapidAPI-Key': '49c18413b0msh66a8464e54dc142p1c438ajsnfd7fe374832a'
  	}
  };

  fetch(`https://genius.p.rapidapi.com/search?q=${data_artist}`, options)
  	.then(response => response.json())
  	.then(data => {
      let src_id = data.response.hits[0].result.primary_artist.id
      description_artist(src_id)

    })
  	.catch(err => console.error(err));
}
