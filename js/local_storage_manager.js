window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return this._data[id] = String(val);
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return this._data = {};
  }
};

function LocalStorageManager() {
  this.bestScoreKey      = "bestScore";
  this.gameStateKey      = "gameState";
  this.gameStateStackKey = "gameStateStack";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};


// Game state stack getters/setters and clearing

LocalStorageManager.prototype.getGameStateStack = function () {
  var stackJSON = this.storage.getItem(this.gameStateStackKey);
  return stackJSON ? JSON.parse(stackJSON) : [];
};

LocalStorageManager.prototype.setGameStateStack = function (gameStateStack) {
  this.storage.setItem(this.gameStateStackKey, JSON.stringify(gameStateStack));
};

LocalStorageManager.prototype.pushGameState = function (gameState) {
  var gameStateStack = this.getGameStateStack();
  gameStateStack.push(gameState);
  this.setGameStateStack(gameStateStack);
};

LocalStorageManager.prototype.popGameState = function () {
  var gameStateStack = this.getGameStateStack();
  var gameState = gameStateStack.pop();
  this.setGameStateStack(gameStateStack);
  return gameState;
};

LocalStorageManager.prototype.clearGameStateStack = function () {
  this.storage.removeItem(this.gameStateStackKey);
};
