var Audiosearch = require('audiosearch-client-node');

/**
 * Raw PMP SDK object
 */
exports.sdk = new Audiosearch(process.env.AUDIOSEARCH_APP_ID, process.env.AUDIOSEARCH_SECRET);

/**
 * Run a query
 *
 * @param text     - the text search query (optional)
 * @param page     - the page number to load
 * @param callback - function(err, data)
 */
exports.query = function(text, page, callback) {
  exports.sdk.searchEpisodes(text, {size: 10, page: page}).then(
    function(results) {
      async.map(results.results, episodeToPodcast, function(err, formatted) {
        callback(err, {
          total:    results.total_results,
          page:     results.page,
          podcasts: formatted
        });
      });
    },
    function(err) {
      callback(err);
    }
  );
}

/**
 * Fetch an xid
 *
 * @param xid      - the audiosear.ch episode id
 * @param callback - function(err, podcast)
 */
exports.fetch = function(xid, callback) {
  exports.sdk.getEpisode(xid).then(
    function(result) {
      episodeToPodcast(result, callback);
    },
    function(err) {
      callback(err);
    }
  );
}

/**
 * Standardized formatting for an audiosearch episode
 *
 * @param episode  - the raw episode
 * @param callback - function(err, podcast)
 */
var episodeToPodcast = function(episode, callback) {
  var formatted = {
    xid:             episode.id,
    title:           episode.title,
    description:     episode.description,
    show_title:      episode.show_title,
    duration:        episode.duration,
    network:         episode.network,
    date_created:    episode.date_created,
    audio_url:       null,
    image_thumb_url: null,
    image_full_url:  null
  };

  // optional data
  if (episode.audio_files) {
    if (_.first(episode.audio_files).mp3) {
      formatted.audio_url = _.first(episode.audio_files).mp3;
    }
    else if (_.first(episode.audio_files).url) {
      formatted.audio_url = _.first(_.first(episode.audio_files).url);
    }
  }
  if (episode.image_urls) {
    formatted.image_thumb_url = episode.image_urls.thumb;
    formatted.image_full_url  = episode.image_urls.full;
  }
  if (episode.image_files && episode.image_files.length) {
    formatted.image_thumb_url = episode.image_files[0].url.thumb;
    formatted.image_full_url  = episode.image_files[0].url.full;
  }
  callback(null, formatted);
}
