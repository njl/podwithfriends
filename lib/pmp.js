var PmpSdk = require('pmpsdk');
var request = require('request');
var pmpMemoize = {};

// initialize PMP sdk, or die trying
if (!process.env.PMP_HOST) {
  throw 'You must set secrets/PMP_HOST!';
}
if (!process.env.PMP_CLIENT_ID) {
  throw 'You must set secrets/PMP_CLIENT_ID!';
}
if (!process.env.PMP_CLIENT_SECRET) {
  throw 'You must set secrets/PMP_CLIENT_SECRET!';
}

/**
 * Raw PMP SDK object
 */
exports.sdk = new PmpSdk({
  host:         process.env.PMP_HOST,
  clientid:     process.env.PMP_CLIENT_ID,
  clientsecret: process.env.PMP_CLIENT_SECRET
});

/**
 * Run a query
 *
 * @param text     - the text search query (optional)
 * @param page     - the page number to load
 * @param callback - function(err, data)
 */
exports.query = function(text, page, callback) {
  var params = {
    profile: 'story',
    has:     'audio,image',
    limit:   20,
    offset:  (page - 1) * 20,
    text:    text
  };

  // query the pmp
  exports.sdk.queryDocs(params, function(query, resp) {
    async.map(query.items, formatPodcast, function(err, results) {
      callback(err, {total: query.total(), podcasts: _.compact(results)});
    });
  });
}

/**
 * Fetch a guid
 *
 * @param guid     - the PMP document guid
 * @param callback - function(err, podcast)
 */
exports.fetch = function(guid, callback) {
  exports.sdk.fetchDoc(guid, function(doc, resp) {
    formatPodcast(doc, function(err, data) {
      callback(err, data);
    });
  });
}

/**
 * Format PMP documents "nicely" (fetch all the hypermedia)
 *
 */
var formatPodcast = function(doc, callback) {
  var tasks = {
    image:   _.partial(getImageData, doc),
    audio:   _.partial(getAudioData, doc),
    program: _.partial(getProgramData, doc),
    owner:   _.partial(getOwnerData, doc)
  };

  // find/fetch in parallel
  async.parallel(tasks, function(err, data) {
    if (err && err.missingRequired) {
      callback(); // don't show this one!
    }
    else if (err) {
      callback(err);
    }
    else {
      data.guid = doc.attributes.guid;
      data.title = doc.attributes.title;
      data.teaser = doc.attributes.teaser;
      callback(null, data);
    }
  });
}

/**
 * Try to get an image
 *
 * @param doc      - the PMP story document
 * @param callback - function(err, imageData)
 */
var getImageData = function(doc, callback) {
  var best = null;

  // find the best enclosure
  var img = getItemOfProfile(doc, 'image');
  if (img && img.links.enclosure) {
    var best = _.first(img.links.enclosure).href;
    _.each(['square', 'small', 'medium'], function(cropType) {
      _.each(img.links.enclosure, function(encl) {
        if (encl && encl.meta && encl.meta.crop == cropType) {
          best = encl.href;
        }
      });
    });
    // HACK: get a MUCH smaller thumbnail for NPR images
    if (best && best.match(/media\.npr\.org/)) {
      best = best.replace(/\.jpg$/, '-s200-c85.jpg');
    }
    callback(null, {
      guid: img.attributes.guid,
      href: best,
      alt: img.attributes.title,
      credit: img.attributes.byline,
      caption: img.attributes.description
    });
  }
  else {
    callback({missingRequired: true}); // no images
  }
}

/**
 * Try to get an mp3
 *
 * @param doc      - the PMP story document
 * @param callback - function(err, audioData)
 */
var getAudioData = function(doc, callback) {
  var audio = getItemOfProfile(doc, 'audio');
  if (audio && audio.links.enclosure) {
    var data = {
      guid: audio.attributes.guid,
      href: audio.links.enclosure[0].href,
      alt: audio.attributes.title,
      credit: audio.attributes.byline,
      caption: audio.attributes.description
    };

    // dereference m3us for compatibility
    if (data.href.match(/\.m3u/)) {
      request(data.href, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          data.href = body;
          callback(null, data);
        }
        else {
          callback({missingRequired: true}); // bad m3u
        }
      });
    }
    else {
      callback(null, data);
    }
  }
  else {
    callback({missingRequired: true}); // no audio???
  }
}

/**
 * Try to get the program from a collection link
 *
 * @param doc      - the PMP story document
 * @param callback - function(err, href)
 */
var getProgramData = function(doc, callback) {
  var href = getProgramCollectionLink(doc);
  var data = {title: null};

  // fetch or memoize
  if (href && pmpMemoize[href]) {
    callback(null, pmpMemoize[href]);
  }
  else if (href) {
    exports.sdk.fetchUrl(href, function(programDoc, resp) {
      if (programDoc) {
        data.title = programDoc.attributes.title;
      }
      pmpMemoize[href] = data;
      callback(null, data);
    });
  }
  else {
    callback(null, data);
  }
}

/**
 * Get the owner link
 *
 * @param doc      - the PMP story document
 * @param callback - function(err, href)
 */
var getOwnerData = function(doc, callback) {
  if (pmpMemoize[doc.links.owner[0].href]) {
    callback(null, pmpMemoize[doc.links.owner[0].href]);
  }
  else {
    doc.followLink(doc.links.owner[0], function(ownerDoc, ownerResp) {
      var data = {title: null};
      if (ownerDoc) {
        data.title = ownerDoc.attributes.title;
      }
      pmpMemoize[doc.links.owner[0].href] = data;
      callback(null, data);
    });
  }
}

// pmp helpers
var getProfile = function(item) {
  if (item && item.links && item.links.profile && item.links.profile.length) {
    var lastSegment = _.last(item.links.profile[0].href.split('/'))
    if (item.links.profile[0].href.match(/\/profiles\//)) {
      return lastSegment;
    }
    else if (lastSegment == 'c07bd70c-8644-4c5d-933a-40d5d7032036') {
      return 'series';
    }
    else if (lastSegment == '88506918-b124-43a8-9f00-064e732cbe00') {
      return 'property';
    }
    else if (lastSegment == 'ef7f170b-4900-4a20-8b77-3142d4ac07ce') {
      return 'audio';
    }
    else if (lastSegment == '5f4fe868-5065-4aa2-86e6-2387d2c7f1b6') {
      return 'image';
    }
    else if (lastSegment == '85115aa1-df35-4324-9acd-2bb261f8a541') {
      return 'video';
    }
    else if (lastSegment == '42448532-7a6f-47fb-a547-f124d5d9053e') {
      return 'episode';
    }
  }
}
var getItemOfProfile = function(item, profileType) {
  if (getProfile(item) == profileType) {
    return item;
  }
  else {
    return _.find(item.items, function(child) { return getProfile(child) == profileType });
  }
}
var getProgramCollectionLink = function(item) {
  var href = null;
  _.find(item.links.collection, function(link) {
    if (!href) { href = link.href }
    if (_.contains(link.rels, 'urn:collectiondoc:collection:property')) {
      return href = link.href;
    }
    if (_.contains(link.rels, 'urn:collectiondoc:collection:series')) {
      return href = link.href;
    }
  });
  return href;
}
var getItemsOfProfile = function(item, profileType) {
  var all = [];
  if (getProfile(item) == profileType) {
    all.push(item);
  }
  _.each(item.items, function(child) {
    if (getProfile(child) == profileType && child && child.href) {
      all.push(child);
    }
  });
  return all;
}
