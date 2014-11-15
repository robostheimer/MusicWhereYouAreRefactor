SciCastApp.factory('SessionService', ['$http', '$q', '$rootScope', 'TradeService',
function($http, $q, $rootScope, TradeService) {
var Session = {
data : null,
last_updated : null,
timeout : 1500,
saveSession : function() {/* save session data to db */
},
updateSession : function(session_data) {
for (var key in session_data) {
data[key] = session_data[key];
}
},
getSessionData : function(force) {
var now = Date.now();
var last_updated_diff = (now - this.last_updated) / 1000.;
// return a deffered no matter what even if we already have session data
if ((_.isUndefined(force) || !force) && last_updated_diff < this.timeout) {
var deferred = $q.defer();
var promise = deferred.promise;
deferred.resolve(this.data);
return promise;
}
//since $http.get returns a promise,
//and promise.then() also returns a promise
//that resolves to whatever value is returned in it's
//callback argument, we can return that.
var rootObj = this;
return $http.get('/session/show?unused=' + Date.now()).then(function(result) {
// alert('getSessionData: '+result.data);
this.last_updated = Date.now();
rootObj.data = result.data;
$rootScope.session = result.data;
if (_.isUndefined($rootScope.session.default_trade_preference) || $rootScope.session.default_trade_preference == null) {
$rootScope.session.default_trade_preference = "safe";
} else {
$rootScope.session.default_trade_preference = TradeService.convertEnumToInterfaceType($rootScope.session.default_trade_preference);
}
return result.data;
}, function(result) {
// alert('fail');
rootObj.data = result.data;
$rootScope.session = result.data;
return result.data;
});
},
has_role : function(roles) {
this.getSessionData().then(function(result) {
var allowed = false;
for (var i = 0; i < $rootScope.session.roles.length; i++) {
var role = roles[i];
for (var j = 0; j < roles.length; j++) {
if (roles[j].trim() == role.trim()) {
allowed = true;
break;
}
}
if (allowed) {
break;
}
}
return allowed;
});
},
resetSessionData : function() {
this.data = null;
$rootScope.session = null;
}
};
return Session;
}]);

createUserPromise.then(function(result) {
geoLocationService.getLocation().then(function(result){}

geoLocationService.getLocation().then(function(result){}, function(result){});
var promise = geoLocationService.getLocation();
if ((_.isUndefined(force) || !force) && last_updated_diff < this.timeout) {
var deferred = $q.defer();
var promise = deferred.promise;
deferred.resolve(this.data);
return promise;
}


$http.get('/session/show?unused=' + Date.now())
$scope.assface = $http.get('/session/show?unused=' + Date.now());
$scope.assface = $http.get('/session/show?unused=' + Date.now()).then(function(result){$scope.assface = result.data.assface;)
$http.get('/session/show?unused=' + Date.now()).then(function(result){$scope.assface = result.data.assface