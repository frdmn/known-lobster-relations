// Require modules
var cheerio = require('cheerio');
var request = require('async-request');
var github = require('octonode');

// Load configuration file
var config = require('./config.json');

// Create GitHub API client from personal token out of config
var client = github.client(config.token);
var ghuser = client.user(config.username);

/**
 * Function to scrape 🦞's
 * from https://lobste.rs/u/
 */
async function scrapeLobsters(){
    var lobsters = [];
    var response = await request('https://lobste.rs/u/');

    var $ = cheerio.load(response.body);
    $('ul li a').each(function(){
        lobsters.push($(this).text());
    });

    return lobsters;
}

/**
 * Function to get all followers from GitHub
 * @param {Integer} page Current pagination page
 * @param {Array} previous Array to hold data
 */
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

/**
 * Function to get all followings from GitHub
 * @param {Integer} page Current pagination page
 * @param {Array} previous Array to hold data
 */
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

// Empty array to store 🦞's in
var lobsters = [];

// Call stuff, then() wait for stuff, then() call other stuff
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
