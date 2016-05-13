var app = angular.module('INFO_MS', ['ngRoute']);
app.controller('NavCtrl', [
'$scope',
'auth',
function($scope, auth){
    $scope.isLoggedIn=function () {

        if (auth.isLoggedIn()) {
            return true;
        }
        else {
            return false;
        }
    };
    $scope.currentUser = function () {
       return  auth.currentUser();
    };
    $scope.logOut = function () {
       
        if (auth.logOut())
        {
            window.location.href = "#/login";
        }
    };
    
}]);


app.controller('MainCtrl', [
'$scope', 'project', 'auth',


function ($scope, project, auth) {
    var getPosts = project.getAll();
    if (!auth.isLoggedIn()) {
        window.location.href = '#/login';
       
    }
    $scope.projects = project.projects;
    $scope.addProject = function () {
        var date = new Date();

       // $scope.posts.push({ title: $scope.title, upvotes: 0 });
        if (!$scope.ProjectName || $scope.ProjectName === '') { return; }
        if (!$scope.AssignmentNo || $scope.AssignmentNo === '') { return; }
        project.create({
            ProjectName: $scope.ProjectName,
            AssignmentNo: $scope.AssignmentNo,
            ClientName: $scope.ClientName,
            IsActive: 1
           
        });
        $scope.ProjectName = '';
        $scope.AssignmentNo = '';
        $scope.ClientName = '';
    
    };
  

    
  

    $scope.incrementUpvotes = function (post) {
       
        posts.upvote(post);
    };
    $scope.test = 'Hello world!';
}]);

app.controller('ProjectInfoCtrl', [
'$scope',
'project',
'auth',

function ($scope, project, auth) {
   // $scope.uId = $routeParams.post
    project.getAll();
    $scope.projId = 0;
   // project.GetReqPost($scope.uId);
    $scope.projects = project.projects;
    if (!auth.isLoggedIn()) {
        window.location.href = '#/login';

    }
    $scope.addProjectInfo = function () {
        if ($scope.Information === '') { return; }
        if ($scope.Type === '') { return; }
        if ($scope.projId === '' || $scope.projId===0) { return; }
        project.addProjectInfo({
            Information: $scope.Information,
            Type: $scope.Type,
            ImpNotes: $scope.ImpNotes,
            IsActive: 1,
            Pid: $scope.projId
        }).success(function (projectinfo) {
            $scope.projectsInfo.comments.push(projectinfo);
        });
        $scope.Information = '';
        $scope.Type = '';
        $scope.projId = '';
    };
    $scope.incrementCommentUpvotes = function (comment) {
        
        posts.upvoteComment($scope.uId,comment);
    };
}]);


app.controller('AuthCtrl', [
'$scope',

'auth',
function($scope, auth){
    $scope.user = {};

    $scope.register = function(){
        auth.register($scope.user).error(function(error){
            $scope.error = error;
        }).then(function(){
            window.location.href = '#/login';
        });
    };

    $scope.logIn = function () {
        if ($scope.user.username == "" || $scope.user.password == "") {
            $scope.error = "Please fill out fields";
        }
        else {
            $scope.error = "";
        }
        if ($scope.error == "") {
            auth.logIn($scope.user).error(function (error) {
                $scope.error = error;
            }).then(function () {
                window.location.href = '#/';
            });
        }
    };
}])
app.factory('project', ['$http', 'auth', function ($http,auth              )  {
    var o = {
        projects: [
  
        ]
    };
    o.getAll = function () {
        return $http.get('/project').success(function (data) {
            angular.copy(data, o.projects);
         
        });
    };
    o.create = function(post) {
        return $http.post('/Addproject', post, {
            headers: { Authorization: 'Bearer ' + auth.getToken() }
        }).success(function(data){
            o.projects.push(data);
        });
    };
    o.addProjectInfo = function (post) {
        return $http.post('/AddprojectInfo', post, {
            headers: { Authorization: 'Bearer ' + auth.getToken() }
        }).success(function (data) {
            o.projects.push(data);
        });
    };
    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
            headers: { Authorization: 'Bearer ' + auth.getToken() }
        }).success(function(data){
              post.upvotes += 1;
          });
    };

    o.GetReqPost = function (post) {
        return $http.get('/posts/' + post )
          .success(function (data) {
              angular.copy(data, o.posts);
          });
    };

    o.addComment = function (id, comment) {
        return $http.post('/posts/' + id + '/comments', comment, {
            headers: { Authorization: 'Bearer ' + auth.getToken() }
        });
    };
    o.upvoteComment = function (post, comment) {
        return $http.put('/posts/' + post + '/comments/' + comment._id + '/upvote', null, {
            headers: { Authorization: 'Bearer ' + auth.getToken() }
        }).success(function (data) {
              comment.upvotes += 1;
          });
    };

  
   return o;
}]);

app.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};
    auth.saveToken = function (token) {
        $window.localStorage['INFO_MS-token'] = token;
    };

    auth.getToken = function () {
        return $window.localStorage['INFO_MS-token'];
    };

    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.username;
        }
    };

    auth.register = function (user) {
        return $http.post('/register', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function (user) {
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function () {
        $window.localStorage.removeItem('INFO_MS-token');
        return true;
    };

    return auth;
}])

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/projectInfo', {
        templateUrl: '/projectInfo.html',
            controller: 'ProjectInfoCtrl'

    }).when('/', {
        templateUrl: '/home.html',
        controller: 'MainCtrl'
    }).when('/login', {
        templateUrl: '/login.html',
        controller: 'AuthCtrl'
    }).when('/register', {
        templateUrl: '/register.html',
        controller: 'AuthCtrl'
    }).

        otherwise({
        redirectTo: '/'
    });


   
        // route for the contact page
        
}]);






