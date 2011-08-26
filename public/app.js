// From http://www.html5rocks.com/en/tutorials/appcache/beginner/
//
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {

  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      // Browser downloaded a new app cache.
      // Swap it in and reload the page to get the new hotness.
      window.applicationCache.swapCache();
      if (confirm('A new version of this site is available. Load it?')) {
        window.location.reload();
      }
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }, false);

}, false);

function forceReload() {
  window.applicationCache.swapCache();
  window.location.reload();
}

var Todo = (function() {
  var items = [];

  var getItems = function() {
    return items;
  };

  var initialize = function() {
    $(document).ready(function() {
      initializeAfterDomLoaded();
    });
  };

  var initializeAfterDomLoaded = function() {
    loadTodos();
    if (navigator.onLine) {

    } else {
      $('a[data-offline=online-only]').hide();
    }

  };

  var addTodoItemToPage = function(todoItem) {
    var article = $('<article class="todo-item">').html(todoItem.html_content);
    $('#todos').append(article);
  };

  var addTodoItemsToPage = function() {
    $.each(items, function(index, todo) {
      addTodoItemToPage(todo);
    });
  };

  var loadFromLocalStorage = function() {
    items = JSON.parse(localStorage.getItem("todos"));
  };

  var saveToLocalStorage = function() {
    localStorage.setItem("todos", JSON.stringify(items));
  };

  var loadTodos = function() {
    if (navigator.onLine) {
      console.log("Online: load from ajax");
      $.getJSON('/todos.json', function(body) {
        items = body;
        saveToLocalStorage();
        addTodoItemsToPage();
      });
    } else {
      console.log("Offline: load from storage");
      loadFromLocalStorage();
      addTodoItemsToPage();
    }
  };

  // Public API
  return {
    getItems: getItems,
    initialize: initialize,
    loadTodos: loadTodos,
    addTodoItemsToPage: addTodoItemsToPage
  }
})();

Todo.initialize();

