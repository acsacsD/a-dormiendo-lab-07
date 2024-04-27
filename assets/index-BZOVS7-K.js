(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();async function c(){await(await fetch("https://661ca24ee7b95ad7fa6aaf11.mockapi.io/albums")).json()}c();

const searchButton = document.getElementById('search-button');
const favoritesButton = document.getElementById('favorites-button');
const searchTab = document.getElementById('search-tab');
const favoritesTab = document.getElementById('favorites-tab');

// Search Button TasK;1
searchButton.addEventListener('click', () => {
    searchButton.classList.add('active');
    favoritesButton.classList.remove('active');
    searchTab.classList.remove('d-none');
    favoritesTab.classList.add('d-none');
});

favoritesButton.addEventListener('click', () => {
    favoritesButton.classList.add('active');
    searchButton.classList.remove('active');
    favoritesTab.classList.remove('d-none');
    searchTab.classList.add('d-none');
});

// Task 2: SeaRch Functionality
// For the search functionality when the user requests a search, query the album data for matches on both the artistName and the albumName. 
// Use the template provided in the HTML document to render the results of the query. Below is some example searches that you can check your logic.

document.addEventListener('DOMContentLoaded', () => {
    let favorites = [];
  
    // Fetch album
    fetch('https://661ca24ee7b95ad7fa6aaf11.mockapi.io/albums')
      .then(response => response.json())
      .then(albums => {
        
        document.getElementById('search-form').addEventListener('submit', (event) => {
          event.preventDefault();
          const query = document.getElementById('query').value.trim();
          searchAlbums(albums, query);
        });
      })
      .catch(e => {
        console.error('Error fetching album data:', e);
      });
  
    
    function searchAlbums(albums, query) {
      const normalizedQuery = query.toLowerCase();
      const searchResults = albums.filter(album => 
        album.albumName.toLowerCase().includes(normalizedQuery) || 
        album.artistName.toLowerCase().includes(normalizedQuery)
      );
  
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = '';
  
      searchResults.forEach(album => {
        const resultItem = document.createElement('li');
        resultItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
        resultItem.innerHTML = `
          <div class="ms-2 me-auto">
            <div class="fw-bold">
              ${album.albumName}
              <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
            </div>
            <span>${album.artistName}</span>
          </div>
          <button data-uid="${album.id}" type="button" class="btn btn-success">Add to Favorites</button>
        `;
  
        resultItem.querySelector('button').addEventListener('click', () => addToFavorites(album));
  
        resultsContainer.appendChild(resultItem);
      });
    }
  
    // Task 3:
    // Adding to Album
    function addToFavorites(album) {
      if (!favorites.some(fav => fav.id === album.id)) {
        favorites.push(album);
        updateFavoritesUI();
      }
    }
  
    function removeFromFavorites(albumId) {
      favorites = favorites.filter(fav => fav.id !== albumId);
      updateFavoritesUI();
    }
  
//    Updating
    function updateFavoritesUI() {
      const favoritesContainer = document.getElementById('my-albums');
      favoritesContainer.innerHTML = '';
      
      favorites.forEach(album => {
        const favoriteItem = document.createElement('li');
        favoriteItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
        favoriteItem.innerHTML = `
          <div class="ms-2 me-auto">
            <div class="fw-bold">
              ${album.albumName}
              <span class="badge bg-primary rounded-pill">${album.averageRating}</span>
            </div>
            <span>${album.artistName}</span>
          </div>
          <button data-uid="${album.id}" type="button" class="btn btn-danger">Remove from Favorites</button>
        `;
  
        
        favoriteItem.querySelector('button').addEventListener('click', () => removeFromFavorites(album.id));
  
        favoritesContainer.appendChild(favoriteItem);
      });
    }

    function addToFavorites(album) {
        // Checking if album already exists in favorites
        if (!favorites.some(fav => fav.id === album.id)) {
          
          favorites.push(album);
          updateFavoritesUI();
    
          
          fetch('https://661ca24ee7b95ad7fa6aaf11.mockapi.io/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(album)
          })
          .then(response => response.json())
          .then(addedAlbum => {
            console.log('Album added to favorites:', addedAlbum);
          })
          .catch(e => {
            console.error('Error adding album to favorites:', e);
          });
        }
      }
  });