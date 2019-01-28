const cheerio = require('cheerio');
const request = require('request');

const config = require('./config.json');

const github = require('octonode');
const client = github.client(config.token);
const ghuser = client.user(config.username);

let lobsters = [];
let githubFollowers = [];

async function getFollowers(page = 1, previous = []) {
	var [data] = await ghuser.followersAsync(page);

	if (data && data.length === 0) {
		return previous;
	}

	return previous.concat(await getFollowers(++page, data));
}

async function getFollowing(page = 1, previous = []) {
	var [data] = await ghuser.followingAsync(page);

	if (data && data.length === 0) {
		return previous;
	}

	return previous.concat(await getFollowing(++page, data));
}

getFollowers()
	.then(function(followers) {
		console.log('total ->', followers.length);
    }).then(getFollowing)
    .then(function(following) {
		console.log('total ->', following.length);
    });

// request('https://lobste.rs/u/', function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//         const $ = cheerio.load(html);
//         $('ul li a').each(function(i, element){
//             const username = $(element).text();
//             lobsters.push(username);
//         });
//     }
// });
