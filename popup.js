QUERY = "WarholaFAKE - Random Access Memories"

// Wrapper object for the soundcloud api
var SoundcloudWrapper = (function(){

  // Initialization
  SC.initialize({
    client_id: "YOUR_CLIENT_ID"
  });

  // Returned object
  return {

    // Search tracks
    searchTracks: function(query, callback){
      SC.get("/tracks", {q: query, limit: 5}, function(tracks){
        callback(tracks);
      });
    },

    // Embed a track
    getPlayer: function(track_permalink, callback){
      SC.oEmbed(track_permalink, {auto_play: true}, function(oembed){
        callback(oembed);
      });
    }

  };

})();


// The view wrapper
var Popup = {

  // The dom
  initDom: function(){
    this.search_form = $('form#search');
    this.main_container = $('#main');
    this.player_container = $('#player');
  },

  // The tracks
  tracks: [],

  // Update the tracks
  updateTracks: function(tracks){
    this.tracks = tracks;
    this.render();
  },

  // Set the popup in a loading state
  loading: function(){
    this.main_container.html('<span class="loading">Loading...</span>');
  },

  // Render the popup
  render: function(){    
    // Clear the contents
    this.main_container.html('')

    // Display the tracks
    for(var i = 0; i < this.tracks.length; i++){
      var track = this.tracks[i];

      track_template = '<div class="track" data-track-id="' + track.permalink_url + '">' + track.user.username + ' - ' + track.title + '</div>';

      this.main_container.append(track_template);
    }
  },


  // Initialization
  init: function(){
    this.initDom();

    var self = this;

    // Search form
    this.search_form.on('submit', function(){
      var query = self.search_form.find('#query').val();
      self.search(query);
      return false;
    });

    // Tracks player
    this.main_container.on('click', '.track', function(){
      var track_id = $(this).attr('data-track-id');
      self.play(track_id);
      return false;
    });

    return this;
  },

  // Search for a track
  search: function(query){
    var self = this;

    self.loading();
    SoundcloudWrapper.searchTracks(query, function(tracks){
      self.updateTracks(tracks);
    });
  },

  // Play a track
  play: function(track_id){
    var self = this;

    self.player_container.html('');
    SoundcloudWrapper.getPlayer(track_id, function(player){
      self.player_container.html(player.html);
    });
  }
};


// Initialize our popup once the dom is ready
document.addEventListener('DOMContentLoaded', function () {
  Popup.init();
});

