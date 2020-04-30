'use strict'

let storage

if ( localStorage.getItem('items') ) {
  storage = JSON.parse( localStorage.getItem('items') )
} else {
  storage = [];
  storage.push ({
    'name' : 'default',
    'content' : 'Start editing your text here'
  });

  localStorage.setItem( 'items', JSON.stringify(storage) )
}

// set the latest content

let latestVersion = storage[ storage.length - 1 ].content;
$('#text').html( latestVersion );

// add new version popup

$('#popup--confirm')
.on('click', '.add-new-version', function(){
  let newVersionLabel = $('#new-label').val();
  let currentTextVersion = $('#text').html();

  if (storage.find( item => item.name == newVersionLabel) ){
    let alertMessage = 'This name already exists';
    $('#error-message').html('')
    $('#error-message').html( alertMessage )
  } else {
    storage.push({
      'name' : newVersionLabel,
      'content' : currentTextVersion
    });
    localStorage.setItem( 'items', JSON.stringify(storage) );

    $('#popup--confirm').modal('toggle');
  };

});

// previous versions button

$('.editor')
.on('click', '#versions', function(){
  storage = JSON.parse( localStorage.getItem('items') )
  $('#popup--versions').modal('show');
  showVersions();
});

let chosenItem

$('#popup--versions')
.on('click', '.dropdown-item', function(e){
  e.preventDefault();

  let choice = e.target
  let thisLabel = choice.text
  $('#versionsList').text( thisLabel )

  chosenItem = storage.find( item => item.name == thisLabel);
  
})

// update with chosen version

.on('click', '.version-show', function(){

  $('#text').html( chosenItem.content );
  $('#popup--versions').modal('toggle');
  
})

// save changes button

$('.editor')
.submit( function(e) {
      
  e.preventDefault();
  $('#popup--confirm').modal('show');
});

// edit button

$('.editor')
.on('click', '#edit', function(){
  $('#text').prop( 'contenteditable', true )
              .prop( 'readonly', false)
              .toggleClass('text-body')
  $('#submit, #dismiss').toggleClass('disabled')
                .removeAttr('disabled')
  $('#edit').toggleClass('disabled')
              .attr( 'disabled', '' )
  $('#color-picker').css({'visibility': 'visible'})
});

// dismiss button

$('.editor')
.on('click', '#dismiss', function(){
  $('#text').prop( 'contenteditable', false )
              .prop( 'readonly', true)
              .toggleClass('text-body')
  $('#submit, #dismiss').toggleClass('disabled')
                          .attr('disabled', '')
  $('#edit').toggleClass('disabled')
              .removeAttr('disabled')
  $('#color-picker').css({'visibility': 'hidden'})
  $('span').css({'color': ''})
  $('#color-picker').css({
          "background-color": '',
          "border-color": ''
          })
  $('#text').html( latestVersion )
});

// versions dropdown

function showVersions() {
  $('.dropdown-menu').html('');
  storage.forEach( function(item) {
    let versionLabel = item.name;
    let versionName = $('<a class="dropdown-item" href="#"></a>').text(`${versionLabel}`)
    $('.dropdown-menu').append( versionName )
  })
}

// color picker plugin

$('#color-picker')
  .spectrum({
    change: function(selectedColour) {

      // change button colour
      $('#color-picker').css({
        "background-color": `${selectedColour}`,
        "border-color": "#00000050"
      });

      addColourtoSelect(selectedColour);
      $("#color-picker").spectrum("hide");
    }

  });

function addColourtoSelect(colour){
  let selected = window.getSelection();
  let selectedRange = selected.getRangeAt(0);

  let newNode = document.createElement('span');
  selectedRange.surroundContents(newNode)
  $('span').css({'color':`${colour}`})

}