(function() {
  var linkify;

  linkify = text(function() {
    var patterns;
    patterns = {
      link: [/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank">$1</a>'],
      user: [/(^|\s)@(\w+)/g, '$1<a href="http://twitter.com/$2" target="_blank">@$2</a>'],
      hash: [/(^|\s)#(\w+)/g, '$1<a href="https://twitter.com/search?q=from:edbritton%20%23$2" target="_blank">#$2</a>']
    };
    return text.replace(patterns.link[0], patterns.link[1]).replace(patterns.user[0], patterns.user[1]).replace(patterns.hash[0], patterns.hash[1]);
  });

}).call(this);

recent_tweets = function(data) {
  var tweetText, user = data[0].user, tweetsWithHashtags = [], tweetsWithSpecificHashtag = [], notReplies = [];

  for (var i = 0; i < data.length; i++) {
    if (!data[i].in_reply_to_user_id) notReplies.push(i);
    if (data[i].entities.hashtags[0]) tweetsWithHashtags.push(i);
    for (var j = 0; j < (data[i].entities.hashtags ? data[i].entities.hashtags.length : 0); j++) if (data[i].entities.hashtags[j].text === 'joke') tweetsWithSpecificHashtag.push(i);
    //if (tweetsWithSpecificHashtag.indexOf(i) > -1) {
    //if (tweetsWithHashtags.indexOf(i) > -1) {
    if (notReplies.indexOf(i) > -1) {
      tweetText = ((!data[i].entities.urls[0]) ? linkify(data[i].text) : linkify(data[i].text).replace('>' + data[i].entities.urls[0].url + '<', '>' + data[i].entities.urls[0].display_url + '<'));
      tweetText += ((data[i].entities.media) ? '<div><img src="' + data[i].entities.media[0].media_url_https + '"></div>' : '');
      document.getElementById('tweets').innerHTML = document.getElementById('tweets').innerHTML + '<li class="list-group-item bg-transparent"><div>' + tweetText + '</div></li>';
    };
  };
  var elements = [
    [       '#name', 'innerHTML', user.name],
    [   '#username', 'innerHTML', '@'+user.screen_name],
    [  '#followers', 'innerHTML', user.followers_count],
    [  '#following', 'innerHTML', user.friends_count],
    ['#description', 'innerHTML', linkify(user.description)],
    [        '#url', 'innerHTML', '<a href="' + user.url + '" title="' + user.entities.url.urls[0].expanded_url + '">' + user.entities.url.urls[0].display_url + '</a>']
  ];
  for (var k = 0; k < elements.length; k++) {
    if (!!document.querySelector(elements[k][0])) document.querySelector(elements[k][0]).innerHTML = elements[k][2];
  };
  //document.getElementById('profilepic').src = user.profile_image_url_https;

};
