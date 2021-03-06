function AppCtrl($scope) {
    'use strict';
    $scope.title = 'The Movie Database';
}

function WelcomeCtrl() {

}

function MoviesListCtrl($scope, $location, moviesResponse) {
    'use strict';
    $scope.movies = moviesResponse.data;
    $scope.sortProperty = 'title';
    $scope.sortOrder = false;
    $scope.add = function() {
        $location.path('/movies/new');
    };

    $scope.reverseOrder = function() {
        $scope.sortOrder = !$scope.sortOrder;
    };
}

MoviesListCtrl.resolve = {
    moviesResponse: function($http) {
        'use strict';
        return $http.get('/movies');
    }
};

function MoviesAddCtrl($scope, $http, $location) {
    'use strict';
    $scope.movie = {};
    $scope.save = function(movie) {
        $http.post('/movies', movie)
            .success(function(res) {
            $location.path('/movies/' + res.id);
        });
    };
}

function MovieDetailCtrl($scope, $http, $location, moviesResponse) {
    'use strict';
    $scope.movie = moviesResponse.data;

    $scope['delete'] = function() {
        $http['delete']('/movies/' + $scope.movie.id).success(function(res) {
            $location.path('/movies');
        });
    };
}

function movieDetailResolver($http, $route) {
    'use strict';
    var id = $route.current.params.id;
    return $http.get('/movies/' + id);
}

MovieDetailCtrl.resolve = {
    moviesResponse: movieDetailResolver
};

function MovieEditCtrl($scope, $http, $location, moviesResponse) {
    'use strict';
    $scope.movie = moviesResponse.data;

    $scope.save = function() {
        $http.put('/movies/' + $scope.movie.id, $scope.movie)
            .success(function(res) {
            $location.path('/movies/' + $scope.movie.id);
        });
    };
}

MovieEditCtrl.resolve = {
    moviesResponse: movieDetailResolver
};

function NotFoundCtrl() {}

function ErrorCtrl() {}


function ActorsAddCtrl($scope, $http, $location) {
    'use strict';
    $scope.actor = {};
    $scope.save = function(actor) {
        $http.post('/actors', actor)
            .success(function(res) {
            $location.path('/actors/' + res.id);
        });
    };
}


function ActorsListCtrl($scope, $location, actorsResponse) {
    'use strict';
    $scope.actors = actorsResponse.data;
    $scope.sortProperty = 'name';
    $scope.sortOrder = false;
    $scope.add = function() {
        $location.path('/actors/new');
    };

    $scope.reverseOrder = function() {
        $scope.sortOrder = !$scope.sortOrder;
    };
}

ActorsListCtrl.resolve = {
    actorsResponse: function($http) {
        'use strict';
        return $http.get('/actors');
    }
};

function ActorsDetailCtrl($scope, $http, $location, actorsResponse) {
    'use strict';
    $scope.actor = actorsResponse.data;

    $scope['delete'] = function() {
        $http['delete']('/actors/' + $scope.actor.id).success(function(res) {
            $location.path('/actors');
        });
    };
}

function actorsDetailResolver($http, $route) {
    'use strict';
    var id = $route.current.params.id;
    return $http.get('/actors/' + id);
}

ActorsDetailCtrl.resolve = {
    actorsResponse: actorsDetailResolver
};