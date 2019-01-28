var cheerio = require('cheerio');
var request = require('async-request');
var github = require('octonode');

var config = require('./config.json');

var client = github.client(config.token);
var ghuser = client.user(config.username);

async function scrapeLobsters(){
    var lobsters = [];
    var response = await request('https://lobste.rs/u/');

    var $ = cheerio.load(response.body);
    $('ul li a').each(function(){
        lobsters.push($(this).text());
    });

    return lobsters;
}

async function getFollowers(page = 1, previous = []) {
	var [data] = await ghuser.followersAsync(page);
    var users = [];

    data.forEach(function(item){
        users.push(item.login);
    });

	if (data && data.length === 0) {
		return previous;
	}

	return previous.concat(await getFollowers(++page, users));
}

async function getFollowing(page = 1, previous = []) {
    var [data] = await ghuser.followingAsync(page);
    var users = [];

    data.forEach(function(item){
        users.push(item.login);
    });

	if (data && data.length === 0) {
		return previous;
	}

	return previous.concat(await getFollowing(++page, users));
}

var lobsters = [];

scrapeLobsters()
    .then(function(data){
        lobsters = data;
    }).then(getFollowers)
    .then(function(data) {
        var followers = data;
        var matches = followers.filter(function(obj) { return lobsters.indexOf(obj) > -1; });
        console.log('You (' + config.username + ') have ' + matches.length + ' followers on GitHub who might be able to invite you to https://lobste.rs');
        if (matches.length > 0){
                console.log('🦞  ' + matches.join('\n🦞  '));
        }
    })
    .then(getFollowing)
    .then(function(data) {
        var following = data;
        var matches = following.filter(function(obj) { return lobsters.indexOf(obj) > -1; });
        console.log('You (' + config.username + ') have ' + matches.length + ' followings on GitHub who might be able to invite you');
        if (matches.length > 0){
            console.log('🦞  ' + matches.join('\n🦞  '));
        }
    });
