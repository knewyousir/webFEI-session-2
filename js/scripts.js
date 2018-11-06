const oneHour = 60 * 60 * 1000;

/**
* Dynamically vary the API endpoint
* @return {String} The API endpoint
**/
var getEndpoint = function () {
    // var endpoint = 'http://oit2.scps.nyu.edu/~devereld/api/';
    // var endpoint = '/api/'; // so I can test locally if no internet connection
    var endpoint = 'http://127.0.0.1:5500/api/';
    var random = Math.random();
    if (random < 0.3) return endpoint + 'pirates.json';
    if (random < 0.6) return endpoint + 'pirates2.json';
    return endpoint + 'fail.json';
};

// Start my code

var elem = document.querySelector('#app');

// Request Stories

function requestStories(url) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        console.log(this.readyState);
        if (request.readyState != 4) return;
        if (request.status === 200) {
            console.log('requestStories() succeeded');
            saveData(request.responseText);
            renderStories(JSON.parse(request.responseText));
        } else {
            console.log('requestStories() failed');
            if (localStorage.getItem('currentIssue') === null) {
                console.log('no cached data to render');
            } else {
                dataPkg = JSON.parse(localStorage.getItem('currentIssue'));
                data = JSON.parse(dataPkg.data);
                renderStories(data); //FIX <------!!!
            }
        }
    };
    request.open('GET', getEndpoint());
    request.send();
}

function saveData(data) {
    var saved = {
        data: data,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('currentIssue', JSON.stringify(saved));
    console.log('completed saveData');
}

checkStories();

function checkStories() {
    if (localStorage.getItem('currentIssue') === null) {
        console.log('no cached data found');
        requestStories();
    } else {
        dataPkg = JSON.parse(localStorage.getItem('currentIssue'));
        if (dataPkg.timestamp - (new Date().getTime()) >= oneHour) {
            console.log('cache over an hour old- re-fetching data');
            requestStories();
        } else {
            console.log('cache less than hour old- re-using cached data');
            data = JSON.parse(dataPkg.data);
            renderStories(data);
        }
    }
}

function renderStories(data) {
    var content = data;
    console.log('printing content');
    console.log(content);
    var stories = content.articles;
    console.log(stories);
    // Compare timestamp of parsed data here?
    stories.forEach(function (story) {
        var storyEl = document.createElement('div'); 
        storyEl.className = 'entry';
        storyEl.innerHTML = `
            <div>
            <h3><a target="_blank" href="${content.attribution.url}">${story.title}</a></h3>
            </div>
            <p>${story.article}</p>
        `;
        elem.append(storyEl);
    });
}