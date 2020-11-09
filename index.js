'use strict';

// function to turn the fetched response into usable HTML
function displayResults(responseJson) {
    console.log('Ran displayResults function.');

    for (let i=0 ; i<responseJson.length ; i++) {

        // Define short-hands for repo Names and URLs
        const repoName = responseJson[i].name;
        const repoURL = responseJson[i].svn_url;
        
        // Append appropriately-formatted list items to the results list
        $('.js-results-list').append(`
        <li><a href="${repoURL}" target="_blank">${repoName}</a></li>`);
    }

    // Tell user if selected GitHub username has 100+ repos
    if (responseJson.length >= 99) {
        $('#js-error-message').html(`<i>Note: the selected GitHub user has 100+ repos, and this list may not be complete.</i>`);
    }

    // Reveal the results section
    $('.results').removeClass('hidden');
}

// function to submit the GET request
function getRepos(requestedUsername) {
    console.log('Ran getRepos function.');

    const lookUpURL = `https://api.github.com/users/${requestedUsername}/repos?per_page=100`;
    
    fetch(lookUpURL)  
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message) {
            $('#js-error-message').text(`Something went wrong: ${responseJson.message}.`);
            $('.results').addClass('hidden');
        } else if (responseJson.message === undefined) {
            return displayResults(responseJson)
        }
      })
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
}

// function to set up the form event listener
function watchForm() {
    console.log('Ran watchForm function.')

    $('form').on('submit', function(event) {
        event.preventDefault();
        console.log('You submitted the form.');
        
        // Log the submitted username
        const requestedUsername = $('#js-username-search').val()
        console.log(`You requested repos for the user '${requestedUsername}'.`);

        // Empty search field, results list, and error message
        $('#js-username-search').val('');
        $('.js-results-list').empty();
        $('#js-error-message').empty();

        // Use that username as an argument for the function that will submit the GET request
        getRepos(requestedUsername);

        
    })
}

// Once the page loads, run the event listener function
$(watchForm);