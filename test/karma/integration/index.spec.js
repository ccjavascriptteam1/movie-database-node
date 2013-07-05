
describe('Movies', function () {
    'use strict';
    var baseUrl = '/movies';
    var addMovieUrl = '/movies/new';

    beforeEach(function () {
        var deleteMovie = function () {
            browser().navigateTo(baseUrl);
            element('table tbody').query(function (tbody, done) {
                var children = tbody.children();

                if (children.length > 0) {
                    element('table tbody a').click();
                    element('.btn-danger').click();
                }

                if (children.length > 1) {
                    deleteMovie();
                }

                done();
            });

        };

        deleteMovie();
        browser().navigateTo(baseUrl);
    });

    it('should be accessible', function () {
        expect(element('h1').text()).toEqual('Movie List');
    });

    it('should allow adding of movies', function () {
        element('.btn-primary').click();
        expect(browser().window().path()).toEqual('/movies/new');
    });

    it('should add movies and forward to the detail view', function () {
        var title = 'Batman: The Dark Knight';
        var description = 'When Batman, Gordon and Harvey Dent...';

        // add movie
        browser().navigateTo(addMovieUrl);
        input('movie.title').enter(title);
        input('movie.description').enter(description);
        element('.btn-primary').click();

        // make sure it has been saved
        expect(browser().window().path()).toMatch(/^\/movies\/.*$/);
        expect(element('h2').text()).toEqual(title);

        // look for it on the overview page
        browser().navigateTo(baseUrl);
        expect(repeater('table tbody tr').count()).toBeGreaterThan(0);

        var titles = ['A', 'B', 'C', 'D', 'E'];

        titles.forEach(function(title) {
                    // add movie
            browser().navigateTo(addMovieUrl);
            input('movie.title').enter(title);
            input('movie.description').enter('TODO');
            element('.btn-primary').click();
        });

    });
});